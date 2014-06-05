<?php
  session_start();
  if (!empty($_SESSION['harvester_token'])) {
    print 'true';
  }

  else {
    print 'false';
  }
