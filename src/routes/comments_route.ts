import { Router } from 'express';
const router: Router = Router();
import commentsController from "../controllers/comments_controller";

router.post("/", commentsController.saveNewComment);
router.get("/", commentsController.getComments);
router.put("/:comment_id", commentsController.updateCommentById);
router.delete("/:comment_id", commentsController.deleteCommentById);

export default router;
