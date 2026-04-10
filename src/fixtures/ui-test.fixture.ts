import { test as base } from '@playwright/test';
import { TestLogCollector } from '@src/core/logger/test-log-collector';
import { LoginPage } from '@src/pages/auth/login.page';
import { InventoryPage } from '@src/pages/inventory/inventory.page';
import { AuthWorkflow } from '@src/workflows/auth.workflow';

type UiFixtures = {
  logCollector: TestLogCollector;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  authWorkflow: AuthWorkflow;
};

export const test = base.extend<UiFixtures>({
  logCollector: async ({}, use, testInfo) => {
    const logCollector = new TestLogCollector();
    await use(logCollector);

    if (logCollector.shouldAttachToAllure() && logCollector.hasEntries()) {
      await testInfo.attach(`${testInfo.title} - debug logs`, {
        body: logCollector.asText(),
        contentType: 'text/plain'
      });
    }
  },
  loginPage: async ({ page, logCollector }, use) => {
    page.on('console', (message) => {
      logCollector.trace('Browser console message', {
        type: message.type(),
        text: message.text()
      });
    });
    page.on('pageerror', (error) => {
      logCollector.error('Page error captured', {
        message: error.message,
        stackTrace: error.stack
      });
    });
    page.on('requestfailed', (request) => {
      logCollector.error('Network request failed', {
        url: request.url(),
        method: request.method(),
        failure: request.failure()
      });
    });

    await use(new LoginPage(page, logCollector));
  },
  inventoryPage: async ({ page, logCollector }, use) => {
    await use(new InventoryPage(page, logCollector));
  },
  authWorkflow: async ({ loginPage }, use) => {
    await use(new AuthWorkflow(loginPage));
  }
});

export { expect } from '@src/core/matchers/custom-matchers';
