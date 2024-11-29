const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
