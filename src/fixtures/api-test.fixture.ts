import { APIRequestContext, test as base } from '@playwright/test';
import { TestLogCollector } from '@src/core/logger/test-log-collector';
import { RestClient } from '@src/services/api/core/rest.client';
import { PostsService } from '@src/services/api/posts.service';
import { expect } from '@src/core/matchers/custom-matchers';

type ApiFixtures = {
  logCollector: TestLogCollector;
  apiClient: RestClient;
  postsService: PostsService;
};

export const test = base.extend<ApiFixtures>({
  logCollector: async ({}, use, testInfo) => {
    const logCollector = new TestLogCollector();
    await use(logCollector);

    if (logCollector.shouldAttachToAllure() && logCollector.hasEntries()) {
      await testInfo.attach(`${testInfo.title} - debug logs`, {
        body: logCollector.asText(),
        contentType: 'text/plain'
      });
    }
  },
  apiClient: async ({ request, logCollector }: { request: APIRequestContext; logCollector: TestLogCollector }, use) => {
    await use(new RestClient(request, logCollector));
  },
  postsService: async ({ apiClient }, use) => {
    await use(new PostsService(apiClient));
  }
});

export { expect };
