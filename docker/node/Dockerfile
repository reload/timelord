# In order for the ON BUILD triggers to execute, we need
# to build
FROM library/node

# Install image libs
RUN apt-get update && apt-get install -y ruby ruby-compass && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Bower & Grunt
RUN npm install -g bower grunt-cli && \
    echo '{ "allow_root": true }' > /root/.bowerrc

# Define working directory.
WORKDIR /var/www/html

COPY . /var/www/html

# Install everything
RUN npm install && bower install
