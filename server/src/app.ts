import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import authRoute from "./auth/route";
import commentRoute from "./comment/route";
import { apiCors, apiSecurity } from "./apiMiddleware";
import postRoute from "./post/route";
import { sendError } from "./utils/response";

const app = new Hono();

// Global middleware
app.use(logger());
app.use("/api/*", apiCors, apiSecurity);

// Health check
app.get("/api/health", (c) => {
  return c.json({ message: "Server running..." });
});

// API routes
app.route("/api/auth", authRoute)
    .route("/api/posts", postRoute)
    .route("/api/comments", commentRoute)
    .notFound((c) => {
        return sendError(c, 'Route Not Found', 404);
    })
    .onError((err, c) => {
        if (err instanceof HTTPException) {
            return sendError(c, err.message, err.status);
        }

        console.error(`${err}`);
        return sendError(c, 'Internal Server Error', 500);
    })

export default app;
