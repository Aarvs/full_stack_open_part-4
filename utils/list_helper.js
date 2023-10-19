const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;
  for (const blog of blogs) {
    sum = sum + blog.likes;
  }
  return sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null; // Handle the case where there are no blogs
  }

  let mostLikedBlog = null;
  let maxLikes = -1;
  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      mostLikedBlog = {
        author: blog.author,
        likes: blog.likes,
        title: blog.title,
      };
      maxLikes = blog.likes;
    }
  }
  return mostLikedBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null; // Handle the case where there are no blogs
  }

  // Create an object to store the count of blogs per author
  const authorCounts = {};

  // Iterate through the blogs and count the number of blogs per author
  for (const blog of blogs) {
    if (authorCounts[blog.author]) {
      authorCounts[blog.author]++;
    } else {
      authorCounts[blog.author] = 1;
    }
  }

  // Find the author with the most blogs
  let topAuthor = "";
  let maxBlogs = 0;

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      topAuthor = author;
      maxBlogs = authorCounts[author];
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
