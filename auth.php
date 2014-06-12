<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  if (isset($_GET["user"])) {
    // AJAX form submission
    $user = json_decode($_GET["user"]);

    $name = $user->name;
    $options = ['salt' => md5('ReloadGotTime')];
    $pass = password_hash($user->pass, PASSWORD_DEFAULT, $options);

    //$url = 'http://harvester.dev/app_dev.php/api/v1/logins.json';
    $url = 'http://harvester.dev/app_dev.php/api/v1/entries.json?group=user';
    //$token = '?email=' . $name .  '&password=' . $pass;
    $token = '&token=' . $pass . '|' . $name;
    $url = $url . $token;

    $header = get_headers($url);
    preg_match('!\d{3}!', $header[0], $matches);
    $code = (int) reset($matches);

    if ($code === 200) {
      session_start();
      $_SESSION['harvester_name'] = $name;
      $_SESSION['harvester_pass'] = $pass;
    }

    else {
      return http_response_code($code);
    }
  }

  else {
    echo "Something went wrong.";
  }
}
