import { Router } from 'express';
const router: Router = Router();
import * as postsController from "../controllers/posts_controller";

router.get("/", postsController.getPosts);
router.post("/", postsController.saveNewPost);
router.get("/:post_id", postsController.getPostById);
router.put("/:post_id", postsController.updatePostById);

export default router;