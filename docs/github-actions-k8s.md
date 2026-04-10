# GitHub Actions With Kubernetes Pods

## Purpose

This guide explains how to run the framework from GitHub Actions by:

- building a Docker image for the Playwright framework
- pushing the image to GitHub Container Registry
- creating parallel Kubernetes Jobs, one pod per test group
- collecting each pod's `report/` folder back into GitHub Actions artifacts

The workflow file is:

- `.github/workflows/playwright-k8s.yml`

The reusable Kubernetes manifest template is:

- `orchestration/kubernetes/tests/playwright-job-template.yaml`

## Execution model

The workflow uses two jobs:

1. `build-image`
   - checks out the repo
   - builds the Docker image from `Dockerfile`
   - pushes the image to `ghcr.io`

2. `execute-in-k8s`
   - runs as a matrix job in parallel
   - creates one Kubernetes Job per suite group
   - waits for the pod to complete
   - copies `/app/report` from the pod
   - uploads the copied report as a GitHub Actions artifact

Current parallel groups:

- `smoke`
- `sanity`
- `regression`
- `service`

## Prerequisites

Before the workflow can run successfully, set up the following:

### 1. GitHub Container Registry access

The workflow pushes the image to:

```text
ghcr.io/<owner>/<repo>:<tag>
```

This is the GHCR image.

- `GHCR` means `GitHub Container Registry`
- it is the Docker image registry hosted by GitHub
- your framework image gets built from `Dockerfile` and pushed there
- Kubernetes then pulls that same image and runs your tests inside the pod

The built-in `GITHUB_TOKEN` is used for registry authentication. Make sure:

- Actions are enabled for the repository
- package publishing to GHCR is allowed for the repository

### 2. Kubernetes cluster access

Create a kubeconfig for the target cluster and store it in GitHub Secrets as base64:

```bash
cat ~/.kube/config | base64
```

Add the value to this GitHub Actions secret:

- `KUBE_CONFIG_DATA`

The workflow decodes this secret into `$HOME/.kube/config`.

This secret is simply your cluster access file stored safely in GitHub.

- `kubeconfig` is the file `kubectl` uses to know:
  - which cluster to connect to
  - which user or token to use
  - which certificate and endpoint to trust
- in GitHub Actions, we store that file content as base64 in `KUBE_CONFIG_DATA`
- during the workflow run, it is decoded back into a normal kubeconfig file

### 3. Repository secrets

Add these repository or environment secrets in GitHub:

- `KUBE_CONFIG_DATA`
- `PASSWORD`

Optional:

- `SLACK_WEBHOOK_URL`

If you expand your env files later, add matching secrets here as needed.

### 4. Cluster namespace

The workflow uses this namespace by default:

```text
qa-automation
```

If it does not exist, the workflow creates it automatically.

### 5. Base config map values

Review:

- `orchestration/kubernetes/tests/playwright-configmap.yaml`

This file currently supplies:

- `BASE_URL`
- `TEST_ENV`
- `HEADLESS`
- `WORKERS`
- `RETRIES`

If you need more Kubernetes-level runtime config, add it there.

## One-time setup steps

### Step 1. Commit the workflow and template

Make sure these files are in your repository default branch:

- `.github/workflows/playwright-k8s.yml`
- `orchestration/kubernetes/tests/playwright-job-template.yaml`

### Step 2. Add required GitHub secrets

Open:

- `GitHub repository -> Settings -> Secrets and variables -> Actions`

Create:

- `KUBE_CONFIG_DATA`
- `PASSWORD`

Optional:

- `SLACK_WEBHOOK_URL`

### Step 3. Confirm your cluster can pull GHCR images

Your Kubernetes nodes must be able to pull the pushed image from GHCR.

Choose one of these approaches:

- use public package visibility for the container image
- configure an `imagePullSecret` for GHCR on the cluster
- attach the `imagePullSecret` to the service account used in the namespace

If your cluster needs `imagePullSecrets`, extend `playwright-job-template.yaml` to include them.

### Step 4. Verify namespace permissions

The kubeconfig used by GitHub Actions must be able to:

- create namespaces
- apply config maps
- apply secrets
- create jobs
- wait on jobs
- read pod logs
- copy files from pods
- delete jobs

### Step 5. Verify the Docker image locally first

Before using GitHub Actions, confirm the image works:

```bash
docker compose up --build playwright-tests
```

## How to trigger the workflow

Open:

- `GitHub repository -> Actions -> Playwright Kubernetes Execution`

Click `Run workflow`.

You can choose:

- `test_env`: `local`, `qa`, or `prod`
- `log_level`: `info`, `debug`, or `trace`
- `image_tag`: optional override, otherwise the workflow uses the commit SHA

## What happens during a run

### Phase 1. Build the image

GitHub Actions builds:

```text
ghcr.io/<owner>/<repo>:<commit-sha>
```

using:

- `Dockerfile`

### Phase 2. Create parallel pod jobs

For each matrix entry, GitHub Actions renders:

- `orchestration/kubernetes/tests/playwright-job-template.yaml`

with values for:

- `JOB_NAME`
- `IMAGE`
- `SUITE_GROUP`
- `EXECUTION_ENV`
- `LOG_LEVEL`
- `TEST_COMMAND`

### Phase 3. Run test groups in parallel

The workflow currently maps groups to commands like this:

- `smoke` -> `npm run ci:smoke`
- `sanity` -> `npm run test:sanity`
- `regression` -> `npm run ci:regression`
- `service` -> `npm run test:service`

Each matrix leg becomes its own Kubernetes Job and pod.

### Phase 4. Collect reports

After the pod completes, the workflow:

- finds the pod name from the job label
- copies `/app/report` from the pod
- stores it under `report/k8s/<group>` on the runner
- uploads that folder as a GitHub artifact

### Phase 5. Cleanup

The workflow deletes the Kubernetes Job after artifact collection.

## How to download the reports

After the workflow finishes:

1. open the GitHub Actions run
2. open the `Artifacts` section
3. download:
   - `playwright-report-smoke`
   - `playwright-report-sanity`
   - `playwright-report-regression`
   - `playwright-report-service`

Each artifact contains the copied `report/` folder from that pod, including:

- `allure-results`
- `allure-report` if generated in the pod run
- `playwright-report`
- `test-results`
- `pod.log`

## Recommended next improvement

If you want one consolidated Allure report across all parallel pods, add a final GitHub Actions job that:

- downloads all matrix artifacts
- merges all `allure-results` folders
- runs `npm run report:allure:generate`
- uploads the merged `report/allure-report`

That is the cleanest enterprise setup for Kubernetes-parallel test execution.

## Notes

- Service tests run in Kubernetes without opening a browser window because they use Playwright request context only.
- UI tests still run inside the Playwright Docker image with headless browsers in the pod.
- For deeper API logs in Allure, trigger the workflow with `log_level=debug` or `log_level=trace`.
- The current workflow is designed for manual dispatch. You can extend it later for `push`, `pull_request`, or scheduled runs.
