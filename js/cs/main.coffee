app = angular.module 'TimeLordApp', ['angular-loading-bar', 'ngRoute']

# The router.
app.config ($routeProvider) ->
  $routeProvider.when('/', {
    templateUrl: 'templates/frontpage.html',
    controller: 'TimeLord'
  })

# TimeLord controller.
app.controller 'TimeLord', ($scope, $http) ->
  # Url to JSON.
  $scope.loading = true
  fetchData = () ->
    $http.get('inc/feed.php')
      .success (data, status, headers, config) ->
        # Get registered percent.
        data.total_percent = Math.round 100*data.hours_total_registered/data.hours_until_today
        # Get user ranking.
        angular.forEach data.ranking, (user, i) ->
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + user.converted_user_id + '/normal.jpg'
          data.ranking[i].group = data.ranking[i].group.toLowerCase()

        # Output to scope.
        $scope.data = data
        $scope.loading = false
        $scope.loginOpen = false

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

    # Execute the chart.
    doughnut('hours-chart', data)

  # Close user-modal
  $scope.userModal = (user_modal) ->
    $scope.user_modal = user_modal

# Adapter to easily execute doughnut charts.
doughnut = (id, data, options = null) ->
  ctx = document.getElementById(id).getContext('2d')
  new Chart(ctx).Doughnut(data, options)
