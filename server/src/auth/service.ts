import { HTTPException } from 'hono/http-exception';
import { UserModel } from '../model';
import type { UserInputType } from '../schema';
import type { AuthUser } from '../utils/authMiddleware';

type UserRecord = {
  _id: { toString: () => string };
  email: string;
  role: AuthUser['role'];
};

const formatUser = (u: UserRecord): AuthUser => ({
  id: u._id.toString(),
  email: u.email,
  role: u.role,
});

const getUser = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new HTTPException(404, { message: 'User not found' });
  return user;
};

const authService = {
  register: async ({ email, password, role }: UserInputType) => {
    if (await UserModel.exists({ email }))
      throw new HTTPException(400, { message: 'Email already exists' });

    const user = await UserModel.create({
      email,
      password: await Bun.password.hash(password),
      role,
    });
    return formatUser(user);
  },

  login: async ({ email, password }: UserInputType) => {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user || !(await Bun.password.verify(password, user.password)))
      throw new HTTPException(401, { message: 'Invalid email or password' });
    return formatUser(user);
  },

  findUsers: async () => (await UserModel.find().lean()).map(formatUser),

  checkMe: async (id: string) => formatUser(await getUser(id)),

  update: async (id: string, body: Partial<UserInputType>) => {
    const user = await getUser(id);
    if (body.password) body.password = await Bun.password.hash(body.password);
    Object.assign(user, body);
    return formatUser(await user.save());
  },

  deleteUser: async (id: string) => {
    await (await getUser(id)).deleteOne();
  },
};

export default authService;