import mongoose, { Schema, Types } from "mongoose";

export interface IPost {
  _id: Types.ObjectId,
  content: string;
  sender: string;
}

const postSchema = new Schema<IPost>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;