// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- Firebase Imports ---
import { auth } from './firebase'; // Import auth from your firebase config
import { onAuthStateChanged } from 'firebase/auth';

// --- Component Imports ---
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/layout/LandingPage';
import Dashboard from './components/layout/Dashboard';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import TemplateSelection from './components/templates/TemplateSelection';
import LiveBlankPortfolioEditor from './components/templates/LiveBlankPortfolioEditor';

import './App.css';


const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // This <Outlet> will render the child route's component (e.g., MainLayout)
  return <Outlet />;
};

function App() {
  // State to hold the current user object from Firebase
  const [currentUser, setCurrentUser] = useState(null);
  // State to know if Firebase is still checking for a user
  const [loadingAuth, setLoadingAuth] = useState(true);

  // This hook runs when the App component mounts and listens for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set the user if logged in, or null if logged out
      setLoadingAuth(false); // We're done checking, so stop showing the loading message
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show a loading message while Firebase checks for an active user session
  if (loadingAuth) {
    return <div className="loading-container">Loading Application...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* If a user is logged in, the root path redirects to the dashboard */}
        <Route
          path="/"
          element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" replace />}/>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!currentUser ? <SignUp /> : <Navigate to="/dashboard" replace />} />
        
        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute user={currentUser}/>}>
        <Route element={<MainLayout/>}>
          <Route path="dashboard" element={<Dashboard />} />
            <Route path="choose-template" element={<TemplateSelection />} />
            <Route path="create-blank-portfolio" element={<LiveBlankPortfolioEditor />} />
            <Route path="edit-blank/:portfolioId" element={<LiveBlankPortfolioEditor />} />
        </Route>
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;