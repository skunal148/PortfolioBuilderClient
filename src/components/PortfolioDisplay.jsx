// src/components/PortfolioDisplay.jsx
import React from 'react';
import './PortfolioDisplay.css'; // Import the new CSS

// --- Helper Components & Icons ---

// A simple icon for social links
const SocialIcon = ({ url, children }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="social-icon">
    {children}
  </a>
);

// Placeholder icons (can be replaced with actual SVGs later)
const LinkedInIcon = () => <svg /* ...your svg... */ />;
const GitHubIcon = () => <svg /* ...your svg... */ />;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="download-icon"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


// --- Main Display Component ---

function PortfolioDisplay({ portfolioData }) {
  if (!portfolioData) {
    return <div className="portfolio-loading">Loading Preview...</div>;
  }

  // Destructure all potential props from the portfolio data
 const {
    name, profilePicture, tagline, aboutMe, projects = [], skills = [],
    headingColor, bodyTextColor, accentColor, headerLayout, linkedinUrl,githubUrl,resumeUrl,certifications,
    containerStyle // This object is now passed directly from the editor
  } = portfolioData;


  const sectionMargin = '4rem'; // Consistent spacing between sections

  // --- RENDER FUNCTIONS FOR EACH SECTION ---

    const renderHeader = () => {
    const socialLinks = (
      <div className="social-links">
        {linkedinUrl && <SocialIcon url={linkedinUrl} color={accentColor}><LinkedInIcon /></SocialIcon>}
        {githubUrl && <SocialIcon url={githubUrl} color={accentColor}><GitHubIcon /></SocialIcon>}
      </div>
    );

    const resumeLink = resumeUrl && (
      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download className="resume-download-link" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
        <DownloadIcon />
        Download Resume
      </a>
    );

    return (
      <header className={`portfolio-header layout-${headerLayout}`} style={{ borderColor: accentColor }}>
        {profilePicture && (
          <img src={profilePicture} alt={name || 'Profile'} className="profile-picture" style={{ borderColor: accentColor }}/>
        )}
        <div className="header-info">
          <h1 className="portfolio-name" style={{ color: headingColor }}>{name}</h1>
          {tagline && <p className="portfolio-tagline" style={{ color: bodyTextColor }}>{tagline}</p>}
          {socialLinks}
          {resumeLink}
        </div>
      </header>
    );
  };

  const renderAboutMe = () => aboutMe && (
    <section style={{ marginBottom: sectionMargin }}>
      <h2 className="section-heading" style={{ color: headingColor }}>About Me</h2>
      <div className="prose-styles" style={{ color: bodyTextColor }} dangerouslySetInnerHTML={{ __html: aboutMe }} />
    </section>
  );

  const renderSkills = () => skills && skills.length > 0 && (
    <section style={{ marginBottom: sectionMargin }}>
        <h2 className="section-heading" style={{color: headingColor}}>Skills</h2>
        <div className="skills-list">
            {skills.map((skill, index) => (
                <div key={index} className="skill-chip" style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}` }}>
                    <span style={{ color: accentColor }}>{skill.name}</span>
                </div>
            ))}
        </div>
    </section>
  );

  const renderProjects = () => projects && projects.length > 0 && (
     <section style={{ marginBottom: sectionMargin }}>
        <h2 className="section-heading" style={{color: headingColor}}>Projects</h2>
        <div className="projects-grid">
            {projects.map((project) => (project.title || project.description) && (
                <div key={project.id} className="project-card">
                    {project.thumbnailUrl && <img src={project.thumbnailUrl} alt={`${project.title} preview`} className="project-thumbnail" />}
                    <div className="project-content">
                        <h3 className="project-title" style={{ color: headingColor }}>{project.title}</h3>
                        <div className="prose-styles" style={{ color: bodyTextColor }} dangerouslySetInnerHTML={{ __html: project.description }}></div>
                        <div className="project-links">
                            {project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="project-link primary" style={{ backgroundColor: accentColor }}>Live Demo</a>}
                            {project.sourceCodeUrl && <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="project-link secondary" style={{ borderColor: accentColor, color: accentColor }}>Source Code</a>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );

  const renderCertifications = () => certifications && certifications.length > 0 && (
    <section style={{ marginBottom: sectionMargin }}>
      <h2 className="section-heading" style={{ color: headingColor }}>Certifications</h2>
      <div className="certifications-list">
        {certifications.map((cert) => (cert.title || cert.issuingBody) && (
          <div key={cert.id} className="certification-item" style={{ borderLeftColor: accentColor }}>
            <h3 className="certification-title" style={{ color: headingColor }}>{cert.title}</h3>
            <p className="certification-issuer" style={{ color: bodyTextColor }}>{cert.issuingBody}</p>
            <p className="certification-date" style={{ color: bodyTextColor, opacity: 0.7 }}>{cert.dateIssued}</p>
          </div>
        ))}
      </div>
    </section>
  );
  // Render functions for Certifications and Custom Sections would follow the same pattern...

  return (
    <div className="portfolio-container" style={containerStyle}>
      <div className="portfolio-body">
        {renderHeader()}
        {renderAboutMe()}
        {renderSkills()}
        {renderProjects()}
        {renderCertifications()} 
        {/* Render other sections here */}
      </div>
    </div>
  );
}

export default PortfolioDisplay;