# TimeLord

Timelord is a way to visually present data provided by the [Harvester](https://github.com/reload/harvester "Harvester") project. If you don't know what Harvester is, please go to the project and checkout the README file.

## Setup

There is only a few steps you need to follow for Timelord to be functioning with your Harvester project:

1. Clone the repository `git clone https://github.com/reload/timelord.git`
2. Copy the `config.inc.example` file to `config.inc` and fill out the configuration.

You should now have a fully functioning TimeLord project up and running.

## Local development setup

The local setup requires Docker and docker-compose.

Copy `.env.example` to `.env` and update the variables according to your harvestapp.com credentials, eg.:

```
HARVESTER_HARVEST_USER=harvest@example.com
HARVESTER_HARVEST_PASSWORD=secret
HARVESTER_HARVEST_ACCOUNT=companyname
```

`docker-compose up` will now give you a working timelord _and_ harvester. First time building Harvester will take a long time importing the database.

Alternately, you can edit `config.inc` and insert a remote URL to a Harvester environment, and then just `docker-compose up timelord`. Your local Time Lord container will then fetch data from the remote Harvester environment.

## Customize

There is no build step. The front end is plain ES modules and native CSS,
served as-is, so edit the files and reload:

- `js/main.js` is the entry module; the rest of `js/` are the modules it
  imports. AngularJS, jQuery, Bootstrap, Chart.js and seedrandom come from
  the prebuilt `js/vendor.min.js` bundle as globals, re-exported from
  `js/vendor.js`.
- `css/` has one stylesheet per concern, with colours and other design
  tokens in `css/tokens.css`. New stylesheets must be added to the list in
  `index.php`, which also sets their order.

`index.php` adds a cache-busting `?v=` to every asset URL, a hash of the
files in `js/`, `css/` and `templates/`, and an import map so the version
also applies to modules imported by other modules.
