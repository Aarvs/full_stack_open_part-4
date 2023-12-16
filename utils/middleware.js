const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
  console.log("Method", req.method);
  console.log("Path", req.path);
  console.log("Body", req.body);
  console.log("---");
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.message === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }
  next(error);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = await req.get("authorization");
  console.log(authorization);
  if (authorization && authorization.startsWith("Bearer ")) {
    console.log("Gets authorization header");
    req.token = authorization.replace("Bearer ", "");
  }
  console.log("Token in tokenExtractor:", req.token);
  next();
};

const userExtractor = async (req, res, next) => {
  try {
    console.log("Token in userExtractor:", req.token);
    const token = req.token;

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find the user based on the decoded token
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Set the user to the request object
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
};
