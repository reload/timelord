app = angular.module 'TimeLordApp', ['angular-loading-bar', 'ngRoute']

# The router.
app.config ($routeProvider) ->
  $routeProvider.when('/', {
    templateUrl: 'templates/frontpage.html',
    controller: 'TimeLord'
  })

# TimeLord controller.
app.controller 'TimeLord', ($scope, $http) ->

  # Define modal's default states.
  $scope.user_modal = false
  $scope.range_modal = false
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

  # Define input models.
  $scope.type = 'month'
  $scope.from = ''
  $scope.to = ''

  # Set initial date variables (will be overwritten after fetchData request).
  date = new Date()
  $scope.month = $scope.date_options_month[date.getMonth()].value
  $scope.year = date.getFullYear()

  # Define "date/range states" so we only fetch data when we have to,
  # instead of on every value-change.
  from_state = false
  to_state = false

  # Global variables to store "from" and "to" values outside of
  # the individual function-calls.
  from = ''
  to = ''

  # On "range" change.
  $scope.rangeChange = (input) ->
    # Only execute this code, if the "range radio-button" is selected.
    if $scope.type == 'range'
      # Define the range-arguments array.
      range = []
      # If the "from" argument isn't empty.
      if from != ''
        range[0] = '&from=' + from
      # If the "to" argument isn't empty.
      if to != ''
        range[1] = '&to=' + to
      # Input: "from".
      if input == 'from'
        # Remove dashes from the input value.
        from = $scope.from.replace(/-/g, '')
        # If an entire date is provided.
        if from.length == 8
          # Update the feed argument.
          range[0] = '&from=' + from
          # Update the state and fetch new data.
          from_state = true
          fetchData(range)
        # Or if the field is empty.
        else if from.length == 0 && from_state == true
          # Clear the input value & feed argument.
          range[0] = ''
          $scope.from = ''
          # Update state and fetch new data.
          from_state = false
          fetchData(range)

      # Input: "to".
      else if input == 'to'
        # Remove dashes from the input value.
        to = $scope.to.replace(/-/g, '')
        # If an entire date is provided.
        if to.length == 8
          # Update the feed argument.
          range[1] = '&to=' + to
          # Update state and fetch new data.
          to_state = true
          fetchData(range)
        # Or if the field is empty.
        else if to.length == 0 && to_state == true
          # Clear the input value & feed argument.
          $scope.to = ''
          range[1] = ''
          # Update state and fetch new data.
          to_state = false
          fetchData(range)

  # On "month" change.
  $scope.monthChange = () ->
    # Only execute this code if the "month radio-button" is selected.
    if $scope.type == 'month'
      fetchData([
        '&month=' + $scope.month,
        '&year=' + $scope.year
      ])

  # On "type" change.
  $scope.typeChange = () ->
    # If the "range radio" is checked.
    if $scope.type == 'range'
      # Execute the "rangeChange" function for both "from" and "to".
      $scope.rangeChange('from')
      $scope.rangeChange('to')
      # Toggle the state of settings-display.
      $scope.show_range_settings = true
      $scope.show_month_settings = false

    # If the "month radio" is checked.
    else if $scope.type == 'month'
      # Execute the month
      $scope.monthChange()
      # Toggle the state of settings-display.
      $scope.show_range_settings = false
      $scope.show_month_settings = true

  # Url to JSON.
  $scope.loading = true
  fetchData = (args) ->
    args = args || null;

    # Prepare the feed-request.
    url = 'inc/feed.php'
    if args
      url += '?' + args.join('')

    # Execute feed-request.
    $http.get(url)
      .success (data, status, headers, config) ->
        # Get registered percent.
        data.total_percent = Math.round 100*data.hours_total_registered/data.hours_in_range
        # Get user ranking.
        angular.forEach data.ranking, (user, i) ->
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + user.converted_user_id + '/normal.jpg'
          data.ranking[i].group = data.ranking[i].group.toLowerCase()

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
    console.log user
    # Set the user modal as true.
    $scope.user_modal = true
    # Asign the user object to $scrope and provide extra arguments.
    $scope.user = user
    $scope.user.registered_hours_percent = Math.round user.hours_registered / user.hours_goal * 100
    # Check if we have access to the "extra" object.
    if user.extra.length != 0
      # Show the "illness fields" if there's any sickness to report.
      if user.extra.illness != false
        $scope.user.extra.show_illness = true
        $scope.user.extra.illness.hours = user.extra.illness.normal + user.extra.illness.child

    # Time chart.
    # -----------
    # There are 3 possible "charts". If you're in plus/minus or spot on,
    # so we want to check where the user is and push relevant data.
    data = []
    green = '#428F3E'
    red = '#BE0323'
    gold = '#FFD700'

    # If the user needs to WORK MOAR!.
    if user.hours_registered < user.hours_goal
      data.push {
        value: user.hours_registered,
        color: green
      }
      data.push {
        value: user.hours_goal - user.hours_registered,
        color: red
      }
    # If the user is over the goal. GOOD JAWB!
    else if user.hours_registered > user.hours_goal
      data.push {
        value: user.hours_goal,
        color: green
      }
      data.push {
        value: user.hours_registered - user.hours_goal,
        color: gold
      }
    # If the amount of registered hours match the goal.
    else if user.hours_registered == user.hours_goal
      data.push {
        value: user.hours_registered,
        color: green
      }

    # Chart options.
    options = {
      segmentStrokeWidth : 1
    }

    # Execute the chart.
    doughnut('hours-chart', data, options)

  # Close user-modal
  $scope.modalState = (name, state) ->
    switch name
      when 'user_modal'
        $scope.user_modal = state
      when 'range_modal'
        $scope.range_modal = state

# Adapter to easily execute doughnut charts.
doughnut = (id, data, options = null) ->
  # We need to define the width / height on every init since there
  # is a but with retina displays, where the size double every
  # time you create a new graph.
  document.getElementById(id).setAttribute('width', '225px')
  document.getElementById(id).setAttribute('height', '225px')
  # Get context and init the chart.
  ctx = document.getElementById(id).getContext('2d')
  new Chart(ctx).Doughnut(data, options)
