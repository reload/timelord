<?php
  // Set document root.
  $base = dirname(__DIR__);
  // Get yaml library.
  require $base . '/vendor/autoload.php';
  use Symfony\Component\Yaml\Yaml;
  // Get config.
  $config = yaml::parse($base . '/config.yml');

  // Set variables.
  $site_name = $config['site_name'];
  $timelord_base = $config['timelord_url'];
  $harvester_base = $config['harvester_url'];
  $harvester_api = $config['harvester_api_path'];
  $salt_string = $config['salt_string'];
