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

export const POST_RESOURCE_NAME = "Post";
const Post = mongoose.model<IPost>(POST_RESOURCE_NAME, postSchema);

export default Post;