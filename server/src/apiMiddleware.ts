import type { Context, Next } from "hono";
import { cors } from "hono/cors";

// 1. Validate and extract the allowed frontend origin
function getAllowedOrigin(): string {
  const clientUrl =
    Bun.env.CLIENT_URL ?? (Bun.env.NODE_ENV === "production" ? "" : "http://localhost:5173");

  const url = new URL(clientUrl);
  const isHttp = url.protocol === "http:" || url.protocol === "https:";

  if (!isHttp) {
    throw new Error("CLIENT_URL must start with http:// or https://");
  }

  return url.origin;
}

const allowedOrigin = getAllowedOrigin();

// 2. Helper checks for cleaner reading
const isSafeMethod = (method: string) => ["GET", "HEAD", "OPTIONS"].includes(method);
const expectsBody = (method: string) => ["POST", "PUT", "PATCH"].includes(method);

// 3. Exported middleware
export const apiCors = cors({
  origin: allowedOrigin,
  credentials: true,
});

export async function apiSecurity(c: Context, next: Next) {
  const method = c.req.method;

  // Allow safe read-only requests through
  if (isSafeMethod(method)) {
    return next();
  }

  // Block requests from unknown websites
  const requestOrigin = c.req.header("Origin");
  if (requestOrigin !== allowedOrigin) {
    return c.json({ success: false, message: "Forbidden origin" }, 403);
  }

  // Require JSON when sending data
  const hasBody = c.req.raw.body !== null;
  if (expectsBody(method) && hasBody) {
    const contentType = c.req.header("Content-Type")?.split(";")?.[0]?.trim().toLowerCase();

    if (contentType !== "application/json") {
      return c.json({ success: false, message: "Content-Type must be application/json" }, 415);
    }
  }

  await next();
}
