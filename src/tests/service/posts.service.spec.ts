import { test, expect } from '@src/fixtures/api-test.fixture';
import { TEST_GROUPS } from '@src/core/constants/test-groups';
import { tagTest } from '@src/core/reporting/allure.util';
import { PostPayloadFactory } from '@src/test-data/service/payloads/posts.payload';
import { commentsSchema } from '@src/services/api/schemas/comment.schema';
import { createPostRequestSchema, patchPostRequestSchema, postSchema, postsSchema } from '@src/services/api/schemas/post.schema';
import { isSchemaValid, validateSchema } from '@src/services/api/utils/schema.util';

test.describe('Service - Posts CRUD endpoints', () => {
  test(`${TEST_GROUPS.sanity} should fetch all posts and validate response schema`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.sanity]);

    const response = await postsService.getPosts();
    await apiClient.assertStatus(response, 200);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const posts = validateSchema(postsSchema, responseBody);

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toEqual(
      expect.objectContaining({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String)
      })
    );
  });

  test(`${TEST_GROUPS.sanity} should fetch a post by id and validate field mapping`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.sanity]);

    const response = await postsService.getPostById(1);
    await apiClient.assertStatus(response, 200);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const post = validateSchema(postSchema, responseBody);

    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(post.title.length).toBeGreaterThan(0);
    expect(post.body.length).toBeGreaterThan(0);
  });

  test(`${TEST_GROUPS.regression} should filter posts by userId and validate filtered mapping`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.regression]);

    const response = await postsService.getPosts({ userId: 1 });
    await apiClient.assertStatus(response, 200);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const posts = validateSchema(postsSchema, responseBody);

    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.userId).toBe(1);
    }
  });

  test(`${TEST_GROUPS.regression} should fetch nested comments for a post and validate comment schema`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.regression]);

    const response = await postsService.getCommentsByPostId(1);
    await apiClient.assertStatus(response, 200);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const comments = validateSchema(commentsSchema, responseBody);

    expect(comments.length).toBeGreaterThan(0);
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
    }
  });

  test(`${TEST_GROUPS.sanity} should create a post and validate schema and field mapping`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.sanity]);

    const payload = PostPayloadFactory.create();
    validateSchema(createPostRequestSchema, payload);

    const response = await postsService.createPost(payload);
    await apiClient.assertStatus(response, 201);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const post = validateSchema(postSchema, responseBody);

    expect(post.userId).toBe(payload.userId);
    expect(post.title).toBe(payload.title);
    expect(post.body).toBe(payload.body);
    expect(post.id).toBeGreaterThan(0);
  });

  test(`${TEST_GROUPS.regression} should replace a post with PUT and validate complete field mapping`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.regression]);

    const payload = PostPayloadFactory.replace(1);
    const response = await postsService.replacePost(1, payload);
    await apiClient.assertStatus(response, 200);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const post = validateSchema(postSchema, responseBody);

    expect(post.id).toBe(payload.id);
    expect(post.userId).toBe(payload.userId);
    expect(post.title).toBe(payload.title);
    expect(post.body).toBe(payload.body);
  });

  test(`${TEST_GROUPS.regression} should update a post with PATCH and validate partial field mapping`, async ({ postsService, apiClient }) => {
    await tagTest([TEST_GROUPS.regression]);

    const payload = PostPayloadFactory.patch();
    validateSchema(patchPostRequestSchema, payload);

    const response = await postsService.updatePost(1, payload);
    await apiClient.assertStatus(response, 200);

    const responseBody = await apiClient.parseJson<unknown>(response);
    const post = validateSchema(postSchema, responseBody);

    expect(post.id).toBe(1);
    expect(post.title).toBe(payload.title);
    expect(post.body.length).toBeGreaterThan(0);
  });

  test(`${TEST_GROUPS.sanity} should delete a post successfully`, async ({ postsService }) => {
    await tagTest([TEST_GROUPS.sanity]);

    const response = await postsService.deletePost(1);
    expect([200, 204]).toContain(response.status());

    const responseText = await response.text();
    
    expect(JSON.parse(responseText)).toEqual({});
  });

  test(`${TEST_GROUPS.regression} should return 404 for an invalid route`, async ({ postsService }) => {
    await tagTest([TEST_GROUPS.regression]);

    const response = await postsService.getInvalidRoute();
    expect(response.status()).toBe(404);
  });

  test(`${TEST_GROUPS.regression} should reject invalid create payload against schema before request execution`, async () => {
    await tagTest([TEST_GROUPS.regression]);

    const invalidPayload = PostPayloadFactory.invalidCreate();
    expect(isSchemaValid(createPostRequestSchema, invalidPayload)).toBeFalsy();
  });
});
