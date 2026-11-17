import { HTTPException } from 'hono/http-exception';
import { PostModel, CommentModel, UserModel } from '../model';
import commentService from '../comment/service';
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
    PostModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: CommentModel.collection.name,
          let: { postId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 50 },
            {
              $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'author',
              },
            },
            { $set: { user_email: { $arrayElemAt: ['$author.email', 0] } } },
            { $unset: 'author' },
          ],
          as: 'comments',
        },
      },
    ]),

  findPost: async (id: string, page = 1, limit = 10) => {
    const post = await PostModel.findById(id).lean();
    if (!post) throw new HTTPException(404, { message: 'Post not found' });

    const comments = await commentService.findByPost(id, page, limit);

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