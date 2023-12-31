const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { userName: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
  } catch (error) {
    // Handle other types of errors
    console.error("Error creating blog:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  const blogId = req.params.id;
  const user = req.user;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  const userId = decodedToken.id;
  const blog = await Blog.findById(blogId).populate("user", { _id: 1 });

  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  await Blog.findByIdAndRemove(blogId);
  res.status(204).end();
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
