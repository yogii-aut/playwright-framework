import { Locator, Page } from '@playwright/test';
import { TestLogCollector } from '@src/core/logger/test-log-collector';
import { BasePage } from '@src/shared/components/base.page';
import { loginLocators } from '@src/pages/auth/login.locator';
import { TestUser } from '@src/core/types/test-user';

export class LoginPage extends BasePage {
  constructor(page: Page, logger: TestLogCollector) {
    super(page, logger);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(user: TestUser): Promise<void> {
    this.logger.info('Login flow started', { username: user.username });
    await this.fill(loginLocators.usernameInput, user.username, 'Login username');
    await this.fill(loginLocators.passwordInput, user.password, 'Login password');
    await this.click(loginLocators.loginButton, 'Login button');
    this.logger.info('Login flow submitted', { username: user.username });
  }

  loginLogo(): Locator {
    return this.page.locator(loginLocators.loginLogo);
  }

  loginButton(): Locator {
    return this.page.locator(loginLocators.loginButton);
  }

  acceptedUsernames(): Locator {
    return this.page.locator(loginLocators.acceptedUsernames);
  }

  passwordHint(): Locator {
    return this.page.locator(loginLocators.passwordHint);
  }

  errorMessage(): Locator {
    return this.page.locator(loginLocators.errorMessage);
  }
}
