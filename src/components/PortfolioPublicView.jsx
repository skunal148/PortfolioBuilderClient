import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

import PortfolioDisplay from './PortfolioDisplay';
import { blankCanvasPalettes } from '../themes'; // Import the theme data

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
        const docSnap = await getDoc(doc(db, 'portfolios', portfolioId));
        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        } else {
          setError('This portfolio does not exist.');
        }
      } catch (err) {
        setError('Failed to load portfolio data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [portfolioId]);

  // This function correctly calculates the container style based on the loaded data
  const getContainerStyle = () => {
    if (!portfolioData) return {};
    
    let style = { fontFamily: portfolioData.fontFamily };

    if (portfolioData.templateId === 'blank') {
      if (portfolioData.backgroundType === 'customImage' && portfolioData.customBackgroundImageUrl) {
        style.backgroundImage = `url(${portfolioData.customBackgroundImageUrl})`;
      } else {
        const theme = blankCanvasPalettes.find(t => t.id === portfolioData.selectedBackgroundTheme) || blankCanvasPalettes[0];
        Object.assign(style, theme.style);
      }
    } else if (portfolioData.templateId === 'style-corp-sleek') {
        // For non-blank templates, we just use the saved background color
        style.backgroundColor = portfolioData.portfolioBackgroundColor;
    }
    
    return style;
  };

  if (loading) return <div className="loading-container">Loading Portfolio...</div>;
  if (error) return <div className="error-container"><h2>Error</h2><p>{error}</p><Link to="/" className="home-link">Homepage</Link></div>;

  return (
    <div>
      <PortfolioDisplay 
        portfolioData={{
          ...portfolioData, 
          containerStyle: getContainerStyle() // Pass the calculated style object
        }} 
      />
      <footer className="public-footer">
        <Link to="/">Created with PortfolioBuilder</Link>
      </footer>
    </div>
  );
}

export default PortfolioPublicView;
