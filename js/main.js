(function() {
  // NOTE: All javascript is done in Coffeescript - see /js/cs/main.coffee
  var app, doughnut, hashtag, roundNumber;

  app = angular.module('TimeLordApp', ['angular-loading-bar', 'ngRoute', 'ngMd5']);

  // The router.
  app.config(function($routeProvider, $locationProvider) {
    // Set the behaviour for routes.
    $routeProvider.when('/', {
      templateUrl: 'templates/frontpage.html',
      controller: 'TimeLord',
      reloadOnSearch: false
    });
    // Remove the "/#/" from the URL.
    return $locationProvider.html5Mode(true).hashPrefix('!');
  });

  // TimeLord controller.
  app.controller('TimeLord', function($scope, $http, $routeParams, $location, md5) {
    var $doc, date, fetchData, getLoginStatus, getSession;
    // Get the document.
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
    // Set the choices for the "month selector".
    $scope.date_options_month = [
      {
        value: "jan",
        name: "January"
      },
      {
        value: "feb",
        name: "February"
      },
      {
        value: "mar",
        name: "March"
      },
      {
        value: "apr",
        name: "April"
      },
      {
        value: "may",
        name: "May"
      },
      {
        value: "jun",
        name: "June"
      },
      {
        value: "jul",
        name: "July"
      },
      {
        value: "aug",
        name: "August"
      },
      {
        value: "sep",
        name: "September"
      },
      {
        value: "oct",
        name: "October"
      },
      {
        value: "nov",
        name: "November"
      },
      {
        value: "dec",
        name: "December"
      }
    ];
    // Convert the current month to the full name of the month.
    // Example: "jan" -> "January".
    $scope.converted_month = function(val) {
      var k, len, object, ref;
      ref = $scope.date_options_month;
      // Loop through the "months array".
      for (k = 0, len = ref.length; k < len; k++) {
        object = ref[k];
        // When the argument matches the month.
        if ((object.value === val.toLowerCase()) || (object.name.toLowerCase() === val.toLowerCase())) {
          // Return the name.
          return object.name;
        }
      }
    };
    // Set the default values for the "from" and "to" arguments.
    if ($routeParams.from) {
      $scope.from = $routeParams.from;
    } else {
      $scope.from = '';
    }
    // Define default "to" value.
    if ($routeParams.to) {
      $scope.to = $routeParams.to;
    } else {
      $scope.to = '';
    }
    // Set the default values for the "month" and "year" arguments.
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
    // Calculate and change the month (to previous or next)
    $scope.shiftMonth = function(val, shift) {
      // Loop through the "months array".
      // for object in $scope.date_options_month
      return angular.forEach($scope.date_options_month, function(object, j) {
        // When the argument matches the month.
        if ((object.value === val.toLowerCase()) || (object.name.toLowerCase() === val.toLowerCase())) {
          date = new Date($scope.year, j, 1); //First day of prev or next month (move by 'shift' months)
          date.setMonth(date.getMonth() + shift);
          $scope.year = date.getFullYear();
          $scope.month = $scope.date_options_month[date.getMonth()].value;
          return $scope.monthChange();
        }
      });
    };
    
    // On "range" change.
    $scope.rangeChange = function() {
      var from, to;
      // Remove possible dashes from the input values.
      from = $scope.from.replace(/-/g, '');
      to = $scope.to.replace(/-/g, '');
      // If both "from" and "to" is set and doesn't equal the previous value.
      if (from.length === 8 && to.length === 8) {
        $location.search({
          from: $scope.from,
          to: $scope.to
        });
        return fetchData();
      // If "from" is set.
      } else if (from.length === 8) {
        $location.search({
          from: $scope.from
        });
        return fetchData();
      // If "to" is set.
      } else if (to.length === 8) {
        $location.search({
          to: $scope.to
        });
        return fetchData();
      }
    };
    // On "month" change.
    $scope.monthChange = function() {
      // Set the route parameters.
      $location.search({
        month: $scope.month,
        year: $scope.year
      });
      return fetchData();
    };
    // On "type" change.
    $scope.typeChange = function() {
      // If the "range radio" is checked.
      if ($scope.type === 'range') {
        // Toggle the state of settings-display.
        $scope.show_range_settings = true;
        return $scope.show_month_settings = false;
      // If the "month radio" is checked.
      } else if ($scope.type === 'month') {
        // Toggle the state of settings-display.
        $scope.show_range_settings = false;
        return $scope.show_month_settings = true;
      }
    };
    // Url to JSON.
    $scope.loading = true;
    fetchData = function() {
      var url;
      // Check for arguments and prepare the feed-request.
      url = 'inc/feed.php?';
      // Range.
      if ($scope.type === 'range') {
        if ($routeParams.from || ($scope.from !== '')) {
          url += '&from=' + $scope.from.replace(/-/g, '');
        }
        if ($routeParams.to || ($scope.to !== '')) {
          url += '&to=' + $scope.to.replace(/-/g, '');
        }
      }
      // Month.
      if ($scope.type === 'month') {
        if ($routeParams.month || ($scope.month !== '')) {
          url += '&month=' + $scope.month;
        }
        if ($routeParams.year || ($scope.year !== '')) {
          url += '&year=' + $scope.year;
        }
      }
      // Execute feed-request.
      return $http.get(url).success(function(data, status, headers, config) {
        var user_id, year;
        // Make the total amount of hours an integer instead of float.
        data.hours_total_registered = parseInt(data.hours_total_registered, 10);
        // Get registered percent.
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_in_range);
        data.hours_in_range = parseInt(data.hours_in_range, 10);
        // Check if there's any user-id's in the URL.
        if (hashtag() !== '') {
          user_id = hashtag();
        }
        // Loop though each user.
        angular.forEach(data.users, function(user, i) {
          var avg_hours_difference, gravatar_width, total_hours_difference;
          // Compare a possible user-id in the URL.
          if (user_id && (user_id === String(user.id).replace(/\//g, ''))) {
            $scope.toggleStats(user);
          }
          // Get gravatar url.
          gravatar_width = 125;
          data.users[i].gravatar = 'http://www.gravatar.com/avatar/' + md5.createHash(user.email || '') + '?s=' + gravatar_width;
          // Calculate the avarage amount of hours a person is over/under the expected goal.
          // 30min overtime per day = 0.5
          // 2 hours short per day= -2
          total_hours_difference = user.hours_registered - user.hours_goal;
          avg_hours_difference = total_hours_difference / data.misc.working_days_in_range;
          // Define the "user rank object" & provide the difference.
          data.users[i].rank = {};
          data.users[i].rank.value = avg_hours_difference;
          data.users[i].rank.diff = parseFloat(total_hours_difference).toFixed(2);
          if (avg_hours_difference >= 0.5 || total_hours_difference > 12) {
            data.users[i].rank.class = 'a-karmahunter';
            data.users[i].rank.icon = '★';
            return data.users[i].rank.text = "I've heard that hard work never killed anyone, but I say why take the chance?";
          // Between +29min to -15min per day but no less than -16 hours in total.
          } else if ((avg_hours_difference < 0.5 && avg_hours_difference > -0.25) && (total_hours_difference > -16)) {
            data.users[i].rank.class = 'b-goalie';
            data.users[i].rank.icon = '✓';
            return data.users[i].rank.text = "There is no pleasure in having nothing to do; the fun is having lots to do and not doing it.";
          // Between: 0min to -60min per day but no less than -30 hours in total
          } else if ((avg_hours_difference <= 0 && avg_hours_difference >= -1) && (total_hours_difference > -30)) {
            data.users[i].rank.class = 'c-karmauser';
            data.users[i].rank.icon = '☂';
            return data.users[i].rank.text = "I always arrive late at the office, but I make up for it by leaving early.";
          } else {
            // Anything less than -30min per day.
            data.users[i].rank.class = 'd-slacker';
            data.users[i].rank.icon = '☁';
            return data.users[i].rank.text = "I like work: it fascinates me. I can sit and look at it for hours.";
          }
        });
        // primarily for debugging use. Add the total hour diff to the class.
        //data.users[i].rank.class += ' ' + total_hours_difference.toFixed(2) + ' ' + avg_hours_difference.toFixed(2)

        // Output to scope.
        $scope.data = data;
        $scope.loading = false;
        $scope.loginOpen = false;
        // The reason we create a new instance of the date is the following:
        // In theory there could have been a year-change since the last
        // page-request, so we have to create a new instance of the
        // date, on every data-request.
        date = new Date();
        // If the first entry was created this year.
        if (parseInt(data.misc.first_entry.year, 10) === date.getFullYear()) {
          $scope.date_options_year = [
            {
              value: data.misc.first_entry.year,
              year: data.misc.first_entry.year
            }
          ];
        }
        // If the first entry was created before this year.
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
          // Reverse the array to get the "greatest" year, first.
          return $scope.date_options_year.reverse();
        }
      }).error(function(data, status, headers, config) {
        $scope.data = data;
        $scope.loading = false;
        return console.log('Error:' + status);
      });
    };
    // Trigger and loop fetch function.
    fetchData();
    setInterval(function() {
      return fetchData();
    }, 300000);
    // Set login message.
    getLoginStatus = function(msg) {
      $scope.loginMessage = msg;
      return $scope.loginOpen = false;
    };
    // Check if session is active.
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
    // User login.
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
    // User logout.
    $scope.userLogout = function() {
      return $http.post('inc/logout.php').success(function(data) {
        getSession();
        return fetchData();
      }).error(function(data, status, headers) {
        return console.log('Error: ' + status);
      });
    };
    // User click function.
    $scope.toggleStats = function(user) {
      var colors, data, hours_goal, hours_registered, label_text, options;
      // Set hash-value to be the user id.
      hashtag(user.id);
      // Set the user modal as true.
      $scope.user_modal = true;
      // Asign the user object to $scrope and provide extra arguments.
      $scope.user = user;
      // Percent of how many hours the user registered compared to the expeced amount.
      $scope.user.registered_hours_percent = Math.round(user.hours_registered / user.hours_goal * 100);
      // Check if we have access to the "extra" object.
      if (user.extra.length !== 0) {
        //normalized billable hours_pr_day (vacation etc removed)
        $scope.user.extra.billability.hours_pr_day_normalized = user.extra.billability.hours_pr_day_normalized;
        // Assign total hours of time off.
        $scope.user.extra.time_off.hours = user.extra.time_off.normal + user.extra.time_off.paternity_leave;
        // Show the "illness fields" if there's any sickness to report.
        if (user.extra.illness !== false) {
          $scope.user.extra.show_illness = true;
          $scope.user.extra.illness.hours = user.extra.illness.normal + user.extra.illness.child;
        }
      }
      // Time chart.
      // -----------
      // There are 3 possible "charts". If you're in plus/minus or spot on,
      // so we want to check where the user is and push relevant data.
      data = [];
      // Colors for the charts.
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
      // Label text.
      label_text = {
        green: 'Hours',
        red: 'Hours',
        yellow: 'Hours',
        purple: 'Hours'
      };
      // Labels toggle state.
      $scope.label_state = [];
      $scope.label_state[0] = false; // Green.
      $scope.label_state[1] = false; // Red.
      $scope.label_state[2] = false; // Yellow.
      $scope.label_state[3] = false; // Purple.
      
      // Round the numbers we're working with.
      hours_registered = roundNumber(user.hours_registered);
      hours_goal = roundNumber(user.hours_goal);
      // If the user needs to WORK MOAR!.
      if (hours_registered < hours_goal) {
        // Registered time.
        data.push({
          value: hours_registered,
          color: colors.green.main,
          highlight: colors.green.highlight,
          label: label_text.green
        });
        // Time behind.
        data.push({
          value: roundNumber(hours_goal - hours_registered),
          color: colors.red.main,
          highlight: colors.red.highlight,
          label: label_text.red
        });
        // What labels to display.
        $scope.label_state[0] = true;
        $scope.label_state[1] = true;
      // If the user is over the goal. GOOD JAWB!
      } else if (hours_registered > hours_goal) {
        // Registered time.
        data.push({
          value: hours_goal,
          color: colors.green.main,
          highlight: colors.green.highlight,
          label: label_text.green
        });
        // Overtime.
        data.push({
          value: roundNumber(hours_registered - hours_goal),
          color: colors.yellow.main,
          highlight: colors.yellow.highlight,
          label: label_text.yellow
        });
        // What labels to display.
        $scope.label_state[0] = true;
        $scope.label_state[2] = true;
      // If the amount of registered hours match the goal.
      } else if (hours_registered === hours_goal) {
        // Registered time.
        data.push({
          value: hours_registered,
          color: colors.green.main,
          highlight: colors.green.highlight,
          label: label_text.green
        });
        // What labels to display.
        $scope.label_state[0] = true;
      }
      // Chart options.
      options = {
        segmentStrokeWidth: 1
      };
      // Execute the chart.
      return doughnut('hours-chart', data, options);
    };
    $scope.employeeOfWeek = function(val) {
      var employee, sortedUsers, users;
      date = new Date();
      users = $scope.data.users;
      sortedUsers = [];
      users.forEach(function(entry) {
        sortedUsers.push(entry.full_name);
      });
      sortedUsers = sortedUsers.sort();
      employee = function() {
        var theWinner;
        Math.seedrandom(date.getWeek() + date.getFullYear());
        theWinner = Math.floor(Math.random() * sortedUsers.length);
        return sortedUsers[theWinner];
      };
      if (val === employee()) {
        return false;
      }
      return true;
    };
    Date.prototype.getWeek = function() {
      var onejan;
      onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    };
    // Trigger events on keydown.
    $doc.on('keydown', function(e) {
      // Key: ESC.
      if (e.keyCode === 27) {
        // Close the user modal.
        if ($scope.user_modal === true) {
          $scope.modalState('user_modal', false);
        // Close the range modal.
        } else if ($scope.range_modal === true) {
          $scope.modalState('range_modal', false);
        } else if ($scope.loginOpen === true) {
          $scope.modalState('loginOpen', false);
        }
        // The nature of using non-Anular based event means that they won't be ingested into the Angular lifecycle.
        // Therefore we need to manually tell the UI to update. https://jimhoskins.com/2012/12/17/angularjs-and-apply.html
        // We can probably do this better with an ng-keypress directive.
        $scope.$apply();
      }
    });
    // Close user-modal
    return $scope.modalState = function(name, state) {
      // Set the state of the modal.
      $scope[name] = state;
      // Remove the hash-value from the URL.
      return hashtag(' ');
    };
  });

  // Adapter to easily execute doughnut charts.
  doughnut = function(id, data, options = null) {
    var ctx;
    // Even though the data is reset and a new instance of the graph
    // is created, the old graph still hangs on to the canvas, so we
    // have to remove the old canvas and create a new one to
    // completely reset it.
    $('canvas#' + id).after($('<canvas>', {
      id: id
    })).remove();
    // We need to force the width / height on every init since there
    // is a bug with retina displays, where the size doubles every
    // time you create a new graph.
    document.getElementById(id).setAttribute('width', '225px');
    document.getElementById(id).setAttribute('height', '225px');
    // Get context and init the chart.
    ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx).Doughnut(data, options);
  };

  // Make sure numbers only have up to 2 decimals.
  roundNumber = function(num) {
    return Math.round(num * 100) / 100;
  };

  // A shorthand function to handle "hash".
  hashtag = function(val) {
    // Set default value to the "val" parameter.
    val = val || null;
    // If a value is given.
    if (val) {
      // Make sure the hash value is a string, so we can "replace".
      val = String(val);
      // Replace possible slashes and set the hash value.
      return window.location.hash = val.replace(/\//g, '');
    } else {
      // Else just return the hash-value (without the hashtag).
      return window.location.hash.substring(1);
    }
  };

}).call(this);
