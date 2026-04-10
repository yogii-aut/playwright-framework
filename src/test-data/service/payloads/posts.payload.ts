export interface CreatePostPayload {
  userId: number;
  title: string;
  body: string;
}

export interface PutPostPayload extends CreatePostPayload {
  id: number;
}

export interface PatchPostPayload {
  title?: string;
  body?: string;
}

export class PostPayloadFactory {
  static create(): CreatePostPayload {
    return {
      userId: 11,
      title: 'service-test-create-title',
      body: 'service-test-create-body'
    };
  }

  static replace(postId = 1): PutPostPayload {
    return {
      id: postId,
      userId: 21,
      title: 'service-test-replace-title',
      body: 'service-test-replace-body'
    };
  }

  static patch(): PatchPostPayload {
    return {
      title: 'service-test-patch-title'
    };
  }

  static invalidCreate(): Partial<CreatePostPayload> {
    return {
      userId: 11
    };
  }
}

