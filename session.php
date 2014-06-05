<?php
  session_start();
  if (!empty($_SESSION)) {
    print json_encode($_SESSION);
  }
