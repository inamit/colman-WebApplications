require("dotenv").config();
const { connectDB } = require("./db");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/posts", require("./routes/posts_route"));
app.use("/comments", require("./routes/comments_route"));

const initApp = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDB();
      resolve(app);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = initApp;
