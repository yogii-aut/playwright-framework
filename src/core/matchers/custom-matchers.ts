import { expect as baseExpect, Locator } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveTrimmedText(locator: Locator, expected: string) {
    const actual = (await locator.textContent())?.trim() ?? '';
    const pass = actual === expected.trim();

    return {
      pass,
      message: () =>
        pass
          ? `Expected locator text not to equal "${expected}"`
          : `Expected locator text to equal "${expected}" but received "${actual}"`
    };
  },

  async toBeSortedAscending(values: string[]) {
    const actual = [...values];
    const expected = [...values].sort((a, b) => a.localeCompare(b));
    const pass = actual.every((item, index) => item === expected[index]);

    return {
      pass,
      message: () =>
        pass
          ? 'Expected values not to be sorted ascending'
          : `Expected ascending order ${expected.join(', ')} but received ${actual.join(', ')}`
    };
  }
});

