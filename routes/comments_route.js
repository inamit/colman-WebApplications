const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments_controller");

router.post("/", commentsController.saveNewComment);
router.get("/", commentsController.getComments);
router.put("/:comment_id", commentsController.updateCommentById);
router.delete("/:comment_id", commentsController.deleteCommentById);

module.exports = router;
