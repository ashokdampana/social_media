import type { Context } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';
import type { AuthUser } from './authMiddleware';

const JWT_SECRET = Bun.env.JWT_SECRET!;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export const generateCookie = async (c: Context, payload: AuthUser) => {
  
  const exp = Math.floor(Date.now() / 1000) + SEVEN_DAYS;
  const token = await sign({ ...payload, exp }, JWT_SECRET, 'HS256');

  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: Bun.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: SEVEN_DAYS,
  });
};

export const clearCookie = (c: Context) => {
  deleteCookie(c, 'token', { path: '/' });
};
