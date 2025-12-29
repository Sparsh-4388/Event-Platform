import { useState } from "react";
import { NavLink } from "react-router-dom";
import OverlayLoader from "./Loader";
import "../App.css";

export default function DashboardLayout({ children, loading = false, user, logout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {loading && <OverlayLoader text="Preparing your dashboard..." />}

      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mobile-logo">Eventify</div>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">Eventify</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item" onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/my-events" className="nav-item" onClick={closeSidebar}>
            My Events
          </NavLink>

          {/* Only show Create Event for admins */}
          {user?.role === "admin" && (
            <NavLink to="/create-event" className="nav-item" onClick={closeSidebar}>
              Create Event
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-danger btn-logout" onClick={logout}>
            Logout
          </button>
          <br />
          <span>© 2025</span>
        </div>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}