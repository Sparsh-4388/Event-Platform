import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateEmail = (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if email ends with @gmail.com or @test.com
    if (!trimmedEmail.endsWith("@gmail.com") && !trimmedEmail.endsWith("@test.com")) {
      return "Only @gmail.com (users) or @test.com (admins) emails are allowed";
    }
    
    // Basic email format validation
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

    // Validate required fields
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

    // Validate email domain
    const emailError = validateEmail(form.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
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
            placeholder="Name" 
            value={form.name}
            onChange={handleChange}
            required
          />
          
          <input 
            name="email" 
            placeholder="Email" 
            value={form.email}
            onChange={handleChange}
            required
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password (min 6 characters)" 
            value={form.password}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="btn-primary">Signup</button>

          <div className="auth-link">
            Already have an account? <a href="/login">Login</a>
          </div>
          
          <div className="auth-link" style={{ fontSize: "0.75rem", marginTop: "0.5rem" }}>
            Want an admin account?<br />
            Contact Me: sparshp773@gmail.com
          </div>
        </form>
      </div>
    </div>
  );
}