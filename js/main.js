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
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + user.converted_user_id + '/normal.jpg';
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
    $scope.toggleStats = function(user) {
      var data, gold, green, red;
      console.log(user);
      $scope.user_modal = true;
      $scope.user = user;
      $scope.user.registered_hours_percent = Math.round(user.hours_registered / user.hours_goal * 100);
      if (user.extra.illness !== false) {
        $scope.user.extra.show_illness = true;
        $scope.user.extra.illness.hours = user.extra.illness.normal + user.extra.illness.child;
      }
      data = [];
      green = '#428F3E';
      red = '#BE0323';
      gold = '#FFD700';
      if (user.hours_registered < user.hours_goal) {
        data.push({
          value: user.hours_registered,
          color: green
        });
        data.push({
          value: user.hours_goal - user.hours_registered,
          color: red
        });
      } else if (user.hours_registered > user.hours_goal) {
        data.push({
          value: user.hours_goal,
          color: green
        });
        data.push({
          value: user.hours_registered - user.hours_goal,
          color: gold
        });
      } else if (user.hours_registered === user.hours_goal) {
        data.push({
          value: user.hours_registered,
          color: green
        });
      }
      return doughnut('hours-chart', data);
    };
    return $scope.userModal = function(user_modal) {
      return $scope.user_modal = user_modal;
    };
  });

  doughnut = function(id, data, options) {
    var ctx;
    if (options == null) {
      options = null;
    }
    ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx).Doughnut(data, options);
  };

}).call(this);
