<?php
  // Set document root.
  $base = $_SERVER['DOCUMENT_ROOT'];
  // Get yaml library.
  require $base . '/vendor/autoload.php';
  use Symfony\Component\Yaml\Yaml;
  // Get config.
  $config = yaml::parse($base . '/config.yml');

  // Set variables.
  $site_name = $config['site_name'];
  $harvester_base = $config['harvester_url'];
  $harvester_api = $config['harvester_api_path'];
