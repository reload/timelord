(function() {
  var app, doughnut;

  app = angular.module('TimeLordApp', ['angular-loading-bar', 'ngRoute']);

  app.config(function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: 'templates/frontpage.html',
      controller: 'TimeLord'
    });
  });

  app.controller('TimeLord', function($scope, $http) {
    var fetchData, getLoginStatus, getSession;
    $scope.loading = true;
    fetchData = function() {
      return $http.get('inc/feed.php').success(function(data, status, headers, config) {
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_until_today);
        angular.forEach(data.ranking, function(user, i) {
          var imageVars;
          imageVars = [user.user_id_first_part, user.user_id_second_part, user.user_id_third_part].join('/');
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + imageVars + '/normal.jpg';
          return data.ranking[i].group = data.ranking[i].group.toLowerCase();
        });
        $scope.data = data;
        $scope.loading = false;
        return $scope.loginOpen = false;
      }).error(function(data, status, headers, config) {
        $scope.data = data;
        $scope.loading = false;
        return console.log('Error:' + status);
      });
    };
    fetchData();
    setInterval(function() {
      return fetchData();
    }, 300000);
    getLoginStatus = function(msg) {
      $scope.loginMessage = msg;
      return $scope.loginOpen = false;
    };
    getSession = function() {
      var output;
      output = false;
      return $http.post('inc/session.php').success(function(data) {
        $scope.session_user = data.harvester_name;
        return $scope.session = data;
      }).error(function(data, status, headers) {
        return console.log('Error: ' + status);
      });
    };
    getSession();
    $scope.userLogin = function(user, login) {
      var config;
      config = {
        params: {
          user: user
        }
      };
      return $http.post('inc/auth.php', null, config).success(function(data, status, headers, config) {
        getSession();
        fetchData();
        return getLoginStatus('');
      }).error(function(data, status, headers, config) {
        console.log('Error: ' + status);
        return getLoginStatus('NO! WRONG!');
      });
    };
    $scope.userLogout = function() {
      return $http.post('inc/logout.php').success(function(data) {
        getSession();
        return fetchData();
      }).error(function(data, status, headers) {
        return console.log('Error: ' + status);
      });
    };
    return $scope.toggleStats = function(user) {
      var data;
      console.log(user);
      $scope.user_modal = true;
      $scope.user = user;
      data = [
        {
          value: 30,
          color: "#F7464A"
        }, {
          value: 50,
          color: "#E2EAE9"
        }, {
          value: 100,
          color: "#D4CCC5"
        }, {
          value: 40,
          color: "#949FB1"
        }, {
          value: 120,
          color: "#4D5360"
        }
      ];
      return doughnut('myChart', data);
    };
  });

  doughnut = function(id, data, options) {
    var ctx;
    if (options == null) {
      options = null;
    }
    ctx = document.getElementById(id).getContext(' 2d');
    return new Chart(ctx).Doughnut(data, options);
  };

}).call(this);
