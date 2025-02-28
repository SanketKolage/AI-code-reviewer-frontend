import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  // const username = localStorage.getItem("email") || "User";
  const [username, setUsername] = useState("");
  useEffect(() => {
    // Fetch username from localStorage on mount
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-light px-3">
      <span className="navbar-brand">Code Reviewer</span>

      {/* ✅ User Dropdown in Right Corner */}
      <div className="dropdown ms-auto">
        <button className="btn btn-light dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
          {username} ⬇
        </button>
        {showDropdown && (
          <ul className="dropdown-menu show dropdown-menu-end">
            <li>
              <button className="dropdown-item text-danger " onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Header;
