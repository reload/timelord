<?php
  $url = 'http://harvester.dev/app_dev.php/api/v1/entries.json?group=user';
  $json = file_get_contents($url);
  print $json;
?>
