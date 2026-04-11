import { SettingsScreen } from '@src/mobile/screens/ios/settings.screen';

export class SettingsWorkflow {
  constructor(private readonly settingsScreen = new SettingsScreen()) {}

  async open(bundleId: string): Promise<void> {
    await this.settingsScreen.open(bundleId);
  }

  async search(value: string): Promise<void> {
    await this.settingsScreen.search(value);
  }

  async isMenuItemDisplayed(name: string): Promise<boolean> {
    return this.settingsScreen.isMenuItemDisplayed(name);
  }

  async openMenuItem(name: string): Promise<void> {
    await this.settingsScreen.openMenuItem(name);
  }

  async settingsTitle(): Promise<string> {
    return this.settingsScreen.titleText();
  }

  async navigationTitle(name: string): Promise<string> {
    return this.settingsScreen.navigationTitleText(name);
  }

  async activeBundleId(): Promise<string | undefined> {
    return this.settingsScreen.activeBundleId();
  }
}
