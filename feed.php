<?php
  session_start();
  // Feed url.
  $url = 'http://harvester.dev/app_dev.php/api/v1/entries.json?group=user';

  // Add token to URL if logged in.
  if (!empty($_SESSION['harvester_token'])) {
    $url = $url . '?token=' . $_SESSION['harvester_token'];
  }

  $json = file_get_contents($url);
  print $json;
