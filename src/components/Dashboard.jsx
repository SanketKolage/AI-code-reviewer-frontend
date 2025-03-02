import React, { useEffect, useState, useCallback, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import axios from "axios";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion"; // For animations
import "../components/Dashboard.css"; // Keep styles in CSS

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [code, setCode] = useState(``);
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");
  const reviewRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showReview, setShowReview] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dropdown for user profile
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Handle Review Click
  const handleReviewClick = () => {
        if(!code) return;
    reviewCode();
    setShowReview(true);
    setTimeout(() => reviewRef.current?.scrollIntoView({ behavior: "smooth" }), 500);
  };

  // Syntax highlighting update
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  // Fetch AI-based code review
  const reviewCode = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/get-review`, { code, language });
      setReview(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [code, language]);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light px-3 header">
        <span className="navbar-brand">Code Reviewer</span>
        <div className="user-dropdown">
          <button className="btn btn-light dropdown-toggle" onClick={toggleDropdown}>
          <>Hello ,  </>  {username} 
          </button>

          <motion.ul
            className={`dropdown-menu dropdown-menu-end ${showDropdown ? "show" : ""}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: showDropdown ? 1 : 0, y: showDropdown ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <li>
              <button
                className="dropdown-item btn-danger logout-btn"
                onClick={() => {
                  localStorage.removeItem("username");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </li>
          </motion.ul>
        </div>
      </nav>

      {/* Dashboard Layout */}
      <main className="dashboard-container">
        {/* Code Editor Section */}
        <div className="editor-section">
          <h3 className="section-title">Code Editor</h3>

          <Editor
          placeholder="Write your code here..."
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              Prism.languages[language]
                ? Prism.highlight(code, Prism.languages[language], language)
                : code
            }
            padding={12}
            style={{
              fontFamily: "Fira Code, monospace",
              fontSize: 16,
              height: "85%",
              width: "100%",
              borderRadius: "10px",
              backgroundColor: "#282c34",
              color: "#ffffff",
            }}
          />

          <motion.button
            className="review-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReviewClick}
          >
            Review
          </motion.button>
        </div>

        {/* Review Output Section */}
        {showReview && (
          <motion.div
            className="review-section"
            ref={reviewRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="section-title">Review Output</h3>
            <Markdown>{review}</Markdown>
          </motion.div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
