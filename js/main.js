(function() {
  var app, doughnut, getParam;

  app = angular.module('TimeLordApp', ['angular-loading-bar', 'ngRoute']);

  app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'templates/frontpage.html',
      controller: 'TimeLord'
    }).when('/:from/:to/:month/:year', {
      templateUrl: 'templates/frontpage.html',
      controller: 'TimeLord'
    });
    return $locationProvider.html5Mode(true);
  });

  app.controller('TimeLord', function($scope, $http, $routeParams, $location) {
    var date, fetchData, getLoginStatus, getSession, setParams;
    $scope.user_modal = false;
    $scope.range_modal = false;
    $scope.type = 'month';
    $scope.show_month_settings = true;
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
    if (getParam('from') != null) {
      $scope.from = getParam('from');
    } else {
      $scope.from = '';
    }
    if (getParam('to') != null) {
      $scope.to = getParam('to');
    } else {
      $scope.to = '';
    }
    date = new Date();
    if ($routeParams.month) {
      $scope.month = $routeParams.month;
    } else {
      $scope.month = $scope.date_options_month[date.getMonth()].value;
    }
    if ($routeParams.year) {
      $scope.year = parseInt($routeParams.year, 10);
    } else {
      $scope.year = date.getFullYear();
    }
    $scope.rangeChange = function() {
      var from, to;
      from = $scope.from.replace(/-/g, '');
      to = $scope.to.replace(/-/g, '');
      if (from.length === 8 && to.length === 8) {
        return setParams({
          from: from,
          to: to
        });
      } else if (from.length === 8) {
        return setParams({
          from: from
        });
      } else if (to.length === 8) {
        return setParams({
          to: to
        });
      }
    };
    $scope.monthChange = function() {
      return setParams({
        month: $scope.month,
        year: $scope.year
      });
    };
    $scope.typeChange = function() {
      if ($scope.type === 'range') {
        $scope.show_range_settings = true;
        return $scope.show_month_settings = false;
      } else if ($scope.type === 'month') {
        $scope.show_range_settings = false;
        return $scope.show_month_settings = true;
      }
    };
    $scope.loading = true;
    fetchData = function() {
      var url;
      url = 'inc/feed.php?';
      if ($routeParams.from) {
        url += '&from=' + $routeParams.from;
      }
      if ($routeParams.to) {
        url += '&to=' + $routeParams.to;
      }
      if ($routeParams.month) {
        url += '&month=' + $routeParams.month;
      }
      if ($routeParams.year) {
        url += '&year=' + $routeParams.year;
      }
      console.log(url);
      return $http.get(url).success(function(data, status, headers, config) {
        var year;
        data.hours_total_registered = parseInt(data.hours_total_registered, 10);
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_in_range);
        angular.forEach(data.ranking, function(user, i) {
          data.ranking[i].imageUrl = 'https://proxy.harvestfiles.com/production_harvestapp_public/uploads/users/avatar/' + user.converted_user_id + '/normal.jpg';
          data.ranking[i].group = data.ranking[i].group.toLowerCase();
          switch (data.ranking[i].group) {
            case "a-karmahunter":
              data.ranking[i].group_icon = '★';
              return data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
            case "b-goalie":
              data.ranking[i].group_icon = '✓';
              return data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
            case "c-karmauser":
              data.ranking[i].group_icon = '☂';
              return data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
            case "d-slacker":
              data.ranking[i].group_icon = '☁';
              return data.ranking[i].group_text = 'Arbejder derudaf, rammer timerne perfekt. Sådan!';
          }
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
    $scope.modalState = function(name, state) {
      switch (name) {
        case 'user_modal':
          return $scope.user_modal = state;
        case 'range_modal':
          return $scope.range_modal = state;
      }
    };
    return setParams = function(obj) {
      return $location.search(obj);
    };
  });

  doughnut = function(id, data, options) {
    var ctx;
    if (options == null) {
      options = null;
    }
    document.getElementById(id).setAttribute('width', '225px');
    document.getElementById(id).setAttribute('height', '225px');
    ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx).Doughnut(data, options);
  };

  getParam = function(name) {
    var regex, results;
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    if (results = regex.exec(location.search)) {
      return results[1];
    }
  };

}).call(this);
