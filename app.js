// const config = require("./utils/config");
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const middleware = require("./utils/middleware");
// const blogsRouter = require("./controllers/blogs");
// const usersRouter = require("./controllers/users");
// const logger = require("./utils/logger");
// const mongoose = require("mongoose");
// const loginRouter = require("./controllers/login");

// mongoose.set("strictQuery", false);

// logger.info("connection to", config.MONGODB_URI);

// mongoose
//   .connect(config.MONGODB_URI)
//   .then(() => logger.info("connected to mongodb"))
//   .catch((error) => {
//     logger.error("error connecting to MongoDB:", error.message);
//   });

// app.use(middleware.tokenExtractor);
// app.use(middleware.requestLogger);
// app.use(express.static("build"));
// app.use(express.json());
// app.use(cors());

// // use the middleware only in /api/blogs routes
// app.use("/api/blogs", blogsRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/login", loginRouter);

// app.use(middleware.unknownEndpoint);
// app.use(middleware.errorHandler);

// module.exports = app;

const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);

logger.info("connection to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to mongodb"))
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

// use the middleware only in /api/blogs routes
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
