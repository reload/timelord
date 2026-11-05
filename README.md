# TimeLord

Timelord is a way to visually present data provided by the [Harvester](https://github.com/reload/harvester "Harvester") project. If you don't know what Harvester is, please go to the project and checkout the README file.

## Setup

There is only a few steps you need to follow for Timelord to be functioning with your Harvester project:

1. Clone the repository `git clone https://github.com/reload/timelord.git`
2. Copy the `config.inc.example` file to `config.inc` and fill out the configuration.

You should now have a fully functioning TimeLord project up and running.

## Deployment

Timelord is deployed with [Kamal](https://kamal-deploy.org/) to
[zeta.reload.dk](https://github.com/reload/zeta.reload.dk) at
https://timelord.reload.dk, fetching data from the Harvester at
https://combine.reload.dk.

The site is protected by basic auth, except from the Reload office,
handled by Caddy in the container (see `docker/timelord.sh`), as
kamal-proxy doesn't support it.

Pushes to `main` are deployed by the Deploy workflow
(`.github/workflows/deploy.yml`), which can also be run by hand from the
Actions tab. It pushes the image to `ghcr.io/reload/timelord` and gets
Kamal from [devenv](https://devenv.sh/). It needs these repository
settings:

- `KAMAL_SSH_KEY` secret: the private key whose public key is in
  `fetch_ssh_keys_static_keys` in the zeta.reload.dk repository.
- `ZETA_KNOWN_HOSTS` variable: the output of
  `ssh-keyscan -p 27821 zeta.reload.dk`.
- `TIMELORD_BASIC_AUTH_USER`, `TIMELORD_BASIC_AUTH_PASSWORD` and
  `TIMELORD_BASIC_AUTH_ALLOWED_IPS` secrets (the basic auth credentials
  are in the `Timelord basic auth` item in the Shared vault of the
  Reload 1Password account).

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

We have setup a few steps that you should follow to get a fully customizable version up and running, if you wish to alter the styling or create further functionality.

First build the `node` container and install dependencies:

```
docker-compose build --force-rm node && \
docker-compose run --rm node npm install && \
docker-compose run --rm node bower install
```

To recompile everything, simply run grunt from inside the container:

```
docker-compose run --rm node grunt
```
