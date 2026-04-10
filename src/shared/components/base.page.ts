import { Locator, Page } from '@playwright/test';
import { TestLogCollector } from '@src/core/logger/test-log-collector';
import { waitForPageReady } from '@src/core/utils/wait.util';

export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    protected readonly logger: TestLogCollector
  ) {}

  async goto(path = '/'): Promise<void> {
    this.logger.info('UI navigation started', { path });
    await this.page.goto(path);
    await waitForPageReady(this.page);
    this.logger.info('UI navigation completed', { path, currentUrl: this.page.url() });
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected async click(selector: string, description: string): Promise<void> {
    this.logger.debug('UI click started', {
      description,
      selector,
      stackTrace: new Error().stack
    });
    await this.page.locator(selector).click();
    this.logger.debug('UI click completed', { description, selector });
  }

  protected async fill(selector: string, value: string, description: string): Promise<void> {
    this.logger.debug('UI fill started', {
      description,
      selector,
      masked: selector.toLowerCase().includes('password')
    });
    await this.page.locator(selector).fill(value);
    this.logger.debug('UI fill completed', { description, selector });
  }

  protected async selectOption(selector: string, optionLabel: string, description: string): Promise<void> {
    this.logger.debug('UI select started', {
      description,
      selector,
      optionLabel,
      stackTrace: new Error().stack
    });
    await this.page.locator(selector).selectOption({ label: optionLabel });
    this.logger.debug('UI select completed', { description, selector, optionLabel });
  }

  currentUrl(): string {
    return this.page.url();
  }
}
