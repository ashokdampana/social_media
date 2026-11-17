import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoute from './auth/route';
import commentRoute from "./comment/route";
import postRoute from "./post/route";
import { logger } from "hono/logger";

const configuredClientUrl =
    Bun.env.CLIENT_URL ?? (Bun.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5173');

if (!configuredClientUrl) {
    throw new Error('CLIENT_URL is required in production');
}

let clientOrigin: string;
try {
    const url = new URL(configuredClientUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error();
    }
    clientOrigin = url.origin;
} catch {
    throw new Error('CLIENT_URL must be a valid HTTP(S) URL');
}

const app = new Hono();
app.use( logger());
app.use('/api/*', cors({
    origin: clientOrigin,
    credentials: true,
}));
app.use('/api/*', async (c, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(c.req.method)) {
        await next();
        return;
    }

    if (c.req.header('Origin') !== clientOrigin) {
        return c.json({ success: false, message: 'Forbidden origin' }, 403);
    }

    if (
        ['POST', 'PUT', 'PATCH'].includes(c.req.method) &&
        c.req.raw.body !== null &&
        c.req.raw.body !== undefined
    ) {
        const contentType = c.req.header('Content-Type')?.split(';', 1)[0]?.trim().toLowerCase();
        if (contentType !== 'application/json') {
            return c.json({ success: false, message: 'Content-Type must be application/json' }, 415);
        }
    }

    await next();
});
app.get('/api/health', (c) => {
    return c.json({'message': 'Server running...'})
})

export const routes = app
    .route('/api/auth', authRoute)
    .route('/api/posts', postRoute)
    .route('/api/comments', commentRoute)

export type AppType = typeof routes;

export default app;
