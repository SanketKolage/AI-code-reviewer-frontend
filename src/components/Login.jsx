import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("/dashboard");
      } else {
        console.error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
