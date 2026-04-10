import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

const baseUse = {
  baseURL: env.baseUrl,
  headless: env.headless,
  screenshot: 'only-on-failure' as const,
  trace: 'retain-on-failure' as const,
  video: 'retain-on-failure' as const,
  actionTimeout: 15_000,
  navigationTimeout: 30_000
};

export default defineConfig({
  testDir: './src/tests',
  globalSetup: './config/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!env.ci,
  retries: env.retries,
  workers: env.workers,
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'report/playwright-report', open: 'never' }],
    ['allure-playwright', { detail: true, resultsDir: 'report/allure-results', suiteTitle: false }]
  ],
  use: baseUse,
  outputDir: 'report/test-results',
  projects: [
    {
      name: 'setup',
      testMatch: /src\/tests\/ui\/setup\/.*\.setup\.ts/
    },
    {
      name: 'chromium',
      testIgnore: [/src\/tests\/service\//, /src\/tests\/ui\/setup\//],
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium'
      },
      dependencies: ['setup']
    },
    {
      name: 'firefox',
      testIgnore: [/src\/tests\/service\//, /src\/tests\/ui\/setup\//],
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox'
      },
      dependencies: ['setup']
    },
    {
      name: 'webkit',
      testIgnore: [/src\/tests\/service\//, /src\/tests\/ui\/setup\//],
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit'
      },
      dependencies: ['setup']
    },
    {
      name: 'chromium-parallel',
      testIgnore: [/src\/tests\/service\//, /src\/tests\/ui\/setup\//],
      grep: /@smoke|@sanity/,
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium'
      },
      dependencies: ['setup']
    },
    {
      name: 'firefox-parallel',
      testIgnore: [/src\/tests\/service\//, /src\/tests\/ui\/setup\//],
      grep: /@regression/,
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox'
      },
      dependencies: ['setup']
    },
    {
      name: 'api',
      testMatch: /src\/tests\/service\/.*service\.spec\.ts/,
      testIgnore: /src\/tests\/ui\//,
      use: {
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      },
      dependencies: ['setup']
    }
  ]
});
