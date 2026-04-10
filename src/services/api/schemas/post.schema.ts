import { z } from 'zod';

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string()
});

export const createPostRequestSchema = postSchema.omit({ id: true });
export const patchPostRequestSchema = z
  .object({
    title: z.string().optional(),
    body: z.string().optional()
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be supplied for PATCH'
  });

export const postsSchema = z.array(postSchema);

export type Post = z.infer<typeof postSchema>;
export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
export type PatchPostRequest = z.infer<typeof patchPostRequestSchema>;

