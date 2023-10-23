const Blog = require("../models/blog");

const initialBlogs = [
  {
    author: "Morgan Housel",
    title: "Psychology of money",
    url: "https://www.example.com/@PsycholgyOfMoney",
    likes: 0,
    id: "65300ec63dcf96a4fc3f24f0",
  },
  {
    author: "Robert Greene",
    title: "48 Laws of Power",
    url: "https://www.example.com/48laws",
    likes: 50,
    id: "652fe68a1fc3487a51e8e7ff",
  },
  {
    author: "Paulo Coelho",
    title: "Alchemist",
    url: "Alc.com",
    likes: 48,
    id: "65300d4755004bf772bf174d",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    author: "Vitalik",
    title: "A new Ethereum",
    url: "https://Vitalik.com",
    likes: 500,
  });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
