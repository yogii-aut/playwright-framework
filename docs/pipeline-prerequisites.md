# End-to-End Pipeline Prerequisites

## Purpose

This document explains the tools, installations, and environment setup required to run the full automation pipeline locally and in CI.

## Local machine prerequisites

Install the following:

- Node.js 20 or later
- npm 10 or later
- Git
- Docker Desktop
- Java 11 or later for Allure CLI usage
- kubectl if you want to trigger Kubernetes jobs manually

Verification commands:

```bash
node -v
npm -v
git --version
docker --version
docker compose version
java -version
kubectl version --client
```

## Playwright prerequisites

Install project dependencies:

```bash
npm install
```

Install browsers:

```bash
npx playwright install --with-deps
```

## Environment file prerequisites

This framework supports three runtime files under `config/environment`:

- `config/environment/local.env`
- `config/environment/qa.env`
- `config/environment/prod.env`

Select the environment from the command line:

```bash
env=local npm test
env=qa npm test
env=prod npm test
```

Default behavior:

- if `env` is not supplied, `config/environment/local.env` is used automatically

Minimum values:

- `BASE_URL`
- `API_BASE_URL`
- `STANDARD_USER`
- `PASSWORD`

Recommended values:

- `WORKERS`
- `RETRIES`
- `SLACK_WEBHOOK_URL`
- `SLACK_CHANNEL`
- `JENKINS_BUILD_URL`
- `ALLURE_REPORT_URL`

Recommended approach:

- keep developer-safe values in `config/environment/local.env`
- keep shared QA values in `config/environment/qa.env`
- keep production-safe read-only values in `config/environment/prod.env`
- keep sensitive secrets out of Git when your organization requires credential injection from Jenkins or a secret manager

## Docker prerequisites

Confirm Docker installation:

```bash
docker --version
docker compose version
```

Build the framework image:

```bash
docker build -t saucedemo-playwright-framework:latest .
```

Run tests:

```bash
docker compose up --build playwright-tests
```

Run Allure service:

```bash
docker compose up allure-report
```

## Docker Compose prerequisites

Before using Compose:

- ensure Docker Desktop is running
- ensure the required env file exists under `config/environment`
- ensure the image can be built in the current workspace

Compose is used for:

- Playwright test execution
- Allure report hosting

## Jenkins prerequisites

Your Jenkins environment should provide:

- Jenkins pipeline support
- Git access to this repository
- Node.js and npm on the build agent
- Playwright browser installation capability
- Allure Jenkins plugin
- credentials management for secrets
- optional kubectl access for Kubernetes orchestration

Recommended Jenkins plugins:

- Pipeline
- Git
- Allure Jenkins Plugin
- Credentials Binding
- ANSI Color
- Timestamper

Agent verification:

```bash
node -v
npm -v
npx playwright --version
kubectl version --client
```

## Jenkins credentials and variables

Store these securely outside source control:

- Slack webhook URL
- future API keys or service credentials
- Kubernetes credentials if used

Recommended Jenkins environment values:

- `CI=true`
- `TEST_ENV=qa`
- `SLACK_WEBHOOK_URL`
- `SLACK_CHANNEL`
- `JENKINS_BUILD_URL`
- `ALLURE_REPORT_URL`

## Kubernetes prerequisites

To run tests in Kubernetes, you need:

- a Kubernetes cluster
- kubectl configured for the target cluster
- image registry access if the cluster cannot pull local images
- permissions for Jobs, ConfigMaps, Secrets, Deployments, and Services

Apply manifests:

```bash
kubectl apply -f orchestration/kubernetes/tests/playwright-configmap.yaml
kubectl apply -f orchestration/kubernetes/tests/playwright-secret.sample.yaml
kubectl apply -f orchestration/kubernetes/tests/playwright-job.yaml
kubectl apply -f orchestration/kubernetes/allure/allure-deployment.yaml
```

Important notes:

- replace sample secret values before applying
- update the image reference if your cluster uses a remote registry

## Allure prerequisites

For local usage:

- Java must be installed
- `allure-commandline` is already part of this project dependencies

Generate and open:

```bash
npm run report:allure:generate
npm run report:allure:open
```

For Jenkins:

- install the Allure plugin
- archive `report/allure-results`
- publish Allure after execution

## Slack notification prerequisites

To publish Slack notifications:

1. Create an incoming webhook in Slack.
2. Add the webhook URL to the appropriate env file or Jenkins credentials.
3. Set `SLACK_CHANNEL` if your Slack app supports it.
4. Provide `JENKINS_BUILD_URL` and `ALLURE_REPORT_URL` for link sharing.

Manual validation:

```bash
npm run notify:slack
```

## Recommended setup order

1. Install Node.js, npm, and Git.
2. Install project dependencies.
3. Install Playwright browsers.
4. Review `config/environment/local.env`, `config/environment/qa.env`, and `config/environment/prod.env`.
5. Run the suite locally.
6. Validate Allure locally.
7. Validate Docker and Docker Compose.
8. Configure Jenkins and credentials.
9. Configure Kubernetes if needed.
10. Enable Slack notifications.

## Troubleshooting checklist

If tests do not load the target application:

- verify `BASE_URL` in the selected env file under `config/environment`
- verify you selected the correct `env` value
- verify the matching env file exists under `config/environment`
- verify Playwright browsers are installed
- verify the environment config maps correctly into Playwright

If Jenkins fails:

- verify agent has Node.js, npm, and browser dependencies
- verify credentials are injected correctly
- verify the Allure plugin is installed

If Docker fails:

- verify Docker Desktop is running
- verify the image builds successfully
- verify mounted paths are writable

If Kubernetes jobs fail:

- verify the image is reachable by the cluster
- verify ConfigMap and Secret exist in the same namespace
- verify the service account has permission to create Jobs
