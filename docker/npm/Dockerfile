FROM digitallyseamless/nodejs-bower-grunt

RUN apt-get update && \
  apt-get install -y \
  ruby \
  ruby-dev

RUN gem install --no-rdoc --no-ri sass -v 3.4.22
RUN gem install --no-rdoc --no-ri compass

COPY entrypoint.sh /
ENTRYPOINT "/entrypoint.sh"
