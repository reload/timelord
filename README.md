![https://i.imgur.com/IzNEVAR.png](https://i.imgur.com/IzNEVAR.png)

# TimeLord

![Docker Badge](https://img.shields.io/docker/automated/reload/timelord.svg) ![Docker Badge](https://img.shields.io/docker/build/reload/timelord.svg)

Timelord is a way to visually present data provided by the [Harvester](https://github.com/reload/harvester "Harvester") project.

## Get started

#### 1. Create the config:

```
make create-config
```

#### 2. Fill in envs in `./docker/harvester.env` and `./docker/timelord.env`:

```
# ./docker/harvester.env
VIRTUAL_HOST=harvester.docker
HARVESTER_HARVEST_USER=harvest@reload.dk
HARVESTER_HARVEST_PASSWORD=secretpassword
HARVESTER_HARVEST_ACCOUNT=reload
SYMFONY_ENV=dev
SYMFONY_DEBUG=1
```

If running locally the only thing you need to change from the defaults are the the `HARVESTER_HARVEST_PASSWORD=secretpassword`.

```
# ./docker/timelord.env
VIRTUAL_HOST=timelord.docker
TIMELORD_SITE_NAME=Time Lord dev
TIMELORD_BASE=/
TIMELORD_HARVESTER_URL=http://harvester
TIMELORD_HARVESTER_API_PATH=/api/v1/
TIMELORD_SALT_STRING=ReloadGotTime
```

If you want to have Timelord pulling data from a local version of Harvester you let the default values remain
but if you want to pull data from some other Harvester instance fx. [http://harvester.reload.dk](http://harvester.reload.dk)
you go ahead and change TIMELORD_HARVESTER_URL.

```
TIMELORD_HARVESTER_URL=http://harvester.reload.dk
```

#### 3. Make sure you have [Harvester](https://github.com/reload/harvester).

As in, make sure you have run the Harvester project at least once and build the Dockerfile that is being build when running `make up` in the Harvester project. We need that for local development in the Timelord project as stated in this projects `docker-compose.yml`.

This should be uncessecary some time along the road when these two repos get collected under a single mono-repo.
Alas this is the state of affairs.

This also means that any changes that needs to be made to the Harvester project that is required in the Timelord project
needs to have the Harvester project make the changes and create a new fresh build of the image locally and then ask the Timelord
project to run: `docker-compose up --build`. This is not necessary if the feature you are developing or the bug you are fixing
only resides in the Timelord code base.

#### 4. Get everything up and running.

This will bring up the server needed to serve the web app and make requests to Harvester.
Besides that this will also run a watcher service that will re-transpile your changed coffescript and SCSS.

```
make up
```

#### 5. Timelord is now accessible: [http://timelord.docker/](http://timelord.docker/)
