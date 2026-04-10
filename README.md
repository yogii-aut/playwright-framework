# SauceDemo Enterprise Playwright Framework

Production-ready UI automation framework for [SauceDemo](https://www.saucedemo.com) using Playwright, TypeScript, Page Object Model, Allure reporting, Slack notifications, Docker, Kubernetes, and Jenkins.

## What this framework covers

- Playwright + TypeScript + Page Object Model.
- Feature-wise structure for tests, pages, locators, and test data.
- Cross-browser execution for Chromium, Firefox, and WebKit.
- Parallel execution with dedicated smoke, sanity, regression, and cross-browser groups.
- Custom assertion strategy using Playwright custom matchers and Chai.
- Jenkins-ready pipeline.
- Dockerized local and CI execution.
- Kubernetes job orchestration.
- Allure report generation with Slack notification support.
- Service/API test support with Playwright request context and schema validation.

## Folder structure

```text
.
├── config
├── docs
├── orchestration
├── report
├── src
│   ├── core
│   ├── fixtures
│   ├── pages
│   ├── services
│   ├── shared
│   ├── test-data
│   ├── tests
│   └── workflows
├── Dockerfile
├── Jenkinsfile
├── docker-compose.yml
└── playwright.config.ts
```

## Implemented page objects and test coverage

The attached design screenshots map to the following framework assets:

- Login page
  - Page Object: `src/pages/auth/login.page.ts`
  - Tests: `src/tests/ui/auth/login.spec.ts`
  - Coverage: page rendering, credential hint validation, successful login, locked user negative flow.
- Inventory page
  - Page Object: `src/pages/inventory/inventory.page.ts`
  - Tests: `src/tests/ui/inventory/inventory.spec.ts`
  - Coverage: expected products and prices from the screenshot, add-to-cart flow, sort validation, cart badge update.

## Local setup

### Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop
- Java 11+ for local Allure CLI usage

### 1. Install dependencies

```bash
npm install
npx playwright install --with-deps
```

### 2. Configure environment

This framework supports three runtime files under `config/environment`:

- `config/environment/local.env`
- `config/environment/qa.env`
- `config/environment/prod.env`

Environment selection is controlled from the command line:

```bash
env=local npm test
env=qa npm test
env=prod npm test
```

If you do not provide `env`, the framework defaults to `config/environment/local.env`.

Update the matching env file if you need different URLs, users, Slack settings, or execution flags.

For service tests, configure `API_BASE_URL` in the selected env file.

### 3. Run tests locally

```bash
npm test
```

Useful alternatives:

```bash
npm run test:smoke
npm run test:sanity
npm run test:regression
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:parallel:ui
npm run test:headed
npm run test:debug
npm run test:service
npm run test:allure
npm run test:full
env=qa npm run test:smoke
env=prod npm run test:chrome
```

Detailed Playwright CLI and command-line flag examples are documented in [docs/playwright-cli-guide.md](/Users/yogeshgite/Documents/monkey-test/docs/playwright-cli-guide.md).
Service/API execution details are documented in [docs/service-testing.md](/Users/yogeshgite/Documents/monkey-test/docs/service-testing.md).
Every test run clears the `report/` folder before execution starts, and Allure is configured to read/write only from `report/allure-results` and `report/allure-report`.

To run the full sequence of UI tests, service tests, and automatic Allure generation/serve in one command:

```bash
npm run test:full
```

`npm run test:allure` and `npm run test:full` only start the Allure web server on local runs. In CI or GitHub Actions, they generate the HTML report but skip `serve` so the pipeline can complete cleanly.

For GitHub Actions downloads, prefer the generated single-file Allure artifact because it can be opened directly after download without running a local server.

## Debug logging

The framework now supports structured log levels and debug-log attachment into Allure.

- Supported levels: `error`, `warn`, `info`, `debug`, `trace`
- Configure via `LOG_LEVEL` in the selected env file
- Debug logs are automatically attached to Allure when you run with Playwright debug mode or set `LOG_LEVEL=debug` or `LOG_LEVEL=trace`

Examples:

```bash
npm run test:debug
LOG_LEVEL=trace npm run test:allure
env=qa LOG_LEVEL=debug npm run test:service
```

Captured debug details include:

- UI navigation, fills, selects, clicks
- UI console messages, page errors, failed network requests
- API request method, resolved URL, params, headers, payload, response headers, response body, duration, and stack traces on failure

### 4. Generate and open Allure report

```bash
npm run report:allure:generate
npm run report:allure:open
npm run test:allure
```

## Running with Docker

Build and execute tests inside the containerized Playwright runtime:

```bash
docker compose up --build playwright-tests
```

Start the Allure service:

```bash
docker compose up allure-report
```

## Parallel and grouped execution strategy

This framework supports enterprise-style suite slicing:

- `@smoke`: critical user-path coverage.
- `@sanity`: stable feature confidence after deployments.
- `@regression`: wider business coverage.
- `@cross-browser`: suites intended for multi-browser certification.

Examples:

```bash
bash orchestration/scripts/run-group.sh smoke
bash orchestration/scripts/run-group.sh sanity
bash orchestration/scripts/run-group.sh regression
bash orchestration/scripts/run-group.sh cross-browser
```

## Jenkins integration

`Jenkinsfile` includes:

- source checkout
- dependency installation
- browser installation
- group-based execution
- optional Kubernetes job execution
- Allure artifact generation and publishing
- Slack notification with Jenkins build URL and Allure link

## Kubernetes integration

Kubernetes manifests are supplied for:

- test execution job
- runtime configuration via ConfigMap
- secret injection for Slack and credentials
- Allure service deployment

Typical usage:

```bash
kubectl apply -f orchestration/kubernetes/tests/playwright-configmap.yaml
kubectl apply -f orchestration/kubernetes/tests/playwright-secret.sample.yaml
kubectl apply -f orchestration/kubernetes/tests/playwright-job.yaml
```

## Full pipeline prerequisites

Use [docs/pipeline-prerequisites.md](/Users/yogeshgite/Documents/monkey-test/docs/pipeline-prerequisites.md) for the full installation and setup checklist for Docker, Docker Compose, Jenkins, Kubernetes, Allure, and Slack.

For a simple GitHub-hosted manual runner, use [docs/github-actions-on-demand.md](/Users/yogeshgite/Documents/monkey-test/docs/github-actions-on-demand.md).

For Dockerized Kubernetes pod execution from GitHub Actions, use [docs/github-actions-k8s.md](/Users/yogeshgite/Documents/monkey-test/docs/github-actions-k8s.md).

For GitHub Actions execution with Dockerized test pods in Kubernetes, use [docs/github-actions-k8s.md](/Users/yogeshgite/Documents/monkey-test/docs/github-actions-k8s.md).

## Custom assertion strategy

Two assertion styles are intentionally supported:

- Playwright custom matchers in `src/core/matchers/custom-matchers.ts`
- Chai assertions in `src/core/assertions/chai-assert.ts`

This gives teams a clean default while still enabling richer assertion composition where needed.

## How to extend the framework

1. Add page-specific locators under `src/pages/<feature>`.
2. Add page classes under `src/pages/<feature>`.
3. Add UI test data under `src/test-data/ui/<feature>` or service payloads under `src/test-data/service`.
4. Add business workflows under `src/workflows`.
5. Add UI specs under `src/tests/ui/<feature>` or service specs under `src/tests/service`.
6. Tag scenarios with the correct execution group.

## Recommended next steps

- Install dependencies and run the suite once locally.
- Add cart, checkout, and order-complete pages if you want end-to-end purchase coverage.
- Wire Slack webhook and Jenkins Allure publishing endpoint in your target environment.
- If you want API, contract, or service-test support next, the current structure is ready to expand without redesign.
