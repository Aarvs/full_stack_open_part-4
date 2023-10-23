const blogsRouter = require("express").Router();
const { request } = require("../app");
const blog = require("../models/blog");
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

blogsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const blogToDelete = await blog.findByIdAndDelete(id);
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
