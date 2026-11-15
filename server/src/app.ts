import { Hono } from "hono";
import authRoute from './auth/route';

const app = new Hono();

app.get('/api/health', (c) => {
    return c.json({'message': 'Server running...'})
})

export const routes = app
    .route('/api/auth', authRoute);
    // .route('/api/posts', postRoute);

export default app;