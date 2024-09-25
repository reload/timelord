<?php
require_once dirname(__DIR__) . '/config.inc';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  if (isset($_GET["user"])) {
    // AJAX form submission
    $user = json_decode($_GET["user"]);


    /**
     * TODO: The API usses post for this service, maybe use guzzle?
     *  $url = 'http://harvester.dev/app_dev.php/api/v1/logins.json';
     *  $token = '?email=' . $name .  '&password=' . $pass;
     */

    $url = $config['harvester_url'] . $config['harvester_api_path'] . 'entries.json?group=user';
    $url = $url . "&email=" . $user->name . "&password=" . $user->pass;

    // Get response header.
    $header = get_headers($url);
    // Get response status code.
    preg_match('!\d{3}!', $header[0], $matches);
    $code = (int) reset($matches);

    // Check if response gives thumbs up and start session.
    if ($code === 200) {
        session_start();
        $_SESSION['harvester_name'] = $user->name;
        $_SESSION['harvester_pass'] = $user->pass;
    }

    // Otherwise return response.
    else {
        return http_response_code($code);
    }
  }

  // Worst case scenario fallback.
  else {
    echo "Something went wrong.";
  }
}
