import { allure } from 'allure-playwright';

export async function attachJson(name: string, payload: unknown): Promise<void> {
  await allure.attachment(name, JSON.stringify(payload, null, 2), 'application/json');
}

export async function tagTest(tags: string[]): Promise<void> {
  for (const tag of tags) {
    await allure.tag(tag.replace('@', ''));
  }
}

export async function attachText(name: string, content: string): Promise<void> {
  await allure.attachment(name, content, 'text/plain');
}
