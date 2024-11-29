const Comment = require("../models/comments_model");

const getComments = async (req, res) => {
  try {
    const { post_id } = req.query;
    const comments = await (post_id
      ? Comment.find({ postID: post_id })
      : Comment.find());
    res.json(comments);
  } catch (err) {
    console.warn("Error fetching comments:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the comments." });
  }
};

const saveNewComment = async (req, res) => {
  const { post_id } = req.query;

  try {
    const comment = new Comment({
      postID: post_id,
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (err) {
    console.warn("Error saving comment:", err);
    res
      .status(500)
      .json({ error: "An error occurred while saving the comment." });
  }
};

const updateCommentById = async (req, res) => {
  const { comment_id } = req.params;
  const { content, sender } = req.body;

  try {
    if (!content || !sender)
      return res
        .status(400)
        .json({ error: "Content and sender are required." });
    const updatedComment = await Comment.findByIdAndUpdate(
      comment_id,
      { content, sender },
      { new: true, runValidators: true }
    );
    if (!updatedComment)
      return res.status(404).json({ error: "Comment not found." });
    res.json(updatedComment);
  } catch (err) {
    console.warn("Error updating comment:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the comment." });
  }
};

const deleteCommentById = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(comment_id);
    if (!deletedComment)
      return res.status(404).json({ error: "Comment not found." });
    res.json(deletedComment);
  } catch (err) {
    console.warn("Error deleting comment:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment." });
  }
};

module.exports = {
  getComments,
  saveNewComment,
  updateCommentById,
  deleteCommentById,
};
