FROM phusion/baseimage:0.9.17

# Need git for cloning.
RUN apt-get update && \
    apt-get install -y git  apache2 php5


ENV TIMELORD_SITE_NAME Time Lord
ENV TIMELORD_BASE /
ENV TIMELORD_HARVESTER_URL http://harvester
ENV TIMELORD_HARVESTER_API_PATH /api/v1/
ENV TIMELORD_SALT_STRING ChangeMe

# Script for setting up harvester.
RUN mkdir -p /etc/my_init.d
COPY timelord.sh /etc/my_init.d/99-timelord

# Make runit start apache.
RUN mkdir /etc/service/apache2
COPY apache2.service /etc/service/apache2/run

# Remove apts cache.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
