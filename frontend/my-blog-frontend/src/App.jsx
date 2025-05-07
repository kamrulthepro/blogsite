import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./assets/static/App.css";
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";

const API_BASE_URL = "http://localhost:5555/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    subheading: "",
    author: "",
    content: "",
    img: "",
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      fetchUserBlogs();
    } else {
      fetchAllBlogs();
    }
  }, [token]);

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/all`);
      setBlogs(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  };

  const handleSelectBlog = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSelectedBlog(response.data.blog);
    } catch (error) {
      console.error("Error fetching blog:", error.message);
    }
  };

  const handleCreateBlog = async () => {
    try {
      await axios.post(API_BASE_URL, newBlog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserBlogs();
      setNewBlog({
        title: "",
        subheading: "",
        author: "",
        content: "",
        img: "",
      });
    } catch (error) {
      console.error("Error creating blog:", error.message);
    }
  };

  const handleUpdateBlog = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/${id}`, selectedBlog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserBlogs();
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error updating blog:", error.message);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserBlogs();
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error deleting blog:", error.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-links">
            {token ? (
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <a className="navlink" href="/login">
                  Login
                </a>
                <a className="navlink" href="/register">
                  Register
                </a>
              </>
            )}
          </div>
          <div className="nav-image">
            <img
              className="logo"
              src="https://www.justoglobal.com/news/public/images/Logo.png"
              alt="Logo 1"
            />
            <img
              className="logo"
              src="https://logodix.com/logo/1597047.gif"
              alt="Logo 2"
            />
          </div>
        </nav>
        <Routes>
          <Route
            path="/login"
            element={
              token ? <Navigate to="/" /> : <Login setToken={setToken} />
            }
          />
          <Route
            path="/register"
            element={
              token ? <Navigate to="/" /> : <Register setToken={setToken} />
            }
          />
          <Route
            path="/"
            element={
              <Home
                blogs={blogs}
                handleSelectBlog={handleSelectBlog}
                selectedBlog={selectedBlog}
                handleCreateBlog={handleCreateBlog}
                handleUpdateBlog={handleUpdateBlog}
                handleDeleteBlog={handleDeleteBlog}
                newBlog={newBlog}
                setNewBlog={setNewBlog}
                token={token}
                fetchAllBlogs={fetchAllBlogs}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
