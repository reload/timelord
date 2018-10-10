<?php
  session_start();
  include_once dirname(__DIR__) . '/config.inc';

  // Feed url.
  $url = $config['harvester_url'] . $config['harvester_api_path'] . 'entries.json?group=user';

  // Conditionals.
  if (!empty($_GET['from'])) {
    $url .= '&from=' . $_GET['from'];
  }
  if (!empty($_GET['to'])) {
    $url .= '&to=' . $_GET['to'];
  }
  if (!empty($_GET['month'])) {
    $url .= '&month=' . $_GET['month'];
  }
  if (!empty($_GET['year'])) {
    $url .= '&year=' . $_GET['year'];
  }

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
    $headers = get_headers($url, TRUE);
    preg_match('!\d{3}!', $headers[0], $matches);
    $code = (int) reset($matches);

    if (isset($headers['Content-Type'])) {
      header('Content-Type: ' . $headers['Content-Type']);
    }

    if ($code !== 200) {
      # Set HTTP response according to remote.
      http_response_code($code);
    }
    else {
      return file_get_contents($url);
    }
  }

  // Output result.
  print get_contents($url);
