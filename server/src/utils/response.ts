// utils/response.ts
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";


export const sendSuccess = (
  c: Context,
  message = "Success",
  data?: unknown,
  status: ContentfulStatusCode = 200,
) => c.json({ success: true, message, data }, status);

export const sendError = (
  c: Context,
  message = "Something went wrong",
  status: ContentfulStatusCode = 500,
  errors?: unknown
) => c.json({ success: false, message, errors }, status);
