app = angular.module 'TimeKingApp', []

app.controller 'TimeKing', ($scope, $http) ->
  # Url to JSON.
  fetchData = () ->
    $http.get('tester.json')
      .success((data, status, headers, config) ->
        # Get registered percent.
        data.total_percent = Math.round 100*data.hours_total_registered/data.hours_until_today
        # Get user ranking.
        angular.forEach data.ranking, (user, i) ->
          imageVars = [
            user.user_id_first_part,
            user.user_id_second_part,
            user.user_id_third_part
          ]

          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + imageVars.join('/') + '/normal.jpg'

          # Output to scope.
          $scope.data = data
      ).error (data ,status, headers, config) ->
  # Trigger and loop fetch function.
  fetchData()
  setInterval fetchData(), 30000
