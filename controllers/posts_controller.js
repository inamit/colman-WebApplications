const { handleMongoQueryError } = require("../db");
const Post = require("../models/posts_model");

const getPosts = async (req, res) => {
  const { sender } = req.query;

  try {
    let posts = await (sender ? Post.find({ sender: sender }) : Post.find());

    return res.json(posts);
  } catch (err) {
    console.warn("Error fetching posts:", err);
    return handleMongoQueryError(res, err);
  }
};

const saveNewPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedPost = await post.save();

    return res.json(savedPost);
  } catch (err) {
    console.warn("Error saving post:", err);
    return handleMongoQueryError(res, err);
  }
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (err) {
    console.warn("Error fetching post:", err);
    return handleMongoQueryError(res, err);
  }
};

const updatePostById = async (req, res) => {
  const { post_id } = req.params;
  const { content, sender } = req.body;

  try {
    if (!content || !sender) {
      return res
        .status(400)
        .json({ error: "Content and sender are required." });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { content, sender },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.json(updatedPost);
  } catch (err) {
    console.warn("Error updating post:", err);
    return handleMongoQueryError(res, err);
  }
};

module.exports = { getPosts, saveNewPost, getPostById, updatePostById };
