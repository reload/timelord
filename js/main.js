(function() {
  var app, doughnut, hashtag, roundNumber;

  app = angular.module('TimeLordApp', ['angular-loading-bar', 'ngRoute']);

  app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'templates/frontpage.html',
      controller: 'TimeLord',
      reloadOnSearch: false
    });
    return $locationProvider.html5Mode(true).hashPrefix('!');
  });

  app.controller('TimeLord', function($scope, $http, $routeParams, $location) {
    var $doc, date, fetchData, getLoginStatus, getSession;
    $doc = angular.element(document);
    $scope.user_modal = false;
    $scope.range_modal = false;
    if ($routeParams.from) {
      $scope.type = 'range';
      $scope.show_range_settings = true;
    } else {
      $scope.type = 'month';
      $scope.show_month_settings = true;
    }
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
    $scope.converted_month = function(val) {
      var object, _i, _len, _ref;
      _ref = $scope.date_options_month;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        if ((object.value === val.toLowerCase()) || (object.name.toLowerCase() === val.toLowerCase())) {
          return object.name;
        }
      }
    };
    if ($routeParams.from) {
      $scope.from = $routeParams.from;
    } else {
      $scope.from = '';
    }
    if ($routeParams.to) {
      $scope.to = $routeParams.to;
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
        $location.search({
          from: $scope.from,
          to: $scope.to
        });
        return fetchData();
      } else if (from.length === 8) {
        $location.search({
          from: $scope.from
        });
        return fetchData();
      } else if (to.length === 8) {
        $location.search({
          to: $scope.to
        });
        return fetchData();
      }
    };
    $scope.monthChange = function() {
      $location.search({
        month: $scope.month,
        year: $scope.year
      });
      return fetchData();
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
      if ($scope.type === 'range') {
        if ($routeParams.from || ($scope.from !== '')) {
          url += '&from=' + $scope.from.replace(/-/g, '');
        }
        if ($routeParams.to || ($scope.to !== '')) {
          url += '&to=' + $scope.to.replace(/-/g, '');
        }
      }
      if ($scope.type === 'month') {
        if ($routeParams.month || ($scope.month !== '')) {
          url += '&month=' + $scope.month;
        }
        if ($routeParams.year || ($scope.year !== '')) {
          url += '&year=' + $scope.year;
        }
      }
      return $http.get(url).success(function(data, status, headers, config) {
        var user_id, year;
        data.hours_total_registered = parseInt(data.hours_total_registered, 10);
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_in_range);
        data.hours_in_range = parseInt(data.hours_in_range, 10);
        if (hashtag() !== '') {
          user_id = hashtag();
        }
        angular.forEach(data.users, function(user, i) {
          var avg_hours_difference, total_hours_difference;
          if (user_id && (user_id === String(user.id).replace(/\//g, ''))) {
            $scope.toggleStats(user);
          }
          total_hours_difference = user.hours_registered - user.hours_goal;
          avg_hours_difference = total_hours_difference / data.misc.working_days_in_range;
          data.users[i].rank = {};
          data.users[i].rank.value = avg_hours_difference;
          if (avg_hours_difference >= 0.5 || total_hours_difference > 12) {
            data.users[i].rank["class"] = 'a-karmahunter';
            data.users[i].rank.icon = '★';
            return data.users[i].rank.text = "A career is wonderful, but you can’t curl up with it on a cold night.";
          } else if ((avg_hours_difference < 0.5 && avg_hours_difference > -0.25) && (total_hours_difference > -16)) {
            data.users[i].rank["class"] = 'b-goalie';
            data.users[i].rank.icon = '✓';
            return data.users[i].rank.text = "Hot damn, right on target. As they say: Arbeit macht frei :-)";
          } else if ((avg_hours_difference <= -0.25 && avg_hours_difference >= -1) && (total_hours_difference > -16)) {
            data.users[i].rank["class"] = 'c-karmauser';
            data.users[i].rank.icon = '☂';
            return data.users[i].rank.text = "There’s never enough time to do all the nothing you want.";
          } else {
            data.users[i].rank["class"] = 'd-slacker';
            data.users[i].rank.icon = '☁';
            return data.users[i].rank.text = "I slack, therefore, I am doing nothing.";
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
      var colors, data, hours_goal, hours_registered, label_text, options;
      hashtag(user.id);
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
      colors = {
        green: {
          main: '#76caa3',
          highlight: '#98d7b9'
        },
        red: {
          main: '#bf616a',
          highlight: '#c6737b'
        },
        yellow: {
          main: '#efab00',
          highlight: '#f6d57f'
        },
        purple: {
          main: '#786492',
          highlight: '#998aad'
        }
      };
      label_text = {
        green: 'Hours',
        red: 'Hours',
        yellow: 'Hours',
        purple: 'Hours'
      };
      $scope.label_state = [];
      $scope.label_state[0] = false;
      $scope.label_state[1] = false;
      $scope.label_state[2] = false;
      $scope.label_state[3] = false;
      hours_registered = roundNumber(user.hours_registered);
      hours_goal = roundNumber(user.hours_goal);
      if (hours_registered < hours_goal) {
        data.push({
          value: hours_registered,
          color: colors.green.main,
          highlight: colors.green.highlight,
          label: label_text.green
        });
        data.push({
          value: roundNumber(hours_goal - hours_registered),
          color: colors.red.main,
          highlight: colors.red.highlight,
          label: label_text.red
        });
        $scope.label_state[0] = true;
        $scope.label_state[1] = true;
      } else if (hours_registered > hours_goal) {
        data.push({
          value: hours_goal,
          color: colors.green.main,
          highlight: colors.green.highlight,
          label: label_text.green
        });
        data.push({
          value: roundNumber(hours_registered - hours_goal),
          color: colors.yellow.main,
          highlight: colors.yellow.highlight,
          label: label_text.yellow
        });
        $scope.label_state[0] = true;
        $scope.label_state[2] = true;
      } else if (hours_registered === hours_goal) {
        data.push({
          value: hours_registered,
          color: colors.green.main,
          highlight: colors.green.highlight,
          label: label_text.green
        });
        $scope.label_state[0] = true;
      }
      options = {
        segmentStrokeWidth: 1
      };
      return doughnut('hours-chart', data, options);
    };
    $doc.on('keydown', function(e) {
      if (e.keyCode === 27) {
        if ($scope.user_modal === true) {
          return $scope.modalState('user_modal', false);
        } else if ($scope.range_modal === true) {
          return $scope.modalState('range_modal', false);
        } else if ($scope.loginOpen === true) {
          return $scope.modalState('loginOpen', false);
        }
      }
    });
    return $scope.modalState = function(name, state) {
      $scope[name] = state;
      return hashtag(' ');
    };
  });

  doughnut = function(id, data, options) {
    var ctx;
    if (options == null) {
      options = null;
    }
    $('canvas#' + id).after($('<canvas>', {
      id: id
    })).remove();
    document.getElementById(id).setAttribute('width', '225px');
    document.getElementById(id).setAttribute('height', '225px');
    ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx).Doughnut(data, options);
  };

  roundNumber = function(num) {
    return Math.round(num * 100) / 100;
  };

  hashtag = function(val) {
    val = val || null;
    if (val) {
      val = String(val);
      return window.location.hash = val.replace(/\//g, '');
    } else {
      return window.location.hash.substring(1);
    }
  };

}).call(this);
