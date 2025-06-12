// src/components/layout/MainLayout.jsx
import React from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import './MainLayout.css';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current URL

  // --- Check if the current page is an editor page ---
  const isEditorPage = location.pathname.includes('/create-') || location.pathname.includes('/edit-');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">
      <nav className="main-nav">
        {/* Your nav-container and its contents remain the same */}
        <div className="nav-container">
          <Link to="/dashboard" className="nav-brand">PortfolioBuilder</Link>
          <div className="nav-links">
            <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}>Dashboard</Link>
            {/* <Link to="/profile" className={isActive('/profile') ? 'nav-link active' : 'nav-link'}>Profile</Link> */}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </nav>

      {/* Conditionally apply a 'full-width' class for editor pages */}
      <main className={`main-content ${isEditorPage ? 'full-width' : ''}`}>
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;