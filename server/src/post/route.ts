import { Hono } from "hono";
import postController from "./controller";
import authMiddleware from "../utils/authMiddleware";

const postRoute = new Hono()
  .get('/', postController.findPosts)
  .get('/:id', postController.findPost)
  .post('/', authMiddleware, postController.create)
  .put('/:id', authMiddleware, postController.update)
  .delete('/:id', authMiddleware, postController.deletePost)

export default postRoute;
