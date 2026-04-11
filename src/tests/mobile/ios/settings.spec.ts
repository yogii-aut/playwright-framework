import { expect } from '@wdio/globals';
import { settingsData } from '@src/test-data/mobile/ios/settings.data';
import { SettingsWorkflow } from '@src/mobile/workflows/ios/settings.workflow';

describe('iOS Settings - native app automation', () => {
  let settings: SettingsWorkflow;

  beforeEach(async () => {
    settings = new SettingsWorkflow();
    await settings.open(settingsData.bundleId);
  });

  it('@mobile @ios @smoke should launch settings app', async () => {
    await expect(await settings.activeBundleId()).toBe(settingsData.bundleId);
    await expect(await settings.settingsTitle()).toBe(settingsData.titles.settings);
  });

  it('@mobile @ios @smoke should find a settings menu item with search', async () => {
    await settings.search(settingsData.searchableMenuItem);

    await expect(await settings.isMenuItemDisplayed(settingsData.searchableMenuItem)).toBe(true);
  });

  for (const menuItem of settingsData.searchableMenuItems) {
    it(`@mobile @ios @regression should find ${menuItem} settings with search`, async () => {
      await settings.search(menuItem);

      await expect(await settings.isMenuItemDisplayed(menuItem)).toBe(true);
    });
  }

  it('@mobile @ios @regression should open privacy and security settings', async () => {
    await settings.openMenuItem(settingsData.navigableMenuItem);
    await expect(await settings.navigationTitle(settingsData.navigableMenuItem)).toBe(
      settingsData.navigableMenuItem
    );
  });
});
