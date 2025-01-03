import dotenv from "dotenv";
import express, { Express } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db";
import postsRoute from "./routes/posts_route";
import commentsRoute from "./routes/comments_route";
import usersRoute from "./routes/users_route";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/users", usersRoute);

const initApp = async (): Promise<Express> => {
  try {
    await connectDB();
    return app;
  } catch (err) {
    throw new Error(`Error connecting to DB: ${err}`);
  }
};

export default initApp;