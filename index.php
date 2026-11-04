<?php
  session_start();
  include_once 'config.inc';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <title><?php print $config['site_name']; ?></title>
  <base href="<?php print $config['timelord_base']; ?>"/>

  <meta name="viewport" content="width=device-width">
  <link rel="shortcut icon" href="favicon.ico">

  <link href="css/reset.css" rel="stylesheet">
  <link href="css/vendor.min.css" rel="stylesheet">
  <link href="css/main.min.css" rel="stylesheet">
</head>
<body ng-app="TimeLordApp">
  <!-- Target for view. -->
  <div ng-view></div>

  <!-- Include JavaScripts. -->
  <script src="js/vendor.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
