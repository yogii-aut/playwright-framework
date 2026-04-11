import type { Options } from '@wdio/types';
import { browser } from '@wdio/globals';
import { env } from './config/env';
import { iosCapabilities } from './src/mobile/capabilities/ios.capabilities';

type WdioIosConfig = Options.Testrunner & {
  capabilities: Array<Record<string, unknown>>;
};

export const config: WdioIosConfig = {
  runner: 'local',
  specs: ['./src/tests/mobile/ios/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: env.logLevel === 'trace' ? 'trace' : env.logLevel,
  bail: 0,
  waitforTimeout: 15_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 1,
  hostname: env.appiumHost,
  port: env.appiumPort,
  path: '/',
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: env.appiumHost,
          port: env.appiumPort,
          relaxedSecurity: true
        }
      }
    ]
  ],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'report/allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120_000
  },
  capabilities: [iosCapabilities],
  afterTest: async (_test: unknown, _context: unknown, result: { passed: boolean }) => {
    if (!result.passed) {
      await browser.saveScreenshot(`report/test-results/mobile-ios-${Date.now()}.png`);
    }
  }
};
