require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  const passwordCheck =
    user === null ? false : await bcrypt.compare(password, user.passwordHash); // we store the password hash to the database instead of password itself.

  if (!(user && passwordCheck)) {
    return res.status(400).json({ error: "invalid username or password" });
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userToken = {
    userName: user.userName,
    id: user._id,
  };

  const token = jwt.sign(userToken, process.env.SECRET);

  res.status(200).send({ token, userName: user.userName, name: user.name });
});

module.exports = loginRouter;
