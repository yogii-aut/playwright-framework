# GitHub Actions On-Demand Runner

## Purpose

This workflow gives you a simple GitHub Actions entry point for running the framework on demand without Docker, Kubernetes, or Jenkins.

The workflow file is:

- `.github/workflows/playwright-on-demand.yml`

It runs directly on a GitHub-hosted Ubuntu runner and is the easiest way to execute Playwright from GitHub when you want a simpler path than Kubernetes pods.

## What it does

When you trigger the workflow manually, it:

1. checks out the repository
2. installs Node.js
3. installs npm dependencies
4. installs Playwright browsers
5. runs the suite you selected
6. uploads the generated `report/` folders as GitHub Actions artifacts

## Supported inputs

The workflow asks for these values:

- `test_env`
  - `local`
  - `qa`
  - `prod`
- `suite`
  - `ui`
  - `smoke`
  - `sanity`
  - `regression`
  - `service`
  - `full`
- `browser`
  - `chromium`
  - `firefox`
  - `webkit`
- `log_level`
  - `info`
  - `debug`
  - `trace`

## How each suite behaves

- `ui`
  - runs all UI tests on the selected browser project
- `smoke`
  - runs `@smoke` tests on the selected browser project
- `sanity`
  - runs `@sanity` tests on the selected browser project
- `regression`
  - runs `@regression` tests on the selected browser project
- `service`
  - runs API/service tests only
  - browser input is ignored for service execution
- `full`
  - runs `npm run test:full`
  - this executes UI tests, service tests, and the automatic Allure flow

## Required setup

This workflow is intentionally simple.

You do not need:

- `KUBE_CONFIG_DATA`
- Docker Desktop
- Kubernetes cluster access
- Slack webhook

You only need:

- the repository pushed to GitHub
- GitHub Actions enabled
- the standard framework files already committed

Optional GitHub secret:

- `PASSWORD`

If your test flow depends on a GitHub-side override for password or future secrets, add them under:

- `Repository -> Settings -> Secrets and variables -> Actions`

## How to trigger it

1. open your GitHub repository
2. click `Actions`
3. open `Playwright On Demand`
4. click `Run workflow`
5. choose the inputs
6. click `Run workflow`

## Recommended first run

Use this for a clean first execution:

- `test_env = qa`
- `suite = smoke`
- `browser = chromium`
- `log_level = info`

That is the quickest and lowest-risk way to confirm the workflow is working.

## Where to find results

After the workflow finishes:

1. open the workflow run
2. scroll to the `Artifacts` section
3. download the uploaded artifact

The artifact contains:

- `report/playwright-report`
- `report/test-results`
- `report/allure-results`
- `report/allure-report`

## When to use this workflow vs the Kubernetes workflow

Use the on-demand workflow when:

- you want a quick manual run
- you are learning GitHub Actions
- you do not want to manage cluster access yet
- you want a simpler debugging path

Use the Kubernetes workflow when:

- you need pod-based execution
- you want parallel test orchestration in the cluster
- you want Dockerized execution that matches your target CI runtime more closely

## Recommended next step

Start with this on-demand workflow first.

Once that is stable, move to:

- `.github/workflows/playwright-k8s.yml`

That gives you a much smoother learning path.
