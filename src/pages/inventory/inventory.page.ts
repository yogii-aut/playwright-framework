import { Locator, Page } from '@playwright/test';
import { TestLogCollector } from '@src/core/logger/test-log-collector';
import { BasePage } from '@src/shared/components/base.page';
import { inventoryLocators } from '@src/pages/inventory/inventory.locator';
import { AppHeaderComponent } from '@src/shared/components/app-header.component';

export class InventoryPage extends BasePage {
  readonly header: AppHeaderComponent;

  constructor(page: Page, logger: TestLogCollector) {
    super(page, logger);
    this.header = new AppHeaderComponent(page, logger);
  }

  pageTitle(): Locator {
    return this.page.locator(inventoryLocators.pageTitle);
  }

  inventoryItems(): Locator {
    return this.page.locator(inventoryLocators.inventoryItems);
  }

  async getVisibleProductNames(): Promise<string[]> {
    return this.page.locator(inventoryLocators.inventoryItemName).allTextContents();
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.selectOption(inventoryLocators.sortDropdown, optionLabel, 'Inventory sort dropdown');
  }

  async addProductToCartByName(productName: string): Promise<void> {
    this.logger.info('Add product to cart started', { productName });
    await this.addToCartButton(productName).click();
    this.logger.info('Add product to cart completed', { productName, stackTrace: new Error().stack });
  }

  productCard(productName: string): Locator {
    return this.page.locator(inventoryLocators.inventoryItems).filter({ hasText: productName });
  }

  productPrice(productName: string): Locator {
    return this.productCard(productName).locator(inventoryLocators.inventoryItemPrice);
  }

  addToCartButton(productName: string): Locator {
    return this.productCard(productName).locator(inventoryLocators.addToCartButton);
  }
}
