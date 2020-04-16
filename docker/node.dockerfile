FROM node:13.13.0-stretch

RUN apt-get update && apt-get install -y ruby ruby-compass && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Bower won't let us run it as root by default.
# We need to allow for this since we are root in the case of the container instance.
RUN echo '{ "allow_root": true }' > /root/.bowerrc

WORKDIR /var/www/html

COPY . /var/www/html

# The dependencies are seperated in the npm dependencies being for node based (build, dev) and bower being the dependecies
# that actually ship to the client.
RUN npm install
RUN node_modules/.bin/bower install

# Build artifacts.
# Since we ship the compiled/transpiled code this image is only used for actual developement.
# This build step is therefore just to allow for some code being available and runable at the first build.
RUN npm run build
