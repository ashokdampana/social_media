import { Hono } from "hono";
import commentController from "./controller";
import authMiddleware from "../utils/authMiddleware";

const commentRoute = new Hono()
  .get("/posts/:postId/comments", commentController.findByPost)
  .post("/posts/:postId/comments", authMiddleware, commentController.create)
  .put("/comments/:id", authMiddleware, commentController.update)
  .delete("/comments/:id", authMiddleware, commentController.deleteComment);

export default commentRoute;
