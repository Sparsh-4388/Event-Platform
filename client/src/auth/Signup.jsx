import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail.endsWith("@gmail.com") && !trimmedEmail.endsWith("@test.com")) {
      return "Only @gmail.com (users) or @test.com (admins) emails are allowed";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address";
    }
    
    return null;
  };

  const determineRole = (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.endsWith("@test.com")) {
      return "admin";
    } else if (trimmedEmail.endsWith("@gmail.com")) {
      return "user";
    }
    
    return "user";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const emailError = validateEmail(form.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setLoading(true);
      const role = determineRole(form.email);
      
      await api.post("/api/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: role,
      });
      
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <h2>Signup</h2>
          
          {error && <div className="error-text">{error}</div>}
          
          <input 
            name="name" 
            type="text"
            placeholder="Name" 
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
          
          <input 
            name="email"
            type="email" 
            placeholder="Email (@gmail.com or @test.com)" 
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password (min 6 characters)" 
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Signup"}
          </button>

          <div className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
          
          <div className="auth-link" style={{ fontSize: "0.75rem", marginTop: "0.5rem", opacity: 0.8 }}>
            Want an admin account?<br />
            Contact: sparshp773@gmail.com
          </div>
        </form>
      </div>
    </div>
  );
}