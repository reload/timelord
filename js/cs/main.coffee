app = angular.module 'TimeLordApp', ['angular-loading-bar', 'ngRoute']

# The router.
app.config ($routeProvider, $locationProvider) ->
  # Set the behaviour for routes.
  $routeProvider.when('/', {
    templateUrl: 'templates/frontpage.html',
    controller: 'TimeLord'
  })
  # Allow the following route parameters.
  .when('/:from/:to/:month/:year', {
    templateUrl: 'templates/frontpage.html',
    controller: 'TimeLord'
  })

  # Remove the "/#/" from the URL.
  $locationProvider.html5Mode(true)

# TimeLord controller.
app.controller 'TimeLord', ($scope, $http, $routeParams, $location) ->

  # Define modal's default states.
  $scope.user_modal = false
  $scope.range_modal = false
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

  # Set the default values for the "from" and "to" arguments.
  if getParam('from')?
    $scope.from = getParam('from')
  else
    $scope.from = ''
  # Define default "to" value.
  if getParam('to')?
    $scope.to = getParam('to')
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
      setParams({
        from: from,
        to: to
      })
    # If "from" is set.
    else if from.length == 8
      setParams({
        from: from
      })
    # If "to" is set.
    else if to.length == 8
      setParams({
        to: to
      })

  # On "month" change.
  $scope.monthChange = () ->
    # Set the route parameters.
    setParams({
      month: $scope.month,
      year: $scope.year
    })

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
    # Check for arguments and repare the feed-request.
    url = 'inc/feed.php?'
    if $routeParams.from
      url += '&from=' + $routeParams.from
    if $routeParams.to
      url += '&to=' + $routeParams.to
    if $routeParams.month
      url += '&month=' + $routeParams.month
    if $routeParams.year
      url += '&year=' + $routeParams.year

    # Execute feed-request.
    $http.get(url)
      .success (data, status, headers, config) ->
        # Make the total amount of hours an integer instead of float.
        data.hours_total_registered = parseInt(data.hours_total_registered, 10)
        # Get registered percent.
        data.total_percent = Math.round 100*data.hours_total_registered/data.hours_in_range

        # Get user ranking.
        angular.forEach data.ranking, (user, i) ->
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + user.converted_user_id + '/normal.jpg'
          data.ranking[i].group = data.ranking[i].group.toLowerCase()
          # Set icon for the group.
          switch data.ranking[i].group
            when "a-karmahunter"
              data.ranking[i].group_icon = '★'
              data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
            when "b-goalie"
              data.ranking[i].group_icon = '✓'
              data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
            when "c-karmauser"
              data.ranking[i].group_icon = '☂'
              data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
            when "d-slacker"
              data.ranking[i].group_icon = '☁'
              data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';

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
    # Colors for the charts.
    colors = {
      green: {
        main: '#8FA77B',
        highlight: '#9cb18a'
      }
      red: {
        main: '#bf616a',
        highlight: '#c6737b'
      }
      yellow: {
        main: '#F7D77C',
        highlight: '#f8de94'
      }
      purple: {
        main: '#b48ead',
        highlight: '#be9db8'
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

  # Close user-modal
  $scope.modalState = (name, state) ->
    switch name
      when 'user_modal'
        $scope.user_modal = state
      when 'range_modal'
        $scope.range_modal = state

  # Set the URL parameters.
  setParams = (obj) ->
    $location.search(obj)

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

# Get URL parameters like PHP's "$_GET[]".
getParam = (name) ->
  # Regular Expression to look for params after "?" and "&".
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  # If we had a match with the name of the parameter.
  if results = regex.exec(location.search)
    # Return the value of the parameter.
    results[1]

# Make sure numbers only have up to 2 decimals.
roundNumber = (num) ->
  Math.round(num * 100) / 100
