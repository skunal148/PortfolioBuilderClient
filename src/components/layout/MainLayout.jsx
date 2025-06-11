// src/components/layout/MainLayout.jsx
import React from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { auth } from '../../firebase'; // Make sure the path is correct
import { signOut } from 'firebase/auth';
import './MainLayout.css'; // Import the CSS

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

const handleLogout = async () => {
    try {
      await signOut(auth); // This signs the user out of Firebase
      navigate('/login'); // Then navigate to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Helper function to check if a nav link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-brand">
            PortfolioBuilder
          </Link>
          <div className="nav-links">
            <Link
              to="/dashboard"
              className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={isActive('/profile') ? 'nav-link active' : 'nav-link'}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Child routes like Dashboard will render here */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;