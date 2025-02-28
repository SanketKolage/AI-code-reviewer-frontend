import React, { useEffect, useState, useCallback, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-php";

import axios from "axios";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/Dashboard.css"; // Keep styles separate

const Dashboard = () => {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");
  const reviewRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showReview, setShowReview] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle screen resizing for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle dropdown for user profile
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent immediate closure
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Handle code review button click
  const handleReviewClick = () => {
    reviewCode();
    if (isMobile) {
      setShowReview(true); // Show review section in mobile view
    }
  };

  // Ensure PrismJS syntax highlighting updates
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  // Fetch AI-based code review
  const reviewCode = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code, language });
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
          <button
            className="btn btn-light dropdown-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(e);
            }}
          >
            {username} ⬇️
          </button>
          {showDropdown && (
            <ul className="dropdown-menu show dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => {
                    localStorage.removeItem("username");
                    navigate("/login"); // Redirect to login
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Dashboard Layout */}
      <main className="dashboard-container">
        {/* Code Editor Section */}
        <div className="editor-section">
          <h3 className="section-title">Code Editor</h3>
          
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) => {
              if (!Prism.languages[language]) {
                console.warn(`PrismJS: Language "${language}" not loaded.`);
                return code; // Prevent crash if language is missing
              }
              return Prism.highlight(code, Prism.languages[language], language);
            }}
            padding={10}
            style={{
              fontFamily: "Fira Code, monospace",
              fontSize: 16,
              height: "85%",
              width: "100%",
            }}
          />
          <button className="review-btn" onClick={handleReviewClick}>
            Review
          </button>
        </div>

        {/* Review Output Section (Hidden in Mobile until Clicked) */}
        {(!isMobile || showReview) && (
          <div className="review-section" ref={reviewRef}>
            <h3 className="section-title">Review Output</h3>
            <Markdown>{review}</Markdown>
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
