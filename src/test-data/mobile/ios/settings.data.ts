import { env } from '@config/env';

export const settingsData = {
  bundleId: env.iosBundleId,
  titles: {
    settings: 'Settings'
  },
  searchableMenuItem: 'General',
  searchableMenuItems: ['Accessibility', 'Privacy & Security'],
  navigableMenuItem: 'Privacy & Security'
} as const;
