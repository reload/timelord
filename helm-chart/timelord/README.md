# Getting started
If you want to play around with helm locally, you need to install it:
- https://helm.sh/docs/intro/install/

However, unless you are already running a kube cluster locally, it probably won't be very useful. 
In order to use a remote GCP cluster, you need to install the gcloud tool as well:
- https://cloud.google.com/sdk/docs/install

Remember to authenticate and point gcloud to your GKE cluster:  
* `gcloud auth login`
* `gcloud container clusters get-credentials YourClusterName --region YourClusterRegion --project YourGCPProjectID`

## How the Timelord helm-chart works
### Kubernetes manifests
If you check out our [templates](./templates) you'll find 4 resources:
* `deployment.yaml` - Responsible for bringing up the pod hosting our app container. This actively uses our docker image from ghcr.
* `service.yaml` - Binds to our deployment, exposing our app on a pre-determined port
* `ingress.yaml` - Binds to our service, directing traffic from outside the cluster to our app

### Values.yaml
This is where we specify values referenced by our templates.  
Any value specified in [values.yaml](./values.yaml) is subject to change - please read the file to find available options.

### Chart.yaml
Name of the helm chart and optional versioning.
We currently don't use the helm builtin versioning in this file, so these can be ignored for now.

## Great! That's timelord, but can I use this to spawn other projects on our GKE cluster?
You can and we want to encourage that, but remember to always ask your colleauges when in doubt.  
Generally speaking, you can 'just' copy the entire helm-chart directory, call it something else and replace any occurences of timelord in Chart.yaml, values.yaml and /templates/*.yaml 
That's the "anything is possible" answer, but obviously there may be more to it than that.  
You may want your github pipeline to automatically deploy new releases based on a tag, or perhaps just upgrade by hand? In either case, please see our [workflow](../../.github/workflows/build-deploy.yml)

## Versioning
At the time of writing, the following helm version was used to spawn timelord on the cluster:
`v3.10.3`
