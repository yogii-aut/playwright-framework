# iOS Mobile Testing With Appium

## Purpose

This guide explains the first iOS mobile automation lane for the framework.

The initial implementation uses:

- WebdriverIO test runner
- Appium 2
- XCUITest driver
- TypeScript
- iOS Simulator
- Allure reporting through the existing `report/allure-results` folder

The sample test automates the native iOS Settings app through its bundle id:

- `com.apple.Preferences`

Calculator was considered first, but the selected iPhone 16 / iOS 18.4 simulator does not include a `com.apple.calculator` bundle. Settings is used because it is present on the simulator and is a stable native-app smoke target.

## Folder structure

```text
src
├── mobile
│   ├── capabilities
│   │   └── ios.capabilities.ts
│   ├── screens
│   │   └── ios
│   │       ├── base.screen.ts
│   │       ├── settings.locator.ts
│   │       └── settings.screen.ts
│   └── workflows
│       └── ios
│           └── settings.workflow.ts
├── test-data
│   └── mobile
│       └── ios
│           └── settings.data.ts
└── tests
    └── mobile
        └── ios
            └── settings.spec.ts
```

## Local prerequisites

You need these on the Mac that runs the tests:

- macOS
- Xcode installed
- iOS Simulator runtime installed
- Node.js and npm
- Appium and WebdriverIO project dependencies installed through `npm install`

Check Xcode:

```bash
xcodebuild -version
```

List available simulators:

```bash
xcrun simctl list devices available
```

## Default simulator

The current default is based on the simulator available on this machine:

```text
iOS device: iPhone 16
iOS version: 18.4
bundle id: com.apple.Preferences
```

These values are controlled through the selected environment file:

- `config/environment/local.env`
- `config/environment/qa.env`
- `config/environment/prod.env`

Relevant variables:

```text
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
IOS_DEVICE_NAME=iPhone 16
IOS_PLATFORM_VERSION=18.4
IOS_BUNDLE_ID=com.apple.Preferences
IOS_NO_RESET=true
```

If you want to automate your own app later, either set:

```text
IOS_APP_PATH=/absolute/path/to/MyApp.app
```

or update:

```text
IOS_BUNDLE_ID=com.company.yourapp
```

## Install mobile dependencies

After the mobile dependencies are added to `package.json`, install them with:

```bash
npm install
```

This installs WebdriverIO, Appium, and the XCUITest driver packages used by the mobile runner.

The framework pins `appium-xcuitest-driver` to the Appium 2 compatible line. XCUITest driver `10.x` requires Appium 3, so we are not using that line yet.

## Run the sample iOS test

Use:

```bash
npm run test:mobile:ios
```

For debug logging:

```bash
npm run test:mobile:ios:debug
```

With an explicit environment file:

```bash
env=local npm run test:mobile:ios
```

## Report behavior

Mobile test results are written to the same Allure results folder used by the rest of the framework:

```text
report/allure-results
```

To generate the HTML report:

```bash
npm run report:allure:generate
```

To generate the single-file report for direct local opening:

```bash
npm run report:allure:generate:single
```

## Notes

- Native iOS testing cannot run on Linux GitHub-hosted runners or normal Linux Kubernetes pods.
- iOS simulator testing requires a macOS machine with Xcode.
- The current sample uses Settings only as a framework proof of concept.
- Real app testing should use a simulator `.app` build or a real-device `.ipa` build later.
