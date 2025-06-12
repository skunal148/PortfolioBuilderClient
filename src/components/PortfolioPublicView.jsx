// src/components/PortfolioPublicView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Firebase imports
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// We can reuse the PortfolioDisplay component for the actual rendering
import PortfolioDisplay from './PortfolioDisplay';

function PortfolioPublicView() {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!portfolioId) {
        setError("Portfolio ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const portfolioRef = doc(db, 'portfolios', portfolioId);
        const docSnap = await getDoc(portfolioRef);

        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        } else {
          setError('This portfolio does not exist.');
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError('Failed to load portfolio data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  if (loading) {
    return <div className="loading-container">Loading Portfolio...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="home-link">Go to Homepage</Link>
      </div>
    );
  }

  // We reuse the PortfolioDisplay to show the data.
  // We need to pass the containerStyle that the editor would normally calculate.
  // For simplicity, we'll calculate it here based on the loaded data.
  const getContainerStyle = () => {
    let style = { fontFamily: portfolioData.fontFamily || 'sans-serif' };
    if (portfolioData.backgroundType === 'customImage' && portfolioData.customBackgroundImageUrl) {
      style.backgroundImage = `url(${portfolioData.customBackgroundImageUrl})`;
    } else {
        // This is a simplified version of the theme logic from the editor
        style.backgroundColor = '#1e293b'; // Default dark background
        if (portfolioData.selectedBackgroundTheme === 'light-gentle') {
            style.backgroundColor = '#F3F4F6';
        }
    }
    return style;
  };

  return (
    <div>
        <PortfolioDisplay portfolioData={{...portfolioData, containerStyle: getContainerStyle()}} />
        <footer className="public-footer">
            <Link to="/">Created with PortfolioBuilder</Link>
        </footer>
    </div>
  );
}

export default PortfolioPublicView;