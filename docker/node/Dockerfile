# In order for the ON BUILD triggers to execute, we need
# to build
FROM library/node

# Install Bower & Grunt
RUN npm install -g bower grunt-cli && \
    echo '{ "allow_root": true }' > /root/.bowerrc

# Define working directory.
WORKDIR /var/www/html

COPY . /var/www/html
