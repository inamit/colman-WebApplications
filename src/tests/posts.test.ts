import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import { Express } from 'express';
import postsModel, { IPost } from '../models/posts_model';

let app: Express; 

beforeAll(async () => {
  app = await initApp();
});
beforeEach(async () => {
  await postsModel.deleteMany();
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("POST /posts", () => {
  it("should create new post", async () => {
    const content = "This is my first post!";
    const sender = "amitinbar";
    const response = await request(app).post("/posts").send({
      content,
      sender,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.content).toBe(content);
    expect(response.body.sender).toBe(sender);
  });

  it.each([{ content: "No sender" }, { sender: "No content" }, {}])(
    "should return 400 when parameter is missing (%o)",
    async ({ content, sender }) => {
      const response = await request(app).post("/posts").send({
        sender,
        content,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    }
  );
});

const sender = "amitinbar";
const testPosts = [
  { content: "First post", sender },
  { content: "Second post", sender },
  { content: "Third post", sender: "Benli" },
];
describe("GET /posts", () => {
  describe("when there are no posts", () => {
    it("should return an empty array", async () => {
      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("when there are posts", () => {
    beforeEach(async () => {
      await postsModel.create(testPosts);
    });

    it("should return all posts", async () => {
      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(testPosts.length);
    });

    it("should return posts by sender", async () => {
      const expectedNumberOfPosts = testPosts.filter(
        (post) => post.sender === sender
      ).length;
      const response = await request(app).get(`/posts?sender=${sender}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((post: IPost) => {
        expect(post.sender).toBe(sender);
      });
      expect(response.body).toHaveLength(expectedNumberOfPosts);
    });
  });

  describe("mongo failure", () => {
    it("should return 500 when there is a server error", async () => {
      jest
        .spyOn(postsModel, "find")
        .mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("GET /posts/:post_id", () => {
  let savedPosts: IPost[] = [];
  beforeEach(async () => {
    savedPosts = await postsModel.create(testPosts);
  });

  it("should return 404 when post is not found", async () => {
    const response = await request(app).get("/posts/673b7bd1df3f05e1bdcf5320");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is invalid", async () => {
    const response = await request(app).get("/posts/invalid_id");

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return post by id", async () => {
    const post = savedPosts[0];
    const response = await request(app).get(`/posts/${post._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(JSON.parse(JSON.stringify(post)));
  });
});

describe("PUT /posts/:post_id", () => {
  let savedPosts: IPost[] = [];
  beforeEach(async () => {
    savedPosts = await postsModel.create(testPosts);
  });

  it("should return 404 when post is not found", async () => {
    const response = await request(app)
      .put("/posts/673b7bd1df3f05e1bdcf5320")
      .send({
        content: "Updated post",
        sender: "amitinbar",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is invalid", async () => {
    const response = await request(app).put("/posts/invalid_id").send({
      content: "Updated post",
      sender: "amitinbar",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it.each([{ content: "No sender" }, { sender: "No content" }, {}])(
    "should return 400 when parameter is missing (%o)",
    async ({ sender, content }) => {
      const post = savedPosts[0];
      const response = await request(app)
        .put(`/posts/${post._id}`)
        .send({ sender, content });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    }
  );

  it("should update post by id", async () => {
    const post = savedPosts[0];
    const updatedContent = "Updated content";
    const updatedSender = "Updated sender";
    const response = await request(app)
      .put(`/posts/${post._id}`)
      .send({ content: updatedContent, sender: updatedSender });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(updatedContent);
    expect(response.body.sender).toBe(updatedSender);
  });
});
