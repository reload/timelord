<?php
  session_start();

  include_once 'config.inc';

  // Feed url.
  $url = $harvester_base . $harvester_api . 'entries.json?group=user';

  // Add token to URL if logged in.
  if (!empty($_SESSION['harvester_pass'])) {
    $name = $_SESSION['harvester_name'];
    $pass = $_SESSION['harvester_pass'];

    // Put together a token for url.
    $token = '&token=' . $pass . '|' . $name;
    $url = $url . $token;
  }

  // Wrap response.
  function get_contents($url) {
    $header = get_headers($url);
    preg_match('!\d{3}!', $header[0], $matches);
    $code = (int) reset($matches);

    if ($code === 200) {
      return file_get_contents($url);
    }

    return http_response_code($code);
  }

  // Output result.
  print get_contents($url);

