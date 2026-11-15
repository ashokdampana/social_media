import { Hono } from "hono";
import postController from "./controller";

const postRoute = new Hono()
.post('/', postController.create)
.get('/', postController.getAll)
.get('/:id', postController.getOne)
.put('/:id', postController.update)
.delete('/:id', postController.delete)

export default postRoute;
