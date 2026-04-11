import { env } from '@config/env';

const appTarget = env.iosAppPath
  ? { 'appium:app': env.iosAppPath }
  : { 'appium:bundleId': env.iosBundleId };

export const iosCapabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': env.iosDeviceName,
  'appium:platformVersion': env.iosPlatformVersion,
  'appium:noReset': env.iosNoReset,
  'appium:newCommandTimeout': 120,
  ...appTarget
};
