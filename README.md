# TimeLord
Timelord is a way to visually present data provided by the [Harvester](https://github.com/reload/harvester "Harvester") project. If you don't know what Harvester is, please go to the project and checkout the README file.

## Docker-compose
Copy `.env.example` to `.env` and update the variables according to the LastPass 'reload.harvestapp.com' notes.
`docker-compose up` will give you a working timelord _and_ harvester. First time building Harvester will take a long time importing the database.

## Setup
There is only a few steps you need to follow for Timelord to be functioning with your Harvester project:

1. Clone the repository `git clone https://github.com/reload/timelord.git`
2. Copy the `config.inc.example` file to `config.inc` and fill out the configuration.

You should, by now, have a fully functioning TimeLord project up and running. If you wish to customize the project, checkout the **"Customize"** section below.

## Customize

We have setup a few steps that you should follow to get a fully customizable version up and running, if you wish to alter the styling or create further functionality.

This guide is based on OSX. If you run linux you are smart enough to figure it out by yourself.


### 1) Node

We use NodeJS/NPM to get our Grunt dependencies and install Bower:

`brew install node `

Get components (defined in package.json) by running:

` npm install `

### 2) Bower

We user Bower to get the libraries that we need (AngularJS and it's dependencies etc).

`npm install -g bower `

Then install libraries (defined in bower.json)

`bower install`.

### 3) Compass
We use the Compass SASS Framework to compile our CSS and provide easy cross browser support (mixins).

`gem install compass `

### 4) Grunt

You need grunt on your system.

`npm install -g grunt `

Then just simply run `grunt` and it will compile and enter watch mode.

If you have the 'Live reload' plugin, you can use it in watch mode.

## Badass way

If you have NodeJS and Compass installed: Clone repo, then run:

`npm install && bower install && grunt`
