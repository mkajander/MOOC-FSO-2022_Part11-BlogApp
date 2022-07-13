const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./utils/config");
const logger = require("./utils/logger");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/user");
const blogsRouter = require("./controllers/blog");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const { userExtractor } = require("./utils/middleware");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("./client/build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.get("/health", (req, res) => {
  res.send("ok");
});
app.get("/something", (req, res) => {
  res.send("something");
});

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", userExtractor, blogsRouter);
console.log("Running in mode:", process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
