import { LoginPage } from '@src/pages/auth/login.page';
import { TestUser } from '@src/core/types/test-user';

export class AuthWorkflow {
  constructor(private readonly loginPage: LoginPage) {}

  async loginAs(user: TestUser): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login(user);
  }
}
