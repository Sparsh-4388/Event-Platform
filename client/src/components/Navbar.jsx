import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo-text">
        <span className="logo-icon">E</span>
        <span className="logo-name">EVENTIFY</span>
      </Link>

      <div className="nav-actions">
        {!user ? (
          <>
            <Link to="/login" className="nav-link nav-login">Login</Link>
            <Link to="/signup" className="nav-link nav-signup">Sign up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}