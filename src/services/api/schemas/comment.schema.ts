import { z } from 'zod';

export const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  body: z.string()
});

export const commentsSchema = z.array(commentSchema);

export type Comment = z.infer<typeof commentSchema>;

