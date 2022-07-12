const Blog = require("../models/blogs");
const blogsRouter = require("express").Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    const currentUser = request.currentUser;
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    });
    console.log(currentUser);
    if (!currentUser) {
      return response.status(401).json({ error: "user not authorized" });
    }
    blog.user = currentUser._id;
    const savedBlog = await blog.save();
    currentUser.blogs = currentUser.blogs.concat(savedBlog._id);
    await currentUser.save();
    response.status(201).json(blog.toJSON());
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const currentUser = request.currentUser;
    if (!currentUser) {
      return response.status(401).json({ error: "user not authorized" });
    }
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }
    if (blog.user.toString() !== currentUser._id.toString()) {
      return response.status(401).json({ error: "user not authorized" });
    }
    await blog.remove();
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
// COMMENTS ENDPOINT FOR 7.18 where request.body is { 'comment': 'comment' }
blogsRouter.post("/:id/comments", async (request, response, next) => {
  try {
    const body = request.body;
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }
    if (!body.comment) {
      return response.status(400).json({ error: "comment is required" });
    }
    blog.comments = blog.comments.concat(body.comment);
    await blog.save();
    response.status(201).json(blog.toJSON());
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    response.json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
