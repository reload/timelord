<?php
  // Ensure you are using the same session.
  session_start();

  // End session.
  session_destroy();
  exit();
