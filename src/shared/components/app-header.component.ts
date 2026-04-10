import { Locator, Page } from '@playwright/test';
import { TestLogCollector } from '@src/core/logger/test-log-collector';
import { inventoryLocators } from '@src/pages/inventory/inventory.locator';

export class AppHeaderComponent {
  constructor(
    private readonly page: Page,
    private readonly logger: TestLogCollector
  ) {}

  async openMenu(): Promise<void> {
    this.logger.debug('UI click started', {
      description: 'Open burger menu',
      selector: inventoryLocators.burgerMenu,
      stackTrace: new Error().stack
    });
    await this.page.locator(inventoryLocators.burgerMenu).click();
    this.logger.debug('UI click completed', { description: 'Open burger menu', selector: inventoryLocators.burgerMenu });
  }

  async openCart(): Promise<void> {
    this.logger.debug('UI click started', {
      description: 'Open shopping cart',
      selector: inventoryLocators.cartLink,
      stackTrace: new Error().stack
    });
    await this.page.locator(inventoryLocators.cartLink).click();
    this.logger.debug('UI click completed', { description: 'Open shopping cart', selector: inventoryLocators.cartLink });
  }

  cartBadge(): Locator {
    return this.page.locator(inventoryLocators.cartBadge);
  }
}
