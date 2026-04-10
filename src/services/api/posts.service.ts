import { APIResponse } from '@playwright/test';
import { RestClient } from '@src/services/api/core/rest.client';
import { CreatePostPayload, PatchPostPayload, PutPostPayload } from '@src/test-data/service/payloads/posts.payload';

export class PostsService {
  constructor(private readonly client: RestClient) {}

  getPosts(params?: Record<string, string | number | boolean>): Promise<APIResponse> {
    return this.client.get('/posts', { params });
  }

  getPostById(postId: number): Promise<APIResponse> {
    return this.client.get(`/posts/${postId}`);
  }

  getCommentsByPostId(postId: number): Promise<APIResponse> {
    return this.client.get(`/posts/${postId}/comments`);
  }

  createPost(payload: CreatePostPayload): Promise<APIResponse> {
    return this.client.post('/posts', { data: payload });
  }

  replacePost(postId: number, payload: PutPostPayload): Promise<APIResponse> {
    return this.client.put(`/posts/${postId}`, { data: payload });
  }

  updatePost(postId: number, payload: PatchPostPayload): Promise<APIResponse> {
    return this.client.patch(`/posts/${postId}`, { data: payload });
  }

  deletePost(postId: number): Promise<APIResponse> {
    return this.client.delete(`/posts/${postId}`);
  }

  getInvalidRoute(): Promise<APIResponse> {
    return this.client.get('/invalid-route');
  }
}
