import express from "express";
import { Blog } from "../models/blogModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new blog post
router.post("/", protect, async (req, res) => {
  const { img, title, author, subheading, content, section } = req.body;

  try {
    if (!title || !author || !subheading || !content) {
      return res.status(400).send({ message: "Request Failed to Create" });
    }
    const newBlog = {
      img,
      title,
      author,
      subheading,
      content,
      section,
      user: req.user._id,
    };
    const blog = await Blog.create(newBlog);
    return res.status(201).send(blog);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Get all blogs for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).populate(
      "user",
      "username"
    );
    return res.status(200).json({
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Get a specific blog by ID for the logged-in user
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id, user: req.user._id }).populate(
      "user",
      "username"
    );
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Get all blogs (public route)
router.get("/public/all", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("user", "username");
    return res.status(200).json({
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.put("/:id", protect, async (request, response) => {
  const { title, author, subheading, content } = request.body;

  try {
    if (!title || !author || !subheading || !content) {
      return response
        .status(400)
        .send({ message: "Send all required fields!" });
    }
    const { id } = request.params;
    const blog = await Blog.findById(id);

    if (blog.user.toString() !== request.user._id.toString()) {
      return response.status(401).send({ message: "Not authorized" });
    }

    blog.title = title;
    blog.author = author;
    blog.subheading = subheading;
    blog.content = content;

    const updatedBlog = await blog.save();
    return response.status(200).send(updatedBlog);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Blog removed" });
  } catch (error) {
    console.error("Error deleting blog:", error); // Log the error
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
