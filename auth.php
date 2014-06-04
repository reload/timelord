<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  if (isset($_POST["username"]) && isset($_POST["password"])) {
    // Standard form submission
    $result = "RECEIVED PERSON DATA:" .
      "<br />Username = " . $_POST["username"] .
      "<br />Password = " . $_POST["password"];
  }
  else if (isset($_GET["user"]))
  {
    // AJAX form submission
    $user = json_decode($_GET["user"]);

    $result = json_encode(
      array(
        'Login: ' => $user->name,
        'Pass: ' => $user->pass,
        'Pass encoded: ' => password_hash($user->pass, PASSWORD_DEFAULT),
      )
    );
  }
  else
  {
    $result = "Something went wrong.";
  }

  echo $result;
}
