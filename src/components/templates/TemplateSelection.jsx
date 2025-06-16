// src/components/TemplateSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TemplateSelection.css';

const templates = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    previewImage: 'https://placehold.co/600x400/374151/E5E7EB?text=Blank+Canvas',
    description: 'Start from scratch. Full control over your content, styles, and layout.'
  },
  {
    id: 'style-coder-min',
    name: 'The Minimalist Coder',
    previewImage: 'https://placehold.co/600x400/1f2937/34d399?text=Minimalist+Coder',
    description: 'A clean, technical, and focused template. Ideal for developers.'
  },
  {
    id: 'style-visual-heavy',
    name: 'The Visual Storyteller',
    previewImage: 'https://placehold.co/600x400/2c3e50/e74c3c?text=Visual+Story',
    description: 'Image-centric, perfect for designers, photographers, and artists.'
  },
  {
    id: 'style-corp-sleek',
    name: 'The Modern Professional',
    previewImage: 'https://placehold.co/600x400/1e3a8a/f9fafb?text=Modern+Pro',
    description: 'Structured and clean, designed for consultants and business professionals.'
  },
  {
    id: 'style-bold-asymm',
    name: 'The Bold Innovator',
    previewImage: 'https://placehold.co/600x400/1A1A2E/00F0FF?text=Bold+Innovator',
    description: 'A modern, dynamic, and asymmetrical design for a high-impact portfolio.'
  },
];

function TemplateSelection() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || '');

  const handleTemplateSelect = (templateId) => {
    // This will navigate to the correct editor for the chosen template
    if (templateId === 'blank') {
      navigate('/create-blank-portfolio');
    }
    else if (templateId === 'style-corp-sleek') { // <-- ADD THIS CASE
        navigate(`/create-corp-portfolio/${templateId}`); 
    } else {
      alert(`The editor for the "${templateId}" template is not yet built.`);
      // Example future routes:
      // navigate(`/create-styled-portfolio/${templateId}`);
    }
  };

  return (
    <div className="template-selection-page">
      <div className="template-selection-header">
        <h2>Choose Your Portfolio Template</h2>
        <p>
          Select a template that best fits your style. "Blank Canvas" offers full customization, while styled templates provide a great starting point.
        </p>
      </div>
      <div className="template-grid">
        {templates.map(template => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="template-image-container">
              <img 
                src={template.previewImage} 
                alt={`${template.name} Preview`} 
                className="template-image"
              />
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleTemplateSelect(template.id);
                }}
                className="template-select-button"
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelection;