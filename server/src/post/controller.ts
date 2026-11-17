import type { Context } from 'hono';
import postService from './service';

const postController = {
  create: async (c: Context) => {
    const user = c.get('user');
    const body = await c.req.json();
    const data = await postService.create(user, body);
    return c.json({ success: true, data, message: 'Post created' }, 201);
  },

  findPosts: async (c: Context) => {
    const page = Number(c.req.query('page') ?? 1);
    const limit = Number(c.req.query('limit') ?? 10);
    const data = await postService.findPosts(page, limit);
    return c.json({ success: true, data });
  },

  findPost: async (c: Context) => {
    const id = c.req.param('id')!;
    const page = Number(c.req.query('commentsPage') ?? 1);
    const limit = Number(c.req.query('commentsLimit') ?? 10);
    const data = await postService.findPost(id, page, limit);
    return c.json({ success: true, data });
  },

  update: async (c: Context) => {
    const user = c.get('user');
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = await postService.update(id, user, body);
    return c.json({ success: true, data, message: 'Post updated' });
  },

  deletePost: async (c: Context) => {
    const user = c.get('user');
    const id = c.req.param('id')!;
    await postService.deletePost(id, user);
    return c.json({ success: true, message: 'Post deleted' });
  },
};

export default postController;