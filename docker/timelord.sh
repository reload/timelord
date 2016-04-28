#!/bin/bash

cat > /var/www/html/config.inc <<EOF
<?php
\$config['site_name'] = '$TIMELORD_SITE_NAME';
\$config['timelord_base'] = '$TIMELORD_BASE';
\$config['harvester_url'] = '$TIMELORD_HARVESTER_URL';
\$config['harvester_api_path'] = '$TIMELORD_HARVESTER_API_PATH';
\$config['salt_string'] = '$TIMELORD_SALT_STRING';

EOF
