import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email domain
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR FULL:", err);
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          {error && <div className="error-text">{error}</div>}

          <input
            placeholder="Email (@gmail.com or @test.com)"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Clear error when user types
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error when user types
            }}
            required
          />

          <button type="submit" className="btn-primary">Login</button>
          <div className="auth-link">
            Don't have an account? <a href="/signup">Signup</a>
          </div>
        </form>
      </div>
    </div>
  );
}