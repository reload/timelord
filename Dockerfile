FROM dunglas/frankenphp:1-php8.5

# Use the production php.ini defaults (no display_errors etc.).
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

ENV TIMELORD_SITE_NAME="Time Lord"
ENV TIMELORD_BASE=/
ENV TIMELORD_HARVESTER_URL=http://harvester.reload.dk
ENV TIMELORD_HARVESTER_API_PATH=/api/v1/
ENV TIMELORD_SALT_STRING=ChangeMe

WORKDIR /var/www/html
COPY ./ /var/www/html

# Writes config.inc from the environment, then starts FrankenPHP.
COPY docker/timelord.sh /usr/local/bin/timelord-entrypoint
RUN chmod +x /usr/local/bin/timelord-entrypoint

ENTRYPOINT ["timelord-entrypoint"]
# Plain HTTP on port 80; TLS is handled by whatever sits in front.
CMD ["frankenphp", "php-server", "--listen", ":80", "--root", "/var/www/html"]

EXPOSE 80
