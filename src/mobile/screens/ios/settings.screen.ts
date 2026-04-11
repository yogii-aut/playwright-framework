import { browser } from '@wdio/globals';
import { BaseScreen } from '@src/mobile/screens/ios/base.screen';
import { SettingsLocators } from '@src/mobile/screens/ios/settings.locator';

export class SettingsScreen extends BaseScreen {
  async open(bundleId: string): Promise<void> {
    await browser.terminateApp(bundleId);
    await browser.activateApp(bundleId);
    await this.returnToRoot();
  }

  async titleText(): Promise<string> {
    return this.text(SettingsLocators.title);
  }

  async search(value: string): Promise<void> {
    await this.setValue(SettingsLocators.search, value);
  }

  async isMenuItemDisplayed(name: string): Promise<boolean> {
    return this.isDisplayed(SettingsLocators.menuItem(name));
  }

  async openMenuItem(name: string): Promise<void> {
    await this.tap(SettingsLocators.menuItem(name));
  }

  async navigationTitleText(name: string): Promise<string> {
    return this.text(SettingsLocators.navigationTitle(name));
  }

  async activeBundleId(): Promise<string | undefined> {
    const appInfo = (await browser.execute('mobile: activeAppInfo')) as {
      bundleId?: string;
    };

    return appInfo.bundleId;
  }

  private async returnToRoot(): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt++) {
      if (await this.isDisplayed(SettingsLocators.search)) {
        return;
      }

      await browser.back();
    }
  }
}
