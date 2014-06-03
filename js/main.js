(function() {
  var app;

  app = angular.module('TimeKingApp', []);

  app.controller('TimeKing', function($scope, $http) {
    var fetchData;
    fetchData = function() {
      return $http.get('tester.json').success(function(data, status, headers, config) {
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_until_today);
        return angular.forEach(data.ranking, function(user, i) {
          var imageVars;
          imageVars = [user.user_id_first_part, user.user_id_second_part, user.user_id_third_part];
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + imageVars.join('/') + '/normal.jpg';
          return $scope.data = data;
        });
      }).error(function(data, status, headers, config) {});
    };
    fetchData();
    return setInterval(fetchData(), 30000);
  });

}).call(this);
