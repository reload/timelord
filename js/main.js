(function() {
  var app;

  app = angular.module('TimeKingApp', []);

  app.controller('TimeKing', function($scope, $http) {
    var fetchData;
    fetchData = function() {
      return $http.get('feed.php').success(function(data, status, headers, config) {
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_until_today);
        angular.forEach(data.ranking, function(user, i) {
          var imageVars;
          imageVars = [user.user_id_first_part, user.user_id_second_part, user.user_id_third_part].join('/');
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + imageVars + '/normal.jpg';
          return data.ranking[i].group = data.ranking[i].group.toLowerCase();
        });
        return $scope.data = data;
      }).error((function(data, status, headers, config) {
        return console.log('Error:' + status);
      }));
    };
    fetchData();
    setInterval(function() {
      return fetchData();
    }, 300000);
    $scope.userLogin = function (user, login) {
      var config = {
        params: {
          user: user
        }
      };

      $http.post("auth.php", null, config)
        .success(function (data, status, headers, config) {
          $scope[login] = data;
        })
        .error(function (data, status, headers, config) {
          $scope[login] = "SUBMIT ERROR";
        });
    };
    return $scope.toggleStats = function(user) {
      console.log($scope);
      return console.log(user);
    };
  });

}).call(this);
