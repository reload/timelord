app = angular.module 'TimeKingApp', []

app.controller 'TimeKing', ($scope, $http) ->
  # Url to JSON.
  fetchData = () ->
    $http.get('feed.php')
      .success((data, status, headers, config) ->
        # Get registered percent.
        data.total_percent = Math.round 100*data.hours_total_registered/data.hours_until_today
        # Get user ranking.
        angular.forEach data.ranking, (user, i) ->
          imageVars = [
            user.user_id_first_part,
            user.user_id_second_part,
            user.user_id_third_part
          ].join('/')


          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + imageVars + '/normal.jpg'
          data.ranking[i].group = data.ranking[i].group.toLowerCase()

          # Output to scope.
        $scope.data = data
      ).error ((data ,status, headers, config) ->
        console.log 'Error:' + status
      )
  # Trigger and loop fetch function.
  fetchData()
  setInterval ()->
    fetchData()
  , 300000

  $scope.userLogin = (user, login) ->
    config =
      params :
        user: user
    }

    $http.post 'auth.php', null, config

      .success (data, status, headers, config) ->
        $scope[login] = data

      .error (data, status, headers, config) ->
        console.log 'Error: ' + status

  # User click function.
  $scope.toggleStats = (user) ->
    console.log $scope
    console.log user
