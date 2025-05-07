import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5555/blogs";

const Home = ({
  blogs,
  handleSelectBlog,
  selectedBlog,
  handleCreateBlog,
  handleUpdateBlog,
  handleDeleteBlog,
  newBlog,
  setNewBlog,
  token,
  fetchAllBlogs,
}) => {
  const [publicBlog, setPublicBlog] = useState(null);
  const [userBlog, setUserBlog] = useState(null);
  useEffect(() => {
    if (!token && selectedBlog) {
      fetchAllBlogs();
    }
  }, [token, selectedBlog, fetchAllBlogs]);

  const handleSelectedBlog = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const blog = response.data.blog;
      setUserBlog(blog);
    } catch (error) {
      console.error("Error fetching blog:", error.message);
    }
  };

  const handleSelectBlogPublic = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/all`);
      const blog = response.data.data.find((blog) => blog._id === id);
      setPublicBlog(blog);
    } catch (error) {
      console.error("Error fetching blog:", error.message);
    }
  };

  return (
    <div className="main">
      <div className="sidebar">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="blog-item"
            onClick={() =>
              token
                ? handleSelectedBlog(blog._id)
                : handleSelectBlogPublic(blog._id)
            }
          >
            <div className="blog-item-content">
              <span>
                <img className="blogitem-img" src={blog.img} alt="Blog" />
              </span>
              <span>
                <h3>{blog.title}</h3>
              </span>
            </div>
            <div>
              <p>{blog.subheading}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="content">
        {token && userBlog ? (
          <>
            <img className="blog-img" src={userBlog.img} alt="Blog" />
            <button
              className="update-button"
              onClick={() => handleUpdateBlog(userBlog._id)}
            >
              Update Blog
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteBlog(userBlog._id)}
            >
              Delete Blog
            </button>
            <h2>{userBlog.title}</h2>
            <p>
              <strong>By:</strong> {userBlog.author}
            </p>
            <h3>{userBlog.subheading}</h3>
            <p className="blog-content">{userBlog.content}</p>
          </>
        ) : publicBlog ? (
          <>
            <img className="blog-img" src={publicBlog.img} alt="Blog" />
            <h2>{publicBlog.title}</h2>
            <p>
              <strong>By:</strong> {publicBlog.author}
            </p>
            <h3>{publicBlog.subheading}</h3>
            <p className="blog-content">{publicBlog.content}</p>
          </>
        ) : (
          <h2>Select a blog to view</h2>
        )}
        {token && (
          <div className="create-blog">
            <input
              type="text"
              placeholder="Title"
              value={newBlog.title}
              onChange={(e) =>
                setNewBlog({ ...newBlog, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Subheading"
              value={newBlog.subheading}
              onChange={(e) =>
                setNewBlog({ ...newBlog, subheading: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Author"
              value={newBlog.author}
              onChange={(e) =>
                setNewBlog({ ...newBlog, author: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={newBlog.content}
              onChange={(e) =>
                setNewBlog({ ...newBlog, content: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              placeholder="Image URL"
              value={newBlog.img}
              onChange={(e) => setNewBlog({ ...newBlog, img: e.target.value })}
            />
            <button onClick={handleCreateBlog}>Create Blog</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
