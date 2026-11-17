import { Hono } from "hono";
import authRoute from './auth/route';
import commentRoute from "./comment/route";
import postRoute from "./post/route";
import { logger } from "hono/logger";


const app = new Hono();
app.use( logger());
app.get('/api/health', (c) => {
    return c.json({'message': 'Server running...'})
})

export const routes = app
    .route('/api/auth', authRoute)
    .route('/api/posts', postRoute)
    .route('/api/comments', commentRoute)

export type AppType = typeof routes;

export default app;
