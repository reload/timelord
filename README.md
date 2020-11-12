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

## Deployment

Timelord is hosted on our rancher alpha server.

- Login: [http://alpha.reload.dk:8080/login](http://alpha.reload.dk:8080/login)
- Harvester/Timelord stack: [http://alpha.reload.dk:8080/env/1a5/apps/stacks/1st21](http://alpha.reload.dk:8080/env/1a5/apps/stacks/1st21)

### A New Release

1. Whenever we merge to `master` a new image is being build and pushed to docker hub. [https://hub.docker.com/repository/docker/reload/timelord](https://hub.docker.com/repository/docker/reload/timelord)

2. If the build is successfull (we can check that at the link in step 1) we are ready to ask rancher to make us a new release.

3. Navigate to the Timelord/Harvester stack UI and click the small upgrade arrow.

<details>
  <summary>Readying an upgrade</summary>
  
  ![Readying an upgrade](https://i.imgur.com/cHZg8vK.gif)
</details>

4. Scroll down to the bottom of the page and click the Upgrade button.

<details>
  <summary>Scrolling down and requesting an upgrade</summary>

  ![Scrolling down and requesting an upgrade](https://i.imgur.com/IJulf7L.gif)
</details>

5. When it has finished upgrading, we can click the small check mark to finish our upgrade and finalize our release.

<details>
  <summary>Finishing the upgrade</summary>

  ![Finishing the upgrade](https://i.imgur.com/hD3yijD.gif)
</details>

6. Wait a few seconds, hard refresh your browser and the new deployment is live at [http://timelord.reload.dk](http://timelord.reload.dk).
