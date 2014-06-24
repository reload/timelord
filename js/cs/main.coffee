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
    $scope.user_modal = true
    $scope.user = user

    data = [
      {
        value: 30,
        color:"#F7464A"
      },
      {
        value : 50,
        color : "#E2EAE9"
      },
      {
        value : 100,
        color : "#D4CCC5"
      },
      {
        value : 40,
        color : "#949FB1"
      },
      {
        value : 120,
        color : "#4D5360"
      }
    ]

    # Execute doughnut chart.
    doughnut('myChart', data)


# Adapter to easily execute doughnut charts.
doughnut = (id, data, options = null) ->
  ctx = document.getElementById(id).getContext('2d')
  new Chart(ctx).Doughnut(data, options)
