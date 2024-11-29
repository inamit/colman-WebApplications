const Post = require("../models/posts_model");

const getPosts = async (req, res) => {
  const { sender } = req.query;
  
  try {
    let posts = [];
    if (sender)
      posts = await Post.find({ sender: sender });
    else
      posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.warn("Error fetching posts:", err);
    res.status(500).json({ error: "An error occurred while fetching the posts." });
  }
};

const saveNewPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    console.warn("Error saving post:", err);
    res.status(500).json({ error: "An error occurred while saving the post." });
  }
};

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.warn("Error fetching post:", err);
    res.status(400).json({ error: "Invalid post ID" });
  }
};

const updatePostById = async (req, res) => {
  const { post_id } = req.params;
  const { content, sender } = req.body;

  try {
      if (!content || !sender)
          return res.status(400).json({ error: "Content and sender are required." });
      const updatedPost = await Post.findByIdAndUpdate(post_id, { content, sender }, { new: true, runValidators: true });
      if (!updatedPost)
          return res.status(404).json({ error: "Post not found." });
      res.json(updatedPost);
  } catch (err) {
      console.warn("Error updating post:", err);
      res.status(500).json({ error: "An error occurred while updating the post." });
  }
};

module.exports = { getPosts, saveNewPost, getPostById, updatePostById };
