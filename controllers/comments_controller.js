const { handleMongoQueryError } = require("../db");
const Comment = require("../models/comments_model");
const Post = require("../models/posts_model");

const getComments = async (req, res) => {
  try {
    const { post_id } = req.query;
    const comments = await (post_id
      ? Comment.find({ postID: post_id })
      : Comment.find());

    return res.json(comments);
  } catch (err) {
    console.warn("Error fetching comments:", err);
    return handleMongoQueryError(res, err);
  }
};

const saveNewComment = async (req, res) => {
  const { post_id } = req.query;

  try {
    if (!post_id) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const postExists = (await Post.countDocuments({ _id: post_id }).exec()) > 0;
    if (!postExists) {
      return res.status(404).json({ error: "Post not found." });
    }

    const comment = new Comment({
      postID: post_id,
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedComment = await comment.save();
    return res.json(savedComment);
  } catch (err) {
    console.warn("Error saving comment:", err);
    return handleMongoQueryError(res, err);
  }
};

const updateCommentById = async (req, res) => {
  const { comment_id } = req.params;
  const { content, sender } = req.body;

  try {
    if (!content || !sender) {
      return res
        .status(400)
        .json({ error: "Content and sender are required." });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      comment_id,
      { content, sender },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    return res.json(updatedComment);
  } catch (err) {
    console.warn("Error updating comment:", err);
    return handleMongoQueryError(res, err);
  }
};

const deleteCommentById = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(comment_id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    return res.json(deletedComment);
  } catch (err) {
    console.warn("Error deleting comment:", err);
    return handleMongoQueryError(res, err);
  }
};

module.exports = {
  getComments,
  saveNewComment,
  updateCommentById,
  deleteCommentById,
};
