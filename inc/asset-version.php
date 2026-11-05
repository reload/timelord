<?php

/**
 * The cache-busting version of the front-end assets.
 *
 * Image builds write the version to asset-version.php once (see the
 * Dockerfile), so it isn't recomputed on every request. Without that file, as
 * in local development, the files are hashed on every request, so changes to
 * them show up right away.
 */
function timelord_asset_version(): string {
  $built = dirname(__DIR__) . '/asset-version.php';
  return is_file($built) ? include $built : timelord_hash_assets();
}

/**
 * A hash of the front-end files.
 */
function timelord_hash_assets(): string {
  $root = dirname(__DIR__);
  $assets = array_merge(glob("$root/js/*.js"), glob("$root/css/*.css"), glob("$root/templates/*.html"));
  $hashes = array_map(fn ($file) => hash_file('xxh128', $file), $assets);
  return substr(hash('xxh128', implode('', $hashes)), 0, 12);
}

// When run from the command line, write asset-version.php.
if (PHP_SAPI === 'cli' && realpath($_SERVER['SCRIPT_FILENAME']) === __FILE__) {
  $version = timelord_hash_assets();
  file_put_contents(dirname(__DIR__) . '/asset-version.php', "<?php\nreturn " . var_export($version, TRUE) . ";\n");
  print "Asset version: $version\n";
}
