const request = require("supertest");
const initApp = require("../server.js");
const mongoose = require("mongoose");
const postsModel = require("../models/posts_model");
const commentsModel = require("../models/comments_model");

let app;
let post;
beforeAll(async () => {
  app = await initApp();
  await postsModel.deleteMany();
  post = await postsModel.create({ content: "Test post", sender: "amitinbar" });
});

beforeEach(async () => {
  await commentsModel.deleteMany();
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("POST /comments", () => {
  it("should create new comment", async () => {
    const content = "This is my first comment!";
    const sender = "amitinbar";
    const response = await request(app)
      .post(`/comments?post_id=${post._id}`)
      .send({
        content,
        sender,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.content).toBe(content);
    expect(response.body.sender).toBe(sender);
    expect(response.body.postID).toBe(post._id.toString());
  });

  it.each([{ content: "No sender" }, { sender: "No content" }, {}])(
    "should return 400 when parameter is missing (%o)",
    async ({ content, sender }) => {
      const response = await request(app)
        .post(`/comments?post_id=${post._id}`)
        .send({
          sender,
          content,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    }
  );

  it("should return 404 when post does not exist", async () => {
    const response = await request(app)
      .post(`/comments?post_id=673b7bd1df3f05e1bdcf5320`)
      .send({
        content: "This is my first comment!",
        sender: "amitinbar",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is missing", async () => {
    const response = await request(app).post(`/comments`).send({
      content: "This is my first comment!",
      sender: "amitinbar",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is invalid", async () => {
    const response = await request(app).post(`/comments?post_id=invalid`).send({
      content: "This is my first comment!",
      sender: "amitinbar",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

let comments = [
  { content: "First comment", sender: "amitinbar" },
  { content: "Second comment", sender: "amitinbar" },
];
describe("GET /comments", () => {
  describe("when there are no comments", () => {
    it("should return empty array", async () => {
      const response = await request(app).get(`/comments`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("when there are comments", () => {
    beforeEach(async () => {
      comments = comments.map((comment) => ({ ...comment, postID: post._id }));
      comments.push({
        content: "Third comment",
        sender: "Benli",
        postID: "673b7bd1df3f05e1bdcf5321",
      });
      await commentsModel.create(comments);
    });

    it("should return all comments", async () => {
      const response = await request(app).get(`/comments`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(comments.length);
    });

    it("should return all comments by post id", async () => {
      const numberOfComments = comments.filter(
        (comment) => comment.postID === post._id
      ).length;
      const response = await request(app).get(`/comments?post_id=${post._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(numberOfComments);
    });

    it("should return empty array when post does not exist", async () => {
      const response = await request(app).get(
        `/comments?post_id=673b7bd1df3f05e1bdcf5320`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it("should return 400 when post_id is invalid", async () => {
      const response = await request(app).get(`/comments?post_id=invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("PUT /comments/:comment_id", () => {
  let savedComments;
  beforeEach(async () => {
    comments = comments.map((comment) => ({ ...comment, postID: post._id }));
    savedComments = await commentsModel.create(comments);
  });

  it("should update comment by id", async () => {
    const newContent = "Updated comment";
    const newSender = "amitinbar2";
    const response = await request(app)
      .put(`/comments/${savedComments[0]._id}`)
      .send({
        content: newContent,
        sender: newSender,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(newContent);
    expect(response.body.sender).toBe(newSender);
  });

  it("should return 404 when comment does not exist", async () => {
    const response = await request(app)
      .put(`/comments/673b7bd1df3f05e1bdcf5320`)
      .send({
        content: "Updated comment",
        sender: "amitinbar2",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it.each([{ content: "No sender" }, { sender: "No content" }, {}])(
    "should return 400 when parameter is missing (%o)",
    async ({ content, sender }) => {
      const response = await request(app)
        .put(`/comments/${savedComments[0]._id}`)
        .send({ content, sender });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    }
  );

  describe("mongo failure", () => {
    it("should return 500 when there is a server error", async () => {
      jest
        .spyOn(commentsModel, "findByIdAndUpdate")
        .mockRejectedValue(new Error("Server error"));

      const response = await request(app)
        .put(`/comments/${savedComments[0]._id}`)
        .send({
          content: "Updated comment",
          sender: "amitinbar2",
        });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("DELETE /comments/:comment_id", () => {
  let savedComments;
  beforeEach(async () => {
    comments = comments.map((comment) => ({ ...comment, postID: post._id }));
    savedComments = await commentsModel.create(comments);
  });

  it("should delete comment by id", async () => {
    const response = await request(app).delete(
      `/comments/${savedComments[0]._id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
  });

  it("should return 404 when comment does not exist", async () => {
    const response = await request(app).delete(
      `/comments/673b7bd1df3f05e1bdcf5320`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  describe("mongo failure", () => {
    it("should return 500 when there is a server error", async () => {
      jest
        .spyOn(commentsModel, "findByIdAndDelete")
        .mockRejectedValue(new Error("Server error"));

      const response = await request(app).delete(
        `/comments/${savedComments[0]._id}`
      );

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
