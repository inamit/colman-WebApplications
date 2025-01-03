import { Request, Response } from "express";
import { handleMongoQueryError } from "../db";
import Post, { IPost } from "../models/posts_model";

export const getPosts = async (req: Request, res: Response): Promise<any> => {
  const { sender }: { sender?: string } = req.query;

  try {
    let posts: IPost[] | null = await (sender ? Post.find({ sender: sender }) : Post.find());
    return res.json(posts);
  } catch (err: any) {
    console.warn("Error fetching posts:", err);
    return handleMongoQueryError(res, err);
  }
};

export const saveNewPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const post = new Post({
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedPost: IPost = await post.save();
    return res.json(savedPost);
  } catch (err: any) {
    console.warn("Error saving post:", err);
    return handleMongoQueryError(res, err);
  }
};

export const getPostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;

  try {
    const post: IPost | null = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (err: any) {
    console.warn("Error fetching post:", err);
    return handleMongoQueryError(res, err);
  }
};

export const updatePostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;
  const { content, sender }: { content?: string; sender?: string } = req.body;

  try {
    if (!content || !sender) {
      return res.status(400).json({ error: "Content and sender are required." });
    }

    const updatedPost: IPost | null = await Post.findByIdAndUpdate(
      post_id,
      { content, sender },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.json(updatedPost);
  } catch (err: any) {
    console.warn("Error updating post:", err);
    return handleMongoQueryError(res, err);
  }
};