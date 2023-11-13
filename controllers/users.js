const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { error } = require("../utils/logger");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
  });
  res.status(200).json(users);
});

usersRouter.post("/", async (req, res) => {
  const { userName, name, password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json({ error: "Username and Password are required" });
  }
  if (password.length < 3) {
    return res.status(400).json({
      error: "UserName and Password must be atleast 3 characters long",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    userName,
    name,
    passwordHash,
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;
