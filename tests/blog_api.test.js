const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("Verify number of blog posts application returns", async () => {
  const response = await api.get("/api/blogs");
  expect(response.headers["content-type"]).toMatch(/application\/json/);
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("Blog posts return id instead of _id", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect((res) => {
      const blogs = res.body;
      expect(Array.isArray(blogs)).toBe(true);

      blogs.forEach((blog) => {
        expect(blog.id).toBeDefined();
      });
    });
});

test("Verify whether a new blog post is added successfully", async () => {
  const newBlogPost = {
    author: "Neo",
    title: "Nine",
    url: "Nin.com",
    likes: 54,
  };

  // Get the initial number of blogs
  const initialBlogs = await Blog.find({});
  console.log(helper.initialBlogs);

  // Make a POST request to create a new blog
  await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Get the response after adding the new blog
  const response = await api.get("/api/blogs");

  // Get the updated number of blogs after the POST request
  const updatedBlogs = await helper.blogsInDb();

  // Verify that the total number of blogs increased by one
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1);

  // Verify that the response contains the new blog post
  const addedBlog = response.body.find(
    (blog) => blog.title === newBlogPost.title
  );

  expect(addedBlog).toBeDefined();
  expect(addedBlog.author).toBe(newBlogPost.author);
  expect(addedBlog.url).toBe(newBlogPost.url);
  // expect(addedBlog.likes).toBe(newBlogPost.likes);
});

test("By default the value of likes property in blog posts is set to 0", async () => {
  const blogPostWithNoLikesProperty = {
    author: "Morgan Housel",
    title: "Psychology of money",
    url: "https://www.example.com/@PsycholgyOfMoney",
  };

  await api
    .post("/api/blogs")
    .send(blogPostWithNoLikesProperty)
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .expect((res) => {
      expect(res.body.likes).toBe(0);
    });
});

test("Verify that a new blog provided a url and title properties filled", async () => {
  const blogPostWithNoUrlOrTitle = {
    author: "James Clear",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(blogPostWithNoUrlOrTitle)
    .expect(400)
    .expect((res) => {
      expect(res.body.error).toBe("Bad Request");
    });
});

test("Deleting a single blog via id", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

  const restId = blogsAtEnd.map((blog) => blog.id);
  expect(restId).not.toContain(blogToDelete.id);
});

test("Updating the likes property of a targeted blog", async () => {
  const blogs = await helper.blogsInDb();
  const blogToBeUpdate = blogs[1];
  const updatedLikes = {
    likes: 50,
  };
  await api
    .put(`/api/blogs/${blogToBeUpdate.id}`)
    .send(updatedLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .expect((res) => {
      expect(res.body.likes).toBe(updatedLikes.likes);
    });
});

describe("testing users", () => {
  test("Invalid users are not created and expect a bad request status code and an error message", async () => {
    const invalidUser = {
      username: "pi",
      password: "3",
    };
    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect((res) => {
      expect(res.body.error).toBe(
        "UserName and Password must be atleast 3 characters long"
      );
    });
  });
});
