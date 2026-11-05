import { angular } from './vendor.js';
import { doughnut } from './chart.js';
import { pickEmployeeOfWeek } from './employee-of-week.js';
import { rankUser } from './rank.js';
import { hashtag, roundNumber, toIsoDate } from './util.js';

const MONTHS = [
  { value: 'jan', name: 'January' },
  { value: 'feb', name: 'February' },
  { value: 'mar', name: 'March' },
  { value: 'apr', name: 'April' },
  { value: 'may', name: 'May' },
  { value: 'jun', name: 'June' },
  { value: 'jul', name: 'July' },
  { value: 'aug', name: 'August' },
  { value: 'sep', name: 'September' },
  { value: 'oct', name: 'October' },
  { value: 'nov', name: 'November' },
  { value: 'dec', name: 'December' },
];

// Index of a month given as "jan" or "January" (case insensitive), or -1.
const monthIndex = (val) => MONTHS.findIndex((month) =>
  month.value === val.toLowerCase() || month.name.toLowerCase() === val.toLowerCase());

// How often to refresh the data, in milliseconds.
const REFRESH_INTERVAL = 300000;

const GRAVATAR_WIDTH = 125;

// Chart colours, matching the --chart-* colours in css/tokens.css. The
// highlight keeps the hue of the main colour.
const COLORS = {
  green: { main: 'oklch(77.5% 0.100 163)', highlight: 'oklch(82.8% 0.077 163)' },
  red: { main: 'oklch(60.6% 0.121 15)', highlight: 'oklch(64.9% 0.105 15)' },
  yellow: { main: 'oklch(78.5% 0.163 80)', highlight: 'oklch(88.3% 0.112 80)' },
  purple: { main: 'oklch(54% 0.074 304)', highlight: 'oklch(65.9% 0.054 304)' },
};

const chartSegment = (value, color) => ({
  value,
  color: COLORS[color].main,
  highlight: COLORS[color].highlight,
  label: 'Hours',
});

export function TimeLordController($scope, $http, $routeParams, $location, md5) {
  // Modals' default states.
  $scope.user_modal = false;
  $scope.range_modal = false;
  if ($routeParams.from) {
    $scope.type = 'range';
    $scope.show_range_settings = true;
  }
  else {
    $scope.type = 'month';
    $scope.show_month_settings = true;
  }

  // The choices for the month selector.
  $scope.date_options_month = MONTHS;

  // Convert a month to its full name, e.g. "jan" -> "January".
  $scope.converted_month = (val) => MONTHS[monthIndex(val)]?.name;

  // Default values for the "from" and "to" arguments.
  $scope.from = toIsoDate($routeParams.from);
  $scope.to = toIsoDate($routeParams.to);

  // Default values for the "month" and "year" arguments.
  const now = new Date();
  $scope.month = $routeParams.month || MONTHS[now.getMonth()].value;
  $scope.year = $routeParams.year ? parseInt($routeParams.year, 10) : now.getFullYear();

  // Move to the previous or next month.
  $scope.shiftMonth = (val, shift) => {
    const j = monthIndex(val);
    if (j === -1) {
      return;
    }
    // First day of the month, moved by "shift" months.
    const date = new Date($scope.year, j, 1);
    date.setMonth(date.getMonth() + shift);
    $scope.year = date.getFullYear();
    $scope.month = MONTHS[date.getMonth()].value;
    $scope.monthChange();
  };

  $scope.rangeChange = () => {
    // Remove possible dashes from the input values.
    const from = $scope.from.replace(/-/g, '');
    const to = $scope.to.replace(/-/g, '');

    if (from.length === 8 && to.length === 8) {
      $location.search({ from: $scope.from, to: $scope.to });
      fetchData();
    }
    else if (from.length === 8) {
      $location.search({ from: $scope.from });
      fetchData();
    }
    else if (to.length === 8) {
      $location.search({ to: $scope.to });
      fetchData();
    }
  };

  $scope.monthChange = () => {
    $location.search({ month: $scope.month, year: $scope.year });
    fetchData();
  };

  // Toggle which settings are displayed when the type radio changes.
  $scope.typeChange = () => {
    if ($scope.type === 'range') {
      $scope.show_range_settings = true;
      $scope.show_month_settings = false;
    }
    else if ($scope.type === 'month') {
      $scope.show_range_settings = false;
      $scope.show_month_settings = true;
    }
  };

  // The year options, from the year of the first entry until now, newest
  // first.
  function yearOptions(firstYear) {
    // There could have been a year change since the last request, so get the
    // current year on every request.
    const currentYear = new Date().getFullYear();
    if (parseInt(firstYear, 10) === currentYear) {
      return [{ value: firstYear, year: firstYear }];
    }
    if (firstYear < currentYear) {
      const options = [];
      for (let year = firstYear; year <= currentYear; year++) {
        options.push({ value: year, year });
      }
      return options.reverse();
    }
    return $scope.date_options_year;
  }

  $scope.loading = true;
  function fetchData() {
    let url = 'inc/feed.php?';
    if ($scope.type === 'range') {
      if ($routeParams.from || $scope.from !== '') {
        url += `&from=${$scope.from.replace(/-/g, '')}`;
      }
      if ($routeParams.to || $scope.to !== '') {
        url += `&to=${$scope.to.replace(/-/g, '')}`;
      }
    }
    if ($scope.type === 'month') {
      if ($routeParams.month || $scope.month !== '') {
        url += `&month=${$scope.month}`;
      }
      if ($routeParams.year || $scope.year !== '') {
        url += `&year=${$scope.year}`;
      }
    }

    $http.get(url)
      .success((data) => {
        // Make the total amount of hours an integer instead of a float.
        data.hours_total_registered = parseInt(data.hours_total_registered, 10);
        data.total_percent = Math.round(100 * data.hours_total_registered / data.hours_in_range);
        data.hours_in_range = parseInt(data.hours_in_range, 10);

        // A user id in the URL hash opens that user's modal.
        const userId = hashtag() || undefined;

        for (const user of data.users) {
          if (userId && userId === String(user.id).replace(/\//g, '')) {
            $scope.toggleStats(user);
          }
          user.gravatar = `https://www.gravatar.com/avatar/${md5.createHash(user.email || '')}?s=${GRAVATAR_WIDTH}`;
          user.rank = rankUser(user, data.misc.working_days_in_range);
        }

        $scope.employee_of_week = pickEmployeeOfWeek(data.users, periodEndDate());

        $scope.data = data;
        $scope.loading = false;
        $scope.loginOpen = false;
        $scope.date_options_year = yearOptions(data.misc.first_entry.year);
      })
      .error((data, status) => {
        $scope.data = data;
        $scope.loading = false;
        console.log(`Error:${status}`);
      });
  }

  fetchData();
  setInterval(fetchData, REFRESH_INTERVAL);

  function setLoginStatus(msg) {
    $scope.loginMessage = msg;
    $scope.loginOpen = false;
  }

  // Check if the session is active.
  function getSession() {
    $http.post('inc/session.php')
      .success((data) => {
        $scope.session_user = data.harvester_name;
        $scope.session = data;
      })
      .error((data, status) => {
        console.log(`Error: ${status}`);
      });
  }

  getSession();

  $scope.userLogin = (user) => {
    $http.post('inc/auth.php', null, { params: { user } })
      .success(() => {
        getSession();
        fetchData();
        setLoginStatus('');
      })
      .error((data, status) => {
        console.log(`Error: ${status}`);
        setLoginStatus('NO! WRONG!');
      });
  };

  $scope.userLogout = () => {
    $http.post('inc/logout.php')
      .success(() => {
        getSession();
        fetchData();
      })
      .error((data, status) => {
        console.log(`Error: ${status}`);
      });
  };

  // Open the user modal.
  $scope.toggleStats = (user) => {
    hashtag(user.id);
    $scope.user_modal = true;
    $scope.user = user;
    // Registered hours compared to the expected amount, in percent.
    user.registered_hours_percent = Math.round(user.hours_registered / user.hours_goal * 100);

    // "extra" is an empty array when we don't have access to it.
    if (user.extra.length !== 0) {
      user.extra.time_off.hours = user.extra.time_off.normal + user.extra.time_off.paternity_leave;
      // Show the illness fields if there's any sickness to report.
      if (user.extra.illness !== false) {
        user.extra.show_illness = true;
        user.extra.illness.hours = user.extra.illness.normal + user.extra.illness.child;
      }
      if (user.extra.off_hours !== false) {
        user.extra.show_off_hours = true;
      }
    }

    // The time chart shows registered time plus either time behind or
    // overtime. label_state toggles the legend for green, red, yellow and
    // purple.
    $scope.label_state = [false, false, false, false];
    const hoursRegistered = roundNumber(user.hours_registered);
    const hoursGoal = roundNumber(user.hours_goal);
    const data = [];

    if (hoursRegistered < hoursGoal) {
      data.push(chartSegment(hoursRegistered, 'green'));
      data.push(chartSegment(roundNumber(hoursGoal - hoursRegistered), 'red'));
      $scope.label_state[0] = true;
      $scope.label_state[1] = true;
    }
    else if (hoursRegistered > hoursGoal) {
      data.push(chartSegment(hoursGoal, 'green'));
      data.push(chartSegment(roundNumber(hoursRegistered - hoursGoal), 'yellow'));
      $scope.label_state[0] = true;
      $scope.label_state[2] = true;
    }
    else if (hoursRegistered === hoursGoal) {
      data.push(chartSegment(hoursRegistered, 'green'));
      $scope.label_state[0] = true;
    }

    doughnut('hours-chart', data, { segmentStrokeWidth: 1 });
  };

  // The last day of the selected period, but never later than today, so the
  // current period still gets a new employee of the week every week.
  function periodEndDate() {
    const today = new Date();
    let end = null;
    if ($scope.type === 'range') {
      const to = ($scope.to || '').replace(/-/g, '');
      if (/^\d{8}$/.test(to)) {
        end = new Date(parseInt(to.slice(0, 4), 10), parseInt(to.slice(4, 6), 10) - 1, parseInt(to.slice(6, 8), 10));
      }
    }
    else {
      const j = MONTHS.findIndex((month) => month.value === $scope.month);
      if (j !== -1) {
        // Day 0 of the next month is the last day of this one.
        end = new Date($scope.year, j + 1, 0);
      }
    }
    return end && end < today ? end : today;
  }

  // Close the topmost modal on Escape.
  angular.element(document).on('keydown', (e) => {
    if (e.key !== 'Escape') {
      return;
    }
    if ($scope.user_modal === true) {
      $scope.modalState('user_modal', false);
    }
    else if ($scope.range_modal === true) {
      $scope.modalState('range_modal', false);
    }
    else if ($scope.loginOpen === true) {
      $scope.modalState('loginOpen', false);
    }
    // Events from outside Angular don't trigger a digest by themselves.
    $scope.$apply();
  });

  $scope.modalState = (name, state) => {
    $scope[name] = state;
    // Remove the user id from the URL.
    hashtag(' ');
  };
}

TimeLordController.$inject = ['$scope', '$http', '$routeParams', '$location', 'md5'];
