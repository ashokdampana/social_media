import { HTTPException } from 'hono/http-exception';
import { PostModel, CommentModel } from '../model';
import type { CommentInputType } from '../schema';
import type { AuthUser } from '../utils/authMiddleware';

const getOwned = async (id: string, user: AuthUser) => {
  const comment = await CommentModel.findById(id);
  if (!comment) throw new HTTPException(404, { message: 'Comment not found' });
  if (comment.userId.toString() !== user.id && user.role !== 'adminrole')
    throw new HTTPException(403, { message: 'Forbidden' });
  return comment;
};

const commentService = {
  create: async (postId: string, user: AuthUser, data: Pick<CommentInputType, 'text'>) => {
    if (!(await PostModel.exists({ _id: postId })))
      throw new HTTPException(404, { message: 'Post not found' });
    return CommentModel.create({ ...data, postId, userId: user.id });
  },

  findByPost: (postId: string, page = 1, limit = 10) =>
    CommentModel.find({ postId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

  update: async (id: string, user: AuthUser, body: Pick<CommentInputType, 'text'>) => {
    const comment = await getOwned(id, user);
    comment.text = body.text;
    return comment.save();
  },

  deleteComment: async (id: string, user: AuthUser) => {
    const comment = await getOwned(id, user);
    await comment.deleteOne();
  },
};

export default commentService;