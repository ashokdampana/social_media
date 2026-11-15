import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export type AuthUser = {
  id: string;
  email: string;
  role: "userrole" | "adminrole";
};

const authMiddleware = createMiddleware<{ Variables: { user: AuthUser } }>(
  async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) throw new HTTPException(401, { message: "Unauthorized" });

    try {
      const payload = await verify(token, Bun.env.JWT_SECRET!, "HS256");
      c.set("user", payload as AuthUser);
    } catch {
      throw new HTTPException(401, { message: "Invalid token" });
    }

    await next();
  }
);

export default authMiddleware;
