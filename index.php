<?php
  session_start();
  include_once 'config.inc';
  include_once 'inc/asset-version.php';

  // Stylesheets, in cascade order.
  $stylesheets = [
    'css/reset.css',
    'css/vendor.min.css',
    'css/tokens.css',
    'css/loading-bar.css',
    'css/base.css',
    'css/fonts.css',
    'css/loader.css',
    'css/layout.css',
    'css/typography.css',
    'css/header.css',
    'css/user-ranking.css',
    'css/modal.css',
  ];
  $modules = array_filter(glob(__DIR__ . '/js/*.js'), fn ($script) => !str_ends_with($script, '.min.js'));

  // Cache busting: version the asset URLs with a hash of the front-end files,
  // so browsers fetch them again whenever any of them changes.
  $version = timelord_asset_version();
  $versioned = fn ($path) => $path . '?v=' . $version;

  // Native module imports are relative ("./util.js") and don't carry the
  // version, so map each module to its versioned URL.
  $importMap = ['imports' => []];
  foreach ($modules as $module) {
    $path = './js/' . basename($module);
    $importMap['imports'][$path] = $versioned($path);
  }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <title><?php print $config['site_name']; ?></title>
  <base href="<?php print $config['timelord_base']; ?>"/>

  <meta name="viewport" content="width=device-width">
  <link rel="shortcut icon" href="favicon.ico">

<?php foreach ($stylesheets as $stylesheet): ?>
  <link href="<?php print $versioned($stylesheet); ?>" rel="stylesheet">
<?php endforeach; ?>

  <script type="importmap"><?php print json_encode($importMap, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG); ?></script>
</head>
<body>
  <!-- Target for view. -->
  <div ng-view></div>

  <!-- AngularJS, jQuery, Bootstrap, Chart.js and seedrandom as globals. -->
  <script src="<?php print $versioned('js/vendor.min.js'); ?>"></script>
  <script type="module" src="<?php print $versioned('js/main.js'); ?>"></script>
</body>
</html>
