// src/components/layout/Dashboard.jsx

import React, { useState, useEffect } from 'react';
// Make sure to import Link
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

import { auth, db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

const templateBackgroundImages = {
    'blank': 'https://placehold.co/600x400/374151/E5E7EB?text=Blank',
    'style-coder-min': 'https://placehold.co/600x400/1f2937/34d399?text=Minimalist+Coder',
    'style-visual-heavy': 'https://placehold.co/600x400/2c3e50/e74c3c?text=Visual+Story',
    'style-corp-sleek': 'https://placehold.co/600x400/1e3a8a/f9fafb?text=Modern+Pro',
    'style-bold-asymm': 'https://placehold.co/600x400/1A1A2E/00F0FF?text=Bold+Innovator',
    'default': 'https://placehold.co/600x400/334155/94a3b8?text=Portfolio'
};

function Dashboard() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!auth.currentUser) return setLoading(false);
      
      setLoading(true);
      try {
        const q = query(
          collection(db, 'portfolios'),
          where('userId', '==', auth.currentUser.uid), 
          orderBy('lastUpdated', 'desc') 
        );

        const querySnapshot = await getDocs(q);
        setPortfolios(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError("Failed to load portfolios.");
        console.error("Error fetching portfolios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []); 

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      setPortfolios(portfolios.filter(p => p.id !== id));
    } catch (err) {
      setError("Could not delete portfolio.");
    }
  };

  const handleEditPortfolio = (portfolio) => {
    if (portfolio.templateId === 'blank') {
      navigate(`/edit-blank/${portfolio.id}`);
    } else {
      alert(`Editing for template "${portfolio.templateId}" is not set up yet.`);
    }
  };

  if (loading) return <div className="dashboard-message">Loading...</div>;
  if (error) return <div className="dashboard-message error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Dashboard</h1>
        <button onClick={() => navigate('/choose-template')} className="add-project-button">
          + Add New Project
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div className="dashboard-empty-state">
          <h3>No portfolios yet</h3>
          <p>Click "Add New Project" to get started!</p>
        </div>
      ) : (
        <div className="portfolios-grid">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="portfolio-card">
              <div className="card-preview-image" style={{ backgroundImage: `url(${templateBackgroundImages[portfolio.templateId] || templateBackgroundImages.default})` }}>
                <span className="card-template-label">Template: {portfolio.templateId}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{portfolio.name || 'Untitled Portfolio'}</h3>
                <p className="card-info">
                  Last updated: {portfolio.lastUpdated ? new Date(portfolio.lastUpdated.seconds * 1000).toLocaleDateString() : 'N/A'}
                </p>
                <div className="card-actions">
                  {/* --- NEW: View button implemented as a Link --- */}
                  <Link to={`/portfolio/${portfolio.id}`} target="_blank" rel="noopener noreferrer" className="card-button-view">
                    View
                  </Link>
                  <button onClick={() => handleEditPortfolio(portfolio)} className="card-button-edit">Edit</button>
                  <button onClick={() => handleDeletePortfolio(portfolio.id)} className="card-button-delete">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;