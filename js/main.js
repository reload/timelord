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
    var date, fetchData, from_state, getLoginStatus, getSession, to_state;
    $scope.user_modal = false;
    $scope.range_modal = true;
    $scope.date_options_month = [
      {
        value: "jan",
        name: "January"
      }, {
        value: "feb",
        name: "February"
      }, {
        value: "mar",
        name: "March"
      }, {
        value: "apr",
        name: "April"
      }, {
        value: "may",
        name: "May"
      }, {
        value: "jun",
        name: "June"
      }, {
        value: "jul",
        name: "July"
      }, {
        value: "aug",
        name: "August"
      }, {
        value: "sep",
        name: "September"
      }, {
        value: "oct",
        name: "October"
      }, {
        value: "nov",
        name: "November"
      }, {
        value: "dec",
        name: "December"
      }
    ];
    $scope.type = 'month';
    $scope.from = '';
    $scope.to = '';
    date = new Date();
    $scope.month = $scope.date_options_month[date.getMonth()].value;
    $scope.year = date.getFullYear();
    from_state = false;
    to_state = false;
    $scope.rangeChange = function(input) {
      var range;
      if ($scope.type === 'range') {
        range = [];
        range[0] = '&from=' + $scope.from;
        range[1] = '&to=' + $scope.to;
        if (input === 'from') {
          $scope.from.replace(/-/g, '');
          if ($scope.from.length === 8) {
            range[0] = '&from=' + $scope.from;
            from_state = true;
            return fetchData(range);
          } else if ($scope.from.length === 0 && from_state === true) {
            range[0] = '';
            $scope.from = '';
            from_state = false;
            return fetchData(range);
          }
        } else if (input === 'to') {
          $scope.to.replace(/-/g, '');
          if ($scope.to.length === 8) {
            range[1] = '&to=' + $scope.to;
            to_state = true;
            return fetchData(range);
          } else if ($scope.to.length === 0 && to_state === true) {
            $scope.to = '';
            range[1] = '';
            to_state = false;
            return fetchData(range);
          }
        }
      }
    };
    $scope.monthChange = function() {
      if ($scope.type === 'month') {
        return fetchData(['&month=' + $scope.month, '&year=' + $scope.year]);
      }
    };
    $scope.typeChange = function() {
      if ($scope.type === 'range') {
        $scope.rangeChange('from');
        return $scope.rangeChange('to');
      } else if ($scope.type === 'month') {
        return $scope.monthChange();
      }
    };
    $scope.loading = true;
    fetchData = function(args) {
      var url;
      args = args || null;
      url = 'inc/feed.php';
      if (args) {
        url += '?' + args.join('');
      }
      return $http.get(url).success(function(data, status, headers, config) {
        var year;
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_in_range);
        angular.forEach(data.ranking, function(user, i) {
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + user.converted_user_id + '/normal.jpg';
          return data.ranking[i].group = data.ranking[i].group.toLowerCase();
        });
        $scope.data = data;
        $scope.loading = false;
        $scope.loginOpen = false;
        date = new Date();
        if (parseInt(data.misc.first_entry.year, 10) === date.getFullYear()) {
          $scope.date_options_year = [
            {
              value: data.misc.first_entry.year,
              year: data.misc.first_entry.year
            }
          ];
        }
        if (data.misc.first_entry.year < date.getFullYear()) {
          year = data.misc.first_entry.year;
          $scope.date_options_year = [];
          while (year <= date.getFullYear()) {
            $scope.date_options_year.push({
              value: year,
              year: year
            });
            year++;
          }
          return $scope.date_options_year.reverse();
        }
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
      var data, gold, green, options, red;
      console.log(user);
      $scope.user_modal = true;
      $scope.user = user;
      $scope.user.registered_hours_percent = Math.round(user.hours_registered / user.hours_goal * 100);
      if (user.extra.length !== 0) {
        if (user.extra.illness !== false) {
          $scope.user.extra.show_illness = true;
          $scope.user.extra.illness.hours = user.extra.illness.normal + user.extra.illness.child;
        }
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
      options = {
        segmentStrokeWidth: 1
      };
      return doughnut('hours-chart', data, options);
    };
    return $scope.modalState = function(name, state) {
      switch (name) {
        case 'user_modal':
          return $scope.user_modal = state;
        case 'range_modal':
          return $scope.range_modal = state;
      }
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
