import { $, browser } from '@wdio/globals';

export abstract class BaseScreen {
  protected async findFirst(selectors: string[], timeout = 10_000) {
    const timeoutAt = Date.now() + timeout;
    let lastError: unknown;

    while (Date.now() < timeoutAt) {
      for (const selector of selectors) {
        try {
          const element = await $(selector);

          if (await element.isExisting()) {
            return element;
          }
        } catch (error) {
          lastError = error;
        }
      }

      await browser.pause(500);
    }

    throw new Error(
      `None of the mobile selectors matched: ${selectors.join(', ')}. Last error: ${String(lastError)}`
    );
  }

  protected async findDisplayed(selectors: string[], timeout = 10_000) {
    const timeoutAt = Date.now() + timeout;
    let lastError: unknown;

    while (Date.now() < timeoutAt) {
      for (const selector of selectors) {
        try {
          const element = await $(selector);

          if (await element.isExisting()) {
            if (!(await element.isDisplayed())) {
              await element.scrollIntoView();
            }

            if (await element.isDisplayed()) {
              return element;
            }
          }
        } catch (error) {
          lastError = error;
        }
      }

      await browser.pause(500);
    }

    throw new Error(
      `None of the mobile selectors became visible: ${selectors.join(', ')}. Last error: ${String(lastError)}`
    );
  }

  protected async exists(selectors: string[]): Promise<boolean> {
    for (const selector of selectors) {
      try {
        const element = await $(selector);

        if (await element.isExisting()) {
          return true;
        }
      } catch {
        // Stale XCUITest elements are expected during app activation/navigation.
      }
    }

    return false;
  }

  protected async tap(selectors: string[]): Promise<void> {
    const element = await this.findDisplayed(selectors);
    await element.click();
  }

  protected async text(selectors: string[]): Promise<string> {
    const element = await this.findDisplayed(selectors);
    return element.getText();
  }

  protected async setValue(selectors: string[], value: string): Promise<void> {
    const element = await this.findDisplayed(selectors);
    await element.setValue(value);
  }

  protected async isDisplayed(selectors: string[]): Promise<boolean> {
    try {
      await this.findDisplayed(selectors, 2_000);
      return true;
    } catch {
      return false;
    }
  }
}
