<?php
  session_start();
  include_once 'config.inc';

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
  $scripts = glob(__DIR__ . '/js/*.js');
  $modules = array_filter($scripts, fn ($script) => !str_ends_with($script, '.min.js'));

  // Cache busting: version the asset URLs with a hash of the front-end files,
  // so browsers fetch them again whenever any of them changes.
  $assets = array_merge($scripts, glob(__DIR__ . '/css/*.css'), glob(__DIR__ . '/templates/*.html'));
  $version = substr(hash('xxh128', implode('', array_map(fn ($file) => hash_file('xxh128', $file), $assets))), 0, 12);
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
