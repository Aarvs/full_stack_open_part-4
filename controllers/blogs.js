const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  if (body.url === undefined || body.title === undefined) {
    return res.status(400).json({ error: "Bad Request" });
  }
  const blog = new Blog(body);
  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;
