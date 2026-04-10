# Local Setup And Execution Guide

## Install

```bash
npm install
npx playwright install --with-deps
```

## Environment file support

The framework reads one of these files from `config/environment`:

- `config/environment/local.env`
- `config/environment/qa.env`
- `config/environment/prod.env`

The selected environment is controlled with the `env` command-line variable:

```bash
env=local npm test
env=qa npm test
env=prod npm test
```

If `env` is not supplied, the framework automatically uses `config/environment/local.env`.

## Run scripts locally

### Full execution

```bash
npm test
```

Equivalent examples with environment selection:

```bash
env=local npm test
env=qa npm test
env=prod npm test
```

### Group executions

```bash
npm run test:smoke
npm run test:sanity
npm run test:regression
npm run test:service
npm run test:allure
env=qa npm run test:smoke
env=prod npm run test:regression
```

### Browser-specific

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
env=qa npm run test:chrome
```

### Interactive debugging

```bash
npm run test:headed
npm run test:debug
env=local npm run test:headed
env=qa npm run test:debug
```

### Reports

```bash
npm run report:allure:generate
npm run report:allure:open
npm run test:allure
```

### Docker execution

```bash
docker compose up --build playwright-tests
docker compose up allure-report
```

## Notes

- Keep secrets in the selected env file for local execution and use Kubernetes Secrets or Jenkins credentials for CI where needed.
- Use `WORKERS`, `RETRIES`, and `HEADLESS` in `config/environment/local.env`, `config/environment/qa.env`, or `config/environment/prod.env` to tune runtime behavior.
- Slack publication only runs when `SLACK_WEBHOOK_URL` is configured.
- Service tests run via Playwright request context and do not require a browser window.
- Service tests require outbound network access to the configured `API_BASE_URL`.
- Each test run clears the `report/` folder before execution starts.
- Set `LOG_LEVEL=debug` or `LOG_LEVEL=trace` to collect detailed logs and attach them to Allure.
- For service tests, the debug attachment includes the full request/response transport details from the API client, including resolved URL, headers, body, and duration.
