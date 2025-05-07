import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    subheading: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    section: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamp: true,
  }
);

export const Blog = mongoose.model("Blog", blogSchema);
