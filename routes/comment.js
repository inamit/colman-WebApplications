const express = require("express");
const router = express.Router();

const {
  getComments,
  updateCommentById,
  deleteCommentById,
  saveNewComment,
} = require("../controllers/comment");

router.post("/", saveNewComment);
router.get("/", getComments);
router.put("/:comment_id", updateCommentById);
router.delete("/:comment_id", deleteCommentById);

module.exports = router;
