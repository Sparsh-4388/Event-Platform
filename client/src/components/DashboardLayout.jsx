import { NavLink } from "react-router-dom";
import OverlayLoader from "./Loader";
import "../App.css"

export default function DashboardLayout({ children, loading = false, user, logout }) {
  return (
    <div className="dashboard-layout">
      {loading && <OverlayLoader text="Preparing your dashboard..." />}

      <aside className="sidebar">
        <div className="sidebar-logo">Eventify</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
          <NavLink to="/my-events" className="nav-item">My Events</NavLink>

          {/* Only show Create Event for admins */}
          {user?.role === "admin" && (
            <NavLink to="/create-event" className="nav-item">Create Event</NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-danger btn-logout" onClick={logout}>Logout</button>
          <br />
          <span>© 2025</span>
        </div>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}
