const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    console.log("Gets authorzation header");
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { userName: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const savedBlog = await blog.save();

  // Update the user's blogs
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const blogToDelete = await Blog.findByIdAndDelete(id);
  res.status(204).json(blogToDelete);
});

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const updatedBlog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };

  const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });
  res.status(201).json(result);
});

module.exports = blogsRouter;
