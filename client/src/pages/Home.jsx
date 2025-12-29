import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Only add mouse move effect on desktop
    const handleMouseMove = (e) => {
      if (window.innerWidth <= 768) return; // Skip on mobile
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;

      const orbs = document.querySelectorAll('.hero-orb');
      
      orbs.forEach((orb, index) => {
        const multipliers = [3, 5, 4, 6];
        const multiplier = multipliers[index] || 3;
        const moveX = (xPercent - 50) * multiplier;
        const moveY = (yPercent - 50) * multiplier;
        orb.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + (index * 0.05)})`;
      });
    };
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-bg-pattern"></div>
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        
        <div className="hero-content">
          <h1>Organize Events. Effortlessly.</h1>
          <p>
            Create, manage, and join events — all from one simple and
            powerful platform.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
        
        <div className="floating-feature floating-feature-1">
          <div className="floating-icon">📅</div>
          <div className="floating-title">Easy Scheduling</div>
          <div className="floating-text">Create events in seconds</div>
        </div>

        <div className="floating-feature floating-feature-2">
          <div className="floating-icon">👥</div>
          <div className="floating-title">Team Collaboration</div>
          <div className="floating-text">Manage attendees seamlessly</div>
        </div>

        <div className="floating-feature floating-feature-3">
          <div className="floating-icon">🔔</div>
          <div className="floating-title">Smart Reminders</div>
          <div className="floating-text">Never miss an event</div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <h3>Create Events</h3>
          <p>Admins can create and manage events in seconds.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h3>Join Instantly</h3>
          <p>Users can join events with real-time availability.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Role Based Access</h3>
          <p>Admin and user roles handled securely.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to host or attend your next event?</h2>
        <Link to="/signup" className="btn btn-success">
          Create your account
        </Link>
      </section>

      <footer className="footer-simple">
        <div className="footer-gradient-line"></div>
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              E
            </div>
            <span className="footer-logo-text">Eventify</span>
          </div>
          <p className="footer-credit">
            Built with 💙 by <span className="creator-name">Sparsh</span>
          </p>

          <div className="footer-socials">
            <a 
              href="https://github.com/Sparsh-4388" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
            </a>

            <a 
              href="https://www.linkedin.com/in/sparsh-pal-7a9684242/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
              </svg>
            </a>
          </div>
          
          <p className="footer-copyright">© 2025 Eventify</p>
        </div>
      </footer>
    </>
  );
}