import { HTTPException } from 'hono/http-exception';
import { PostModel, CommentModel } from '../model';
import type { PostInputType } from '../schema';
import type { AuthUser } from '../utils/authMiddleware';

const getOwned = async (id: string, user: AuthUser) => {
  const post = await PostModel.findById(id);
  if (!post) throw new HTTPException(404, { message: 'Post not found' });
  if (post.userId.toString() !== user.id && user.role !== 'adminrole')
    throw new HTTPException(403, { message: 'Forbidden' });
  return post;
};

const postService = {
  create: (user: AuthUser, data: PostInputType) =>
    PostModel.create({ ...data, userId: user.id }),

  findPosts: (page = 1, limit = 10) =>
    PostModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),

  findPost: async (id: string, page = 1, limit = 10) => {
    const post = await PostModel.findById(id).lean();
    if (!post) throw new HTTPException(404, { message: 'Post not found' });

    const comments = await CommentModel.find({ postId: id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { ...post, comments };
  },

  update: async (id: string, user: AuthUser, body: Partial<PostInputType>) => {
    const post = await getOwned(id, user);
    return Object.assign(post, body).save();
  },

  deletePost: async (id: string, user: AuthUser) => {
    const post = await getOwned(id, user);
    await post.deleteOne();
    await CommentModel.deleteMany({ postId: id });
  },
};

export default postService;