import { products } from '@src/test-data/ui/inventory/products';
import { users } from '@src/test-data/ui/auth/users';
import { test, expect } from '@src/fixtures/ui-test.fixture';
import { TEST_GROUPS } from '@src/core/constants/test-groups';
import { tagTest } from '@src/core/reporting/allure.util';

test.describe('Inventory - Product catalogue page', () => {
  test.beforeEach(async ({ authWorkflow, inventoryPage, page }) => {
    await authWorkflow.loginAs(users.standard);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.pageTitle()).toHaveText('Products');
    await expect(inventoryPage.inventoryItems()).toHaveCount(6);
  });

  test(`${TEST_GROUPS.smoke} ${TEST_GROUPS.crossBrowser} should render expected inventory cards from supplied design`, async ({ inventoryPage }) => {
    await tagTest([TEST_GROUPS.smoke, TEST_GROUPS.crossBrowser]);
    await expect(inventoryPage.productPrice(products.backpack.name)).toHaveText(products.backpack.price);
    await expect(inventoryPage.productPrice(products.bikeLight.name)).toHaveText(products.bikeLight.price);
    await expect(inventoryPage.productPrice(products.boltShirt.name)).toHaveText(products.boltShirt.price);
    await expect(inventoryPage.productPrice(products.fleeceJacket.name)).toHaveText(products.fleeceJacket.price);
    await expect(inventoryPage.addToCartButton(products.backpack.name)).toBeVisible();
    await expect(inventoryPage.addToCartButton(products.bikeLight.name)).toBeVisible();
  });

  test(`${TEST_GROUPS.sanity} should add a product to cart and update header badge`, async ({ inventoryPage }) => {
    await tagTest([TEST_GROUPS.sanity]);
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await expect(inventoryPage.header.cartBadge()).toHaveText('1');
  });

  test(`${TEST_GROUPS.regression} should sort inventory by name ascending`, async ({ inventoryPage }) => {
    await tagTest([TEST_GROUPS.regression]);
    await inventoryPage.sortBy('Name (A to Z)');
    const productNames = await inventoryPage.getVisibleProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    await expect(productNames).toBeSortedAscending();
  });
});
