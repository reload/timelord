app = angular.module 'TimeLordApp', ['angular-loading-bar', 'ngRoute']

# The router.
app.config ($routeProvider, $locationProvider) ->
  # Set the behaviour for routes.
  $routeProvider.when('/', {
    templateUrl: 'templates/frontpage.html',
    controller: 'TimeLord',
    reloadOnSearch: false
  })

  # Remove the "/#/" from the URL.
  $locationProvider.html5Mode(true).hashPrefix('!')

# TimeLord controller.
app.controller 'TimeLord', ($scope, $http, $routeParams, $location) ->
  # Get the document.
  $doc = angular.element document;

  # Define modal's default states.
  $scope.user_modal = false
  $scope.range_modal = false
  if $routeParams.from
    $scope.type = 'range'
    $scope.show_range_settings = true
  else
    $scope.type = 'month'
    $scope.show_month_settings = true

  # Set the choices for the "month selector".
  $scope.date_options_month = [
    { value: "jan", name: "January" }
    { value: "feb", name: "February" }
    { value: "mar", name: "March" }
    { value: "apr", name: "April" }
    { value: "may", name: "May" }
    { value: "jun", name: "June" }
    { value: "jul", name: "July" }
    { value: "aug", name: "August" }
    { value: "sep", name: "September" }
    { value: "oct", name: "October" }
    { value: "nov", name: "November" }
    { value: "dec", name: "December" }
  ]

  # Convert the current month to the full name of the month.
  # Example: "jan" -> "January".
  $scope.converted_month = (val) ->
    # Loop through the "months array".
    for object in $scope.date_options_month
      # When the argument matches the month.
      if (object.value == val.toLowerCase()) or (object.name.toLowerCase() == val.toLowerCase())
        # Return the name.
        return object.name

  # Set the default values for the "from" and "to" arguments.
  if $routeParams.from
    $scope.from = $routeParams.from
  else
    $scope.from = ''
  # Define default "to" value.
  if $routeParams.to
    $scope.to = $routeParams.to
  else
    $scope.to = ''

  # Set the default values for the "month" and "year" arguments.
  date = new Date()
  if $routeParams.month
    $scope.month = $routeParams.month
  else
    $scope.month = $scope.date_options_month[date.getMonth()].value
  if $routeParams.year
    $scope.year = parseInt($routeParams.year, 10)
  else
    $scope.year = date.getFullYear()

  # On "range" change.
  $scope.rangeChange = () ->
    # Remove possible dashes from the input values.
    from = $scope.from.replace(/-/g, '')
    to = $scope.to.replace(/-/g, '')

    # If both "from" and "to" is set and doesn't equal the previous value.
    if from.length == 8 && to.length == 8
      $location.search({
        from: $scope.from,
        to: $scope.to
      })
      fetchData()
    # If "from" is set.
    else if from.length == 8
      $location.search({
        from: $scope.from
      })
      fetchData()
    # If "to" is set.
    else if to.length == 8
      $location.search({
        to: $scope.to
      })
      fetchData()

  # On "month" change.
  $scope.monthChange = () ->
    # Set the route parameters.
    $location.search({
      month: $scope.month,
      year: $scope.year
    })
    fetchData()

  # On "type" change.
  $scope.typeChange = () ->
    # If the "range radio" is checked.
    if $scope.type == 'range'
      # Toggle the state of settings-display.
      $scope.show_range_settings = true
      $scope.show_month_settings = false

    # If the "month radio" is checked.
    else if $scope.type == 'month'
      # Toggle the state of settings-display.
      $scope.show_range_settings = false
      $scope.show_month_settings = true

  # Url to JSON.
  $scope.loading = true
  fetchData = () ->
    # Check for arguments and prepare the feed-request.
    url = 'inc/feed.php?'
    # Range.
    if $scope.type == 'range'
      if ($routeParams.from) or ($scope.from != '')
        url += '&from=' + $scope.from.replace(/-/g, '')
      if ($routeParams.to) or ($scope.to != '')
        url += '&to=' + $scope.to.replace(/-/g, '')
    # Month.
    if ($scope.type == 'month')
      if (($routeParams.month) or ($scope.month != ''))
        url += '&month=' + $scope.month
      if (($routeParams.year) or ($scope.year != ''))
        url += '&year=' + $scope.year

    # Execute feed-request.
    $http.get(url)
      .success (data, status, headers, config) ->
        # Make the total amount of hours an integer instead of float.
        data.hours_total_registered = parseInt(data.hours_total_registered, 10)
        # Get registered percent.
        data.total_percent = Math.round 100 * data.hours_total_registered / data.hours_in_range
        data.hours_in_range = parseInt(data.hours_in_range, 10)

        # Check if there's any user-id's in the URL.
        if hashtag() != ''
          user_id = hashtag();

        # Loop though each user.
        angular.forEach data.users, (user, i) ->
          # Compare a possible user-id in the URL.
          if (user_id) and (user_id == String(user.id).replace(/\//g, ''))
            $scope.toggleStats(user)

          # Calculate the avarage amount of hours a person is over/under the expected goal.
          # 30min overtime per day = 0.5
          # 2 hours short per day= -2
          total_hours_difference = (user.hours_registered - user.hours_goal)
          avg_hours_difference = (total_hours_difference / data.misc.working_days_in_range)

          # Define the "user rank object" & provide the difference.
          data.users[i].rank = {}
          data.users[i].rank.value = avg_hours_difference

          # If the user has been working:
          # More than 30min extra per day OR 12 hours in total
          if avg_hours_difference >= 0.5 or total_hours_difference > 12
            data.users[i].rank.class = 'a-karmahunter'
            data.users[i].rank.icon = '★'
            data.users[i].rank.text = "A career is wonderful, but you can’t curl up with it on a cold night."
          # Between +29min to -15min per day but no less than -16 hours in total.
          else if (avg_hours_difference < 0.5 and avg_hours_difference > -0.25) and (total_hours_difference > -16)
            data.users[i].rank.class = 'b-goalie'
            data.users[i].rank.icon = '✓'
            data.users[i].rank.text = "Hot damn, right on target. As they say: Arbeit macht frei :-)"
          # Between: -15min to -60min per day but no less than -16 hours in total
          else if (avg_hours_difference <= -0.25 and avg_hours_difference >= -1) and (total_hours_difference > -16)
            data.users[i].rank.class = 'c-karmauser'
            data.users[i].rank.icon = '☂'
            data.users[i].rank.text = "There’s never enough time to do all the nothing you want."
          # Anything less than -30min per day.
          else
            data.users[i].rank.class = 'd-slacker'
            data.users[i].rank.icon = '☁'
            data.users[i].rank.text = "I slack, therefore, I am doing nothing."

          # primarily for debugging use. Add the total hour diff to the class.
          #data.users[i].rank.class += ' ' + total_hours_difference.toFixed(2) + ' ' + avg_hours_difference.toFixed(2)

        # Output to scope.
        $scope.data = data
        $scope.loading = false
        $scope.loginOpen = false

        # The reason we create a new instance of the date is the following:
        # In theory there could have been a year-change since the last
        # page-request, so we have to create a new instance of the
        # date, on every data-request.
        date = new Date()
        # If the first entry was created this year.
        if parseInt(data.misc.first_entry.year, 10) == date.getFullYear()
          $scope.date_options_year = [{
            value: data.misc.first_entry.year,
            year: data.misc.first_entry.year
          }]
        # If the first entry was created before this year.
        if data.misc.first_entry.year < date.getFullYear()
          year = data.misc.first_entry.year
          $scope.date_options_year = []
          while year <= date.getFullYear()
            $scope.date_options_year.push {
              value: year,
              year: year
            }
            year++
          # Reverse the array to get the "greatest" year, first.
          $scope.date_options_year.reverse()

      .error (data ,status, headers, config) ->
        $scope.data  = data
        $scope.loading = false
        console.log 'Error:' + status


  # Trigger and loop fetch function.
  fetchData()
  setInterval ()->
    fetchData()
  , 300000

  # Set login message.
  getLoginStatus = (msg) ->
    $scope.loginMessage = msg
    $scope.loginOpen = false

  # Check if session is active.
  getSession = () ->
    output = false
    $http.post 'inc/session.php'
    .success (data) ->
      $scope.session_user = data.harvester_name
      $scope.session = data

    .error (data, status, headers) ->
      console.log 'Error: ' + status

  getSession()

  # User login.
  $scope.userLogin = (user, login) ->
    config =
      params :
        user: user

    $http.post 'inc/auth.php', null, config

      .success (data, status, headers, config) ->
        getSession()
        fetchData()
        getLoginStatus ''

      .error (data, status, headers, config) ->
        console.log 'Error: ' + status
        getLoginStatus 'NO! WRONG!'

  # User logout.
  $scope.userLogout = () ->
    $http.post 'inc/logout.php'

      .success (data) ->
        getSession()
        fetchData()

      .error (data, status, headers) ->
        console.log 'Error: ' + status

  # User click function.
  $scope.toggleStats = (user) ->
    # Set hash-value to be the user id.
    hashtag(user.id)
    # Set the user modal as true.
    $scope.user_modal = true
    # Asign the user object to $scrope and provide extra arguments.
    $scope.user = user
    # Percent of how many hours the user registered compared to the expeced amount.
    $scope.user.registered_hours_percent = Math.round user.hours_registered / user.hours_goal * 100
    # Check if we have access to the "extra" object.
    if user.extra.length != 0
      # Percent of how many of the users hours that are billable compared
      # to the expected amount (not taking overtime into account).
      $scope.user.extra.billable_hours_percent = roundNumber(user.extra.billable / user.hours_goal * 100)
      # Show the "illness fields" if there's any sickness to report.
      if user.extra.illness != false
        $scope.user.extra.show_illness = true
        $scope.user.extra.illness.hours = user.extra.illness.normal + user.extra.illness.child

    # Time chart.
    # -----------
    # There are 3 possible "charts". If you're in plus/minus or spot on,
    # so we want to check where the user is and push relevant data.
    data = []
    # Colors for the charts.
    colors = {
      green: {
        main: '#76caa3',
        highlight: '#98d7b9'
      }
      red: {
        main: '#bf616a',
        highlight: '#c6737b'
      }
      yellow: {
        main: '#efab00',
        highlight: '#f6d57f'
      }
      purple: {
        main: '#786492',
        highlight: '#998aad'
      }
    }
    # Label text.
    label_text = {
      green: 'Hours',
      red: 'Hours',
      yellow: 'Hours',
      purple: 'Hours'
    }
    # Labels toggle state.
    $scope.label_state = []
    $scope.label_state[0] = false # Green.
    $scope.label_state[1] = false # Red.
    $scope.label_state[2] = false # Yellow.
    $scope.label_state[3] = false # Purple.

    # Round the numbers we're working with.
    hours_registered = roundNumber(user.hours_registered)
    hours_goal = roundNumber(user.hours_goal)

    # If the user needs to WORK MOAR!.
    if hours_registered < hours_goal
      # Registered time.
      data.push {
        value: hours_registered,
        color: colors.green.main,
        highlight: colors.green.highlight,
        label: label_text.green
      }
      # Time behind.
      data.push {
        value: roundNumber(hours_goal - hours_registered),
        color: colors.red.main,
        highlight: colors.red.highlight,
        label: label_text.red
      }
      # What labels to display.
      $scope.label_state[0] = true
      $scope.label_state[1] = true
    # If the user is over the goal. GOOD JAWB!
    else if hours_registered > hours_goal
      # Registered time.
      data.push {
        value: hours_goal,
        color: colors.green.main,
        highlight: colors.green.highlight,
        label: label_text.green
      }
      # Overtime.
      data.push {
        value: roundNumber(hours_registered - hours_goal),
        color: colors.yellow.main,
        highlight: colors.yellow.highlight,
        label: label_text.yellow
      }
      # What labels to display.
      $scope.label_state[0] = true
      $scope.label_state[2] = true
    # If the amount of registered hours match the goal.
    else if hours_registered == hours_goal
      # Registered time.
      data.push {
        value: hours_registered,
        color: colors.green.main,
        highlight: colors.green.highlight,
        label: label_text.green
      }
      # What labels to display.
      $scope.label_state[0] = true

    # Chart options.
    options = {
      segmentStrokeWidth : 1
    }

    # Execute the chart.
    doughnut('hours-chart', data, options)

  # Trigger events on keydown.
  $doc.on 'keydown', (e) ->
    # Key: ESC.
    if e.keyCode == 27
      # Close the user modal.
      if $scope.user_modal == true
        $scope.modalState 'user_modal', false
      # Close the range modal.
      else if $scope.range_modal == true
        $scope.modalState 'range_modal', false
      else if $scope.loginOpen == true
        $scope.modalState 'loginOpen', false

  # Close user-modal
  $scope.modalState = (name, state) ->
    # Set the state of the modal.
    $scope[name] = state
    # Remove the hash-value from the URL.
    hashtag(' ')

# Adapter to easily execute doughnut charts.
doughnut = (id, data, options = null) ->
  # Even though the data is reset and a new instance of the graph
  # is created, the old graph still hangs on to the canvas, so we
  # have to remove the old canvas and create a new one to
  # completely reset it.
  $('canvas#' + id).after($('<canvas>', {id: id})).remove()

  # We need to force the width / height on every init since there
  # is a bug with retina displays, where the size doubles every
  # time you create a new graph.
  document.getElementById(id).setAttribute('width', '225px')
  document.getElementById(id).setAttribute('height', '225px')

  # Get context and init the chart.
  ctx = document.getElementById(id).getContext('2d')
  new Chart(ctx).Doughnut(data, options)

# Make sure numbers only have up to 2 decimals.
roundNumber = (num) ->
  Math.round(num * 100) / 100

# A shorthand function to handle "hash".
hashtag = (val) ->
  # Set default value to the "val" parameter.
  val = val || null
  # If a value is given.
  if val
    # Make sure the hash value is a string, so we can "replace".
    val = String(val)
    # Replace possible slashes and set the hash value.
    window.location.hash = val.replace(/\//g, '')
  # Else just return the hash-value (without the hashtag).
  else
    window.location.hash.substring(1)
