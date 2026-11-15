import { Hono } from 'hono';
import authController from './controller';
import authMiddleware from '../utils/authMiddleware';
import { zValidator } from '@hono/zod-validator';
import { userInputSchema } from '../schema';
import { sendError } from '../utils/response';

// Assign directly as middleware (not a factory function)
const validator = zValidator('json', userInputSchema, (result, c) => {
  if (!result.success) {
    const firstError = result.error.issues[0]?.message || 'Invalid input';
    return sendError(c, firstError, 400);
  }
});

const route = new Hono()
  .post('/register', validator, authController.register)
  .post('/login', validator, authController.login)
  .post('/logout', authController.logout)
  .get('/me', authMiddleware, authController.checkMe)
  .delete('/me', authMiddleware, authController.deleteUser);

export default route;
