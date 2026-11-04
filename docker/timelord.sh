#!/bin/bash
set -e

cat > /var/www/html/config.inc <<EOF
<?php
\$config['site_name'] = '$TIMELORD_SITE_NAME';
\$config['timelord_base'] = '$TIMELORD_BASE';
\$config['harvester_url'] = '$TIMELORD_HARVESTER_URL';
\$config['harvester_api_path'] = '$TIMELORD_HARVESTER_API_PATH';

EOF

# Extra directives for the site block in FrankenPHP's default
# Caddyfile. /up is the healthcheck endpoint for kamal-proxy.
directives='respond /up 200'

# Protect everything else with basic auth when a password is given.
if [ -n "$TIMELORD_BASIC_AUTH_PASSWORD" ]; then
  hash=$(frankenphp hash-password --plaintext "$TIMELORD_BASIC_AUTH_PASSWORD")
  directives="$directives
@protected not path /up
basic_auth @protected {
	${TIMELORD_BASIC_AUTH_USER:-reload} $hash
}"
fi

export CADDY_SERVER_EXTRA_DIRECTIVES="$directives"
unset TIMELORD_BASIC_AUTH_PASSWORD hash

exec docker-php-entrypoint "$@"
