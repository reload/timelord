<?php
  require '../vendor/autoload.php';
  use Symfony\Component\Yaml\Yaml;
  // Get config.
  $config = yaml::parse('../config.yml');
  $harvester_base = $config['harvester_url'];
  $harvester_api = $config['harvester_api_path'];
