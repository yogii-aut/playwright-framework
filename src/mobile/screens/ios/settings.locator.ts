export const SettingsLocators = {
  title: [
    '~Settings',
    '-ios predicate string:type == "XCUIElementTypeNavigationBar" AND (name == "Settings" OR label == "Settings")'
  ],
  search: [
    '~Search',
    '-ios predicate string:type == "XCUIElementTypeSearchField" AND (name == "Search" OR label == "Search")'
  ],
  menuItem: (name: string): string[] => [
    `~${name}`,
    `-ios predicate string:(type == "XCUIElementTypeCell" OR type == "XCUIElementTypeStaticText") AND (name == "${name}" OR label == "${name}")`
  ],
  navigationTitle: (name: string): string[] => [
    `~${name}`,
    `-ios predicate string:type == "XCUIElementTypeNavigationBar" AND (name == "${name}" OR label == "${name}")`
  ]
};
