TimeLord 2
==========

Guide is based on OSX. If you run linux you are smart enough to figure it out by yourself.

First step is to clone this repo.

Then you have to stand within the reposity folder and run the following commands.

Yaml support
------------

You need to run composer to get the yaml parser.

` composer install ` if you have composer globally.

Or if you dont have composer:

` curl -s http://getcomposer.org/installer | php `

then

` php composer.phar install `

Restart php.

Compass
-------

You need to have compass installed.

` gem install compass `

Node
----

You need to NodeJS on you system.

` brew install node `

Bower
-----

We user bower for libraries. So you need that.

` npm install -g bower `

Then install libraries (defined in bower.json) ` bower install `.

Grunt
-----

You need grunt on your system.

` npm install -g grunt `

Get components (defined in package.json) by running ` npm install `

Then just simply run ` grunt ` and it will compile and enter watch mode.

If you have the 'Live reload' plugin, you can use it in watch mode.

Badass way
----------

Clone repo, then run:

` composer install && npm install && bower install && grunt `
