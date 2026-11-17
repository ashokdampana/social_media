import type { Context } from 'hono';
import commentService from './service';

const commentController = {
  create: async (c: Context) => {
    const user = c.get('user');
    const postId = c.req.param('postId')!;
    const body = await c.req.json();
    const data = await commentService.create(postId, user, body);
    return c.json({ success: true, data, message: 'Comment created' }, 201);
  },

  findByPost: async (c: Context) => {
    const postId = c.req.param('postId')!;
    const page = Number(c.req.query('page') ?? 1);
    const limit = Number(c.req.query('limit') ?? 10);
    const data = await commentService.findByPost(postId, page, limit);
    return c.json({ success: true, data });
  },

  update: async (c: Context) => {
    const user = c.get('user');
    const id = c.req.param('id')!;
    const body = await c.req.json();
    const data = await commentService.update(id, user, body);
    return c.json({ success: true, data, message: 'Comment updated' });
  },

  deleteComment: async (c: Context) => {
    const user = c.get('user');
    const id = c.req.param('id')!;
    await commentService.deleteComment(id, user);
    return c.json({ success: true, message: 'Comment deleted' });
  },
};

export default commentController;