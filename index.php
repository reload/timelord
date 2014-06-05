<?php
  session_start();
?>
<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <title>Time king</title>
  <meta name="description" content="">

  <meta name="viewport" content="width=device-width">
  <link rel="shortcut icon" href="favicon.ico">

  <link href="css/reset.css" rel="stylesheet" type="text/css">
  <link href="css/layout.css" rel="stylesheet" type="text/css">
  <link href="css/main.css" rel="stylesheet" type="text/css">
</head>
<body ng-app="TimeKingApp">
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
    chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7]><p class="chromeframe">Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

  <div ng-controller="TimeKing" class="time-report">
    <div class="header">
      <div class="inner">
        <h1>Timeking</h1>
      </div>
    </div>
    <div class="totals">
      <div class="inner">
        <p>{{ data.hours_total_registered }} of {{ data.hours_until_today }} hours registered in {{ data.date_start * 1000 | date : 'MMMM yyyy' }}</p>
        <p>That's {{ data.total_percent }}%!</p>
      </div>
    </div>

    <div class="user-report">
      <ul class="inner">
        <li class="user" ng-click="toggleStats(user)" ng-repeat="user in data.ranking | orderBy:'group'">
          <figure class="portrait {{user.group}}">
            <img src="{{user.imageUrl}}">
          </figure>
          <strong>{{ user.name }}</strong>
        </li>
      </ul>
    </div>

    <div class="login">
      <div class="inner">

        <form name="loginForm" ng-hide="session" ng-submit="userLogin(user, 'login')" novalidate>
          <ul>
            <li>
              <label>
                <span>Email:</span>
                <input type="email" name="username" ng-model="user.name" required /><br />
              </label>
            </li>
            <li>
              <label >
              <span>Password:</span>
              <input type="password" name="password" ng-minlength="5" ng-model="user.pass" required />
            </label>
            </li>
          </ul>
          <button type="submit" ng-disabled="loginForm.$invalid">Submit</button>
        </form>

        <form name="logoutForm" ng-show="session" ng-submit="userLogout()">
          <button type="submit">Logout</button>
        </form>
      </div>
    </div>
  </div>

  <script src="js/vendor.js" type="text/javascript"></script>
  <script src="js/main.js" type="text/javascript"></script>
</body>
</html>
