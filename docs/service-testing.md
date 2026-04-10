# Service Testing Guide

## Purpose

This framework includes Playwright-based service tests for JSONPlaceholder CRUD endpoints documented in the guide:

- `GET /posts`
- `GET /posts/1`
- `GET /posts?userId=1`
- `GET /posts/1/comments`
- `POST /posts`
- `PUT /posts/1`
- `PATCH /posts/1`
- `DELETE /posts/1`

The service suite is designed to run without opening a browser.

The default service base URL is configured through `API_BASE_URL` in `config/environment/<env>.env`.

## Architecture

Service testing is organized into reusable layers:

- `src/services/api/core/rest.client.ts`
  - generic reusable REST client
- `src/services/api/posts.service.ts`
  - endpoint-specific service wrapper
- `src/test-data/service/payloads/posts.payload.ts`
  - reusable request payload factory
- `src/services/api/schemas/*.schema.ts`
  - response and request schema validation
- `src/tests/service/posts.service.spec.ts`
  - positive, negative, field-mapping, and schema-validation coverage

## Execution

Run the full API suite:

```bash
npm run test:service
```

Run the API suite in a specific environment:

```bash
env=local npm run test:service
env=qa npm run test:service
env=prod npm run test:service
```

Run only the posts service spec:

```bash
npm run test:service:posts
```

Run directly with Playwright:

```bash
env=qa npx playwright test --project=api
```

## No browser behavior

The service suite runs under the dedicated `api` Playwright project.

- it matches only service specs
- browser UI projects ignore `src/tests/service`
- API tests use Playwright request context, not the page fixture

This means browser launch is not required for service execution.

Service execution does still require network access to the configured API host.

## Debug logging

Service tests support detailed debug logging through the API fixture.

Examples:

```bash
LOG_LEVEL=debug npm run test:service
LOG_LEVEL=trace npm run test:allure
```

When debug mode is active, the framework appends structured API request and response logs to the Allure report.

The attached API log includes:

- request method
- resolved request URL
- query params
- request headers
- request payload/body
- response status and status text
- response headers
- response body
- request duration
- stack traces on request failure

## Coverage included

- schema validation for list and single-resource responses
- request payload schema validation
- CRUD endpoint coverage
- field mapping assertions between request payload and response body
- nested resource validation for comments
- negative scenario for invalid route
- negative scenario for invalid request payload shape

## Extending service coverage

To add more API areas:

1. Add a new service class under `src/services/api`.
2. Add payload factories under `src/test-data/service/payloads`.
3. Add `zod` schemas under `src/services/api/schemas`.
4. Add specs under `src/tests/service`.
5. Register additional helpers in fixtures if needed.
