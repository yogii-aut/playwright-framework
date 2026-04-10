# Test Automation Architecture

## Purpose

This framework translates the supplied target architecture into a maintainable Playwright + TypeScript implementation for SauceDemo. The design is optimized for enterprise teams that need:

- Feature-based UI automation with clean separation of pages, tests, and test data.
- Tagged execution for smoke, sanity, regression, and cross-browser suites.
- Strong CI/CD integration through Jenkins, Docker, and Kubernetes orchestration.
- Reporting through Allure with optional Slack notification publishing.
- Extensibility toward service, contract, and API testing without rebuilding the test core.

## Mapping From Diagram To Implementation

| Architecture block | Framework implementation |
| --- | --- |
| UI Tests | `src/tests/ui/**` |
| Service Tests | `src/tests/service/**` |
| Locator repository | `src/pages/**` |
| Test layer smoke / regression / sanity / API tags | `src/core/constants/test-groups.ts` + tagged Playwright specs |
| Playwright runner | `playwright.config.ts` + npm scripts |
| Test data | `src/test-data/ui/**` and `src/test-data/service/**` |
| Environment / vault / secrets / configs / hooks | `config/env.ts`, `config/environment/**`, Kubernetes ConfigMap/Secret |
| Utilities / loggers / reporters | `src/core/utils/**`, `src/core/logger/**`, `src/core/reporting/**` |
| ReportPortal / Slack | Slack publisher in `orchestration/scripts/slack-notify.ts` |
| Jenkins | `Jenkinsfile` |
| Kubernetes cluster | `orchestration/kubernetes/tests/**`, `orchestration/kubernetes/allure/**` |

## Framework Layers

### 1. Core layer

Contains environment parsing, logger, reusable utilities, reporting helpers, and custom matchers. This layer is stable and shared by all test types.

### 2. Locator repository

Locators live beside their respective page classes to keep page modules self-contained and easier to maintain by feature.

### 3. Page and component layer

Pages model top-level screens such as Login and Inventory. Components model reusable regions such as the application header.

### 4. Workflow layer

Business flows such as login are represented in workflows so tests stay concise and domain-focused.

### 5. Test data layer

Credentials and product data are kept in dedicated files, enabling environment-aware inputs and future data factory support.

### 6. Test layer

Tests are organized by feature. Tags separate smoke, sanity, regression, and cross-browser groups so CI can split execution horizontally.

## Execution Model

- Local engineers can run the same commands used by CI.
- Docker standardizes browser and dependency setup.
- Kubernetes executes tests as Jobs for scalable remote orchestration.
- Jenkins acts as the top-level trigger and report publisher.

## Quality Design Decisions

- POM with components and workflows to reduce duplication.
- Custom matchers to codify framework-specific assertions.
- Type-safe environment handling through `zod`.
- Parallel project definitions for scalable execution.
- Separate reporting pipeline so notification failures do not break core test logic.
