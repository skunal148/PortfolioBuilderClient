import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Import the CSS

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <div className="landing-content">
        <h1 className="landing-title">
          Craft Your <span className="title-highlight">Stunning</span> Online Portfolio
        </h1>
        <p className="landing-subtitle">
          Showcase your projects, skills, and experience with beautifully designed templates.
        </p>
        <div className="landing-buttons">
          <button onClick={() => navigate('/signup')} className="button-primary">Get Started</button>
          <button onClick={() => navigate('/login')} className="button-secondary">Login</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;