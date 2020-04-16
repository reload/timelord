# In order for the ON BUILD triggers to execute, we need
# to build
FROM node:13.13.0-stretch

# Install image libs
RUN apt-get update && apt-get install -y ruby ruby-compass && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Allow Bower to be run as root
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Define working directory.
WORKDIR /var/www/html

COPY . /var/www/html

# Install npm dependencies
RUN npm install

# Install bower dependencies
RUN node_modules/.bin/bower install

# Build artifacts
RUN npm run build
