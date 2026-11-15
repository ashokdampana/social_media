import { UserModel } from '../model';
import type { UserInputType } from '../schema';
import tryCatch from '../utils/tryCatch';
import { HTTPException } from 'hono/http-exception';
import type { AuthUser } from '../utils/authMiddleware';

const formatUser = (user: any): AuthUser => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
});

const authService = {
  register: async (data: UserInputType) => {
    const { email, password, role } = data;

    const { data: userExists, error: findErr } = await tryCatch(UserModel.findOne({ email }));
    if (findErr) throw new HTTPException(500, { message: 'Database error' });
    if (userExists) throw new HTTPException(400, { message: 'Email already exists' });

    const hashedPassword = await Bun.password.hash(password);
    const { data: newUser, error: createErr } = await tryCatch(
      UserModel.create({ email, password: hashedPassword, role })
    );
    if (createErr || !newUser) throw new HTTPException(400, { message: 'Failed to create user' });

    return formatUser(newUser);
  },

  login: async ({ email, password }: UserInputType) => {
    // Only place that needs '+password' since schema sets select: false
    const { data: user, error: findErr } = await tryCatch(
      UserModel.findOne({ email }).select('+password')
    );
    if (findErr) throw new HTTPException(500, { message: 'Database error' });

    if (!user || !(await Bun.password.verify(password, user.password))) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    return formatUser(user);
  },

  findUsers: async () => {
    const { data: users, error } = await tryCatch(UserModel.find().lean());
    if (error || !users) throw new HTTPException(500, { message: 'Database error' });

    return users.map(formatUser);
  },

  checkMe: async (id: string) => {
    const { data: user, error } = await tryCatch(UserModel.findById(id));
    if (error) throw new HTTPException(400, { message: 'Invalid user ID' });
    if (!user) throw new HTTPException(404, { message: 'User not found' });

    return formatUser(user);
  },

  update: async (id: string, body: Partial<UserInputType>) => {
    const updateData = { ...body };
    if (updateData.password) {
      updateData.password = await Bun.password.hash(updateData.password);
    }

    const { data: updatedUser, error } = await tryCatch(
      UserModel.findByIdAndUpdate(id, updateData, { new: true })
    );
    if (error) throw new HTTPException(400, { message: 'Failed to update user' });
    if (!updatedUser) throw new HTTPException(404, { message: 'User not found' });

    return formatUser(updatedUser);
  },

  deleteUser: async (id: string) => {
    const { data: deleted, error } = await tryCatch(UserModel.findByIdAndDelete(id));
    if (error) throw new HTTPException(400, { message: 'Invalid user ID' });
    if (!deleted) throw new HTTPException(404, { message: 'User not found' });
  },
};

export default authService;
