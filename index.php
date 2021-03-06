<?php
  session_start();
  include_once 'config.inc';
?>
<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <title><?php print $config['site_name']; ?></title>
  <base href="<?php print $config['timelord_base']; ?>"/>
  <meta name="description" content="">

  <meta name="viewport" content="width=device-width">
  <link rel="shortcut icon" href="favicon.ico">

  <link href="css/reset.css" rel="stylesheet" type="text/css" />
  <link href="css/vendor.min.css" rel="stylesheet" type="text/css">
  <link href="css/main.min.css" rel="stylesheet" type="text/css">
</head>
<body ng-app="TimeLordApp">
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
    chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7]><p class="chromeframe">Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

  <!-- Target for view. -->
  <div ng-view></div>

  <!-- Include JavaScripts. -->
  <script src="js/vendor.min.js" type="text/javascript"></script>
  <script src="js/main.js" type="text/javascript"></script>
</body>
</html>
