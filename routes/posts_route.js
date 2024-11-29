const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts_controller");

router.get("/", postsController.getPosts);
router.post("/", postsController.saveNewPost);
router.get("/:post_id", postsController.getPostById);
router.put("/:post_id", postsController.updatePostById);

module.exports = router;