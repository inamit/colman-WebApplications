const express = require("express");
const router = express.Router();

const { getPosts, saveNewPost, getPostById, updatePostById } = require("../controllers/posts_controller");
router.get("/", getPosts);
router.post("/", saveNewPost);
router.get("/:post_id", getPostById);
router.put("/:post_id", updatePostById);

module.exports = router;