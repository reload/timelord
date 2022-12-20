# Helm
[Helm chart](./timelord/) for Timelord

## But wait.. What in the world is a helm chart and what is it doing here?
Helm helps us automate our deployment pipelines against our kubernetes cluster by adding functionality such as templating, grouping kube manifests and adding release-revisions of our deplo>
Helm is basically a wrapper for kubectl, the kubernetes command-line tool and helps us standardize the way we deploy new releases across projects

- https://helm.sh/docs/topics/charts/

## Where do we use helm?
We use helm in our github [workflow](../.github/workflows/build-deploy.yml)
