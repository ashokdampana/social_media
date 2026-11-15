import type { Context } from 'hono';
import authService from './service';
import { sendSuccess } from '../utils/response';
import { clearCookie, generateCookie } from '../utils/cookie';
import type { UserInputType } from '../schema';
import type { AuthUser } from '../utils/authMiddleware';

type AuthContext = Context<{ Variables: { user: AuthUser } }>;
type BodyContext<T> = Context<any, any, { in: { json: T }; out: { json: T } }>;

// sendSuccess(c, message, data, status)
const authController = {
  register: async (c: BodyContext<UserInputType>) => {
    const body = c.req.valid('json');
    const user = await authService.register(body);

    await generateCookie(c, user);
    return sendSuccess(c, 'User registered successfully', user, 201);
  },

  login: async (c: BodyContext<UserInputType>) => {
    const body = c.req.valid('json');
    const user = await authService.login(body);

    await generateCookie(c, user);
    return sendSuccess(c, 'Login successful', user, 200);
  },

  logout: (c: Context) => {
    clearCookie(c);
    return sendSuccess(c, 'Logged out successfully');
  },

  checkMe: async (c: AuthContext) => {
    const { id } = c.get('user');
    const user = await authService.checkMe(id);

    return sendSuccess(c, 'Authenticated', user);
  },

  deleteUser: async (c: AuthContext) => {
    const { id } = c.get('user');
    await authService.deleteUser(id);

    clearCookie(c);
    return sendSuccess(c, 'User deleted successfully');
  },
};

export default authController;
