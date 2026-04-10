# Playwright CLI Guide

## Purpose

This guide explains how to run the framework with Playwright command-line arguments and npm scripts. It covers the most common flags used during local development, debugging, and CI execution.

## Base commands

Run the whole suite:

```bash
npm test
```

Run Playwright directly:

```bash
npx playwright test
```

## Environment selection

This framework supports:

- `config/environment/local.env`
- `config/environment/qa.env`
- `config/environment/prod.env`

Select an environment at runtime:

```bash
env=local npx playwright test
env=qa npx playwright test
env=prod npx playwright test
```

Default behavior:

- if `env` is not provided, the framework uses `config/environment/local.env`

Examples:

```bash
npx playwright test
env=qa npm test
env=prod npx playwright test --project=chromium
```

## Browser selection

Run only Chromium:

```bash
env=qa npx playwright test --project=chromium
```

Run only Firefox:

```bash
env=qa npx playwright test --project=firefox
```

Run only WebKit:

```bash
env=qa npx playwright test --project=webkit
```

Run multiple browsers:

```bash
env=qa npx playwright test --project=chromium --project=firefox --project=webkit
```

Framework shortcuts:

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:service
```

## Headed and headless execution

Run in headed mode:

```bash
env=local npx playwright test --headed
```

Run in headless mode explicitly:

```bash
env=qa npx playwright test --headless
```

Use environment toggles:

```bash
env=local HEADLESS=false npx playwright test
env=qa HEADLESS=true npx playwright test
```

When to use them:

- Use `--headed` when debugging locators, waits, and visual flows.
- Use headless mode for Jenkins and bulk regression runs.

## Run a specific test file

Run only login specs:

```bash
env=local npx playwright test src/tests/ui/auth/login.spec.ts
```

Run only inventory specs:

```bash
env=qa npx playwright test src/tests/ui/inventory/inventory.spec.ts
```

## Run a specific test by title

Use `--grep` with the full or partial test name:

```bash
env=local npx playwright test --grep "should login successfully with standard user"
```

Example with a feature keyword:

```bash
env=qa npx playwright test --grep "Inventory"
```

Exclude tests with `--grep-invert`:

```bash
env=qa npx playwright test --grep-invert "@regression"
```

## Run by tag

Smoke:

```bash
env=local npx playwright test --grep @smoke
```

Sanity:

```bash
env=qa npx playwright test --grep @sanity
```

Regression:

```bash
env=qa npx playwright test --grep @regression
```

Cross-browser tagged flows:

```bash
env=prod npx playwright test --grep @cross-browser --project=chromium --project=firefox --project=webkit
```

Framework shortcuts:

```bash
npm run test:smoke
npm run test:sanity
npm run test:regression
```

## Workers and retries

Use one worker while debugging:

```bash
env=local npx playwright test --workers=1
```

Increase concurrency:

```bash
env=qa npx playwright test --workers=6
```

Override retries:

```bash
env=qa npx playwright test --retries=2
```

Environment-based examples:

```bash
env=local WORKERS=1 RETRIES=0 npx playwright test
env=qa WORKERS=6 RETRIES=2 npx playwright test --grep @regression
```

## Debugging flags

Run with Playwright Inspector:

```bash
env=local npx playwright test --debug
```

Use `PWDEBUG`:

```bash
env=local PWDEBUG=1 npx playwright test
```

Strong local repro command:

```bash
env=local npx playwright test src/tests/ui/auth/login.spec.ts --headed --workers=1 --trace on
```

## Trace, screenshot, and video flags

Trace for every test:

```bash
env=qa npx playwright test --trace on
```

Trace on failure:

```bash
env=qa npx playwright test --trace retain-on-failure
```

Screenshots on failure:

```bash
env=qa npx playwright test --screenshot only-on-failure
```

Video on:

```bash
env=qa npx playwright test --video on
```

Combined debugging example:

```bash
env=local npx playwright test src/tests/ui/inventory/inventory.spec.ts --headed --workers=1 --trace on --video on
```

## Reporter flags

List reporter:

```bash
env=qa npx playwright test --reporter=list
```

List and HTML reporters:

```bash
env=qa npx playwright test --reporter=list,html
```

Generate Allure after execution:

```bash
env=qa npx playwright test
npm run report:allure:generate
```

## UI mode

Run Playwright UI mode:

```bash
env=local npx playwright test --ui
```

This helps when:

- filtering tests visually
- rerunning failed scenarios
- opening traces and attachments quickly

## Useful command combinations

Run a single smoke scenario in Chromium:

```bash
env=local npx playwright test src/tests/ui/auth/login.spec.ts --project=chromium --grep @smoke --headed --workers=1
```

Run regression in Firefox only:

```bash
env=qa npx playwright test --project=firefox --grep @regression
```

Run one spec in debug mode:

```bash
env=local npx playwright test src/tests/ui/inventory/inventory.spec.ts --debug --retries=0 --workers=1
```

Run everything except regression:

```bash
env=qa npx playwright test --grep-invert @regression
```

## Framework scripts reference

```bash
npm test
npm run test:local
npm run test:qa
npm run test:prod
npm run test:service
npm run test:service:posts
npm run test:allure
npm run test:headed
npm run test:debug
npm run test:smoke
npm run test:sanity
npm run test:regression
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:inventory
npm run test:auth
npm run test:parallel:ui
npm run report:allure:generate
npm run report:allure:open
npm run report:allure:serve
npm run notify:slack
npm run docker:test
npm run docker:report
```

## Best-practice recommendations

- Use `--workers=1` while stabilizing a failure.
- Combine `--headed`, `--trace on`, and `--video on` for difficult failures.
- Prefer `--grep` with stable tags for CI group execution.
- Use `--project` for browser selection instead of branching logic in tests.
- Keep local commands close to Jenkins commands to reduce environment drift.
