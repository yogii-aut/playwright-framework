import { users } from '@src/test-data/ui/auth/users';
import { test, expect } from '@src/fixtures/ui-test.fixture';
import { TEST_GROUPS } from '@src/core/constants/test-groups';
import { attachJson, tagTest } from '@src/core/reporting/allure.util';

test.describe('Authentication - Login page', () => {
  test(`${TEST_GROUPS.smoke} ${TEST_GROUPS.crossBrowser} should display login screen with static guidance`, async ({ loginPage }) => {
    await tagTest([TEST_GROUPS.smoke, TEST_GROUPS.crossBrowser]);
    await loginPage.open();
    await expect(loginPage.loginLogo()).toHaveText('Swag Labs');
    await expect(loginPage.loginButton()).toBeVisible();
    await expect(loginPage.acceptedUsernames()).toContainText(users.standard.username);
    await expect(loginPage.passwordHint()).toContainText(users.standard.password);
  });

  test(`${TEST_GROUPS.sanity} should login successfully with standard user`, async ({ authWorkflow, inventoryPage, page }) => {
    await tagTest([TEST_GROUPS.sanity]);
    await attachJson('user', users.standard);
    await authWorkflow.loginAs(users.standard);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.pageTitle()).toHaveText('Products');
    await expect(inventoryPage.inventoryItems()).toHaveCount(6);
  });

  test(`${TEST_GROUPS.regression} should block locked out user login`, async ({ loginPage }) => {
    await tagTest([TEST_GROUPS.regression]);
    await loginPage.open();
    await loginPage.login(users.lockedOut);
    await expect(loginPage.errorMessage()).toContainText('Sorry, this user has been locked out.');
  });
});
