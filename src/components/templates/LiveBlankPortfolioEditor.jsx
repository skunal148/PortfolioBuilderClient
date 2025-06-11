// src/templates/LiveBlankPortfolioEditor.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';

import PortfolioDisplay from '../PortfolioDisplay';
import { DragHandleIcon, TrashIcon } from '../icons/EditorIcons';// Import new icons
import './LiveBlankPortfolioEditor.css';

// We will add Firebase logic back in a later step
// For now, let's focus on UI and state management

const generateStableId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper functions to create new items
const createNewProject = () => ({ id: generateStableId('project'), title: '', description: '', thumbnailUrl: '' });
const createNewSkill = () => ({ id: generateStableId('skill'), name: '', level: 'Intermediate' });

function LiveBlankPortfolioEditor() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  // --- State Hooks ---
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [projects, setProjects] = useState([createNewProject()]);
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const fontOptions = [
    { name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'monospace' },
];
const headerLayoutOptions = [
    { id: 'image-top-center', name: 'Image Top, Text Centered' },
    { id: 'image-left-text-right', name: 'Image Left, Text Right' },
];
const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
const [headingColor, setHeadingColor] = useState('#f1f5f9');
const [bodyTextColor, setBodyTextColor] = useState('#cbd5e1');
const [accentColor, setAccentColor] = useState('#34d399');
const [secondaryAccentColor, setSecondaryAccentColor] = useState('#e11d48');
const [headerLayout, setHeaderLayout] = useState(headerLayoutOptions[0].id);


const predefinedBackgroundThemes = [
  { id: 'blank-default', name: 'Default Dark', style: { backgroundColor: '#1e293b' }, headingColor: '#E5E7EB', bodyTextColor: '#D1D5DB', accentColor: '#34D399' },
  { id: 'light-gentle', name: 'Gentle Light', style: { backgroundColor: '#F3F4F6' }, headingColor: '#1F2937', bodyTextColor: '#374151', accentColor: '#3B82F6' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', style: { backgroundImage: 'linear-gradient(to top right, #00c6ff, #0072ff)' }, headingColor: '#FFFFFF', bodyTextColor: '#E0F2FE', accentColor: '#FDE047' },
];

const createNewCertification = () => ({ id: generateStableId('certification'), title: '', issuingBody: '', dateIssued: '' });

// --- New State Variables ---
const [certifications, setCertifications] = useState([]);
const [backgroundType, setBackgroundType] = useState('theme');
const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState(predefinedBackgroundThemes[0].id);
const [customBackgroundImageUrl, setCustomBackgroundImageUrl] = useState('');

  // --- Handler Functions for Dynamic Lists ---
// --- Handlers for theme changes ---
    const handleColorChange = (setter, event) => {
        setter(event.target.value);
    };
  // SKILLS
  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      setSkills(prev => [...prev, { id: generateStableId('skill'), name: newSkillName.trim(), level: newSkillLevel }]);
      setNewSkillName('');
      setNewSkillLevel('Intermediate');
    }
  };
  const handleRemoveSkill = (idToRemove) => setSkills(prev => prev.filter(skill => skill.id !== idToRemove));

  // PROJECTS
  const handleAddProject = () => setProjects(prev => [...prev, createNewProject()]);
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };
  const handleRemoveProject = (idToRemove) => setProjects(prev => prev.filter(p => p.id !== idToRemove));
  
  // DRAG AND DROP
  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    const getList = (listType) => listType === 'SKILLS' ? skills : projects;
    const setList = (listType, newList) => listType === 'SKILLS' ? setSkills(newList) : setProjects(newList);

    const list = getList(type);
    const reorderedList = Array.from(list);
    const [removed] = reorderedList.splice(source.index, 1);
    reorderedList.splice(destination.index, 0, removed);
    setList(type, reorderedList);
  };
  
  // Combine data for preview
  const portfolioDataForPreview = {
    name, profilePicture, linkedinUrl, githubUrl, aboutMe, resumeUrl, projects, skills,
    // Default theme for preview
    fontFamily,
  headingColor,
  bodyTextColor,
  accentColor,
  secondaryAccentColor,
  headerLayout,
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="editor-container">
        {/* Left side: The Form */}
        <div className="editor-panel">
          <div className="editor-header">
            <h2>{portfolioId ? 'Edit Your Portfolio' : 'Create Blank Portfolio'}</h2>
          </div>

          {/* --- Basic Information Section --- */}
          <div className="editor-section">
            <h3 className="section-title">Basic Information</h3>
            {/* ... Your existing basic info input groups ... */}
             <div className="input-group">
                <label htmlFor="name" className="input-label">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="editor-input" placeholder="Your Full Name" />
            </div>
            <div className="input-group">
                <label htmlFor="profilePicture" className="input-label">Profile Picture URL</label>
                <input type="text" id="profilePicture" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} className="editor-input" placeholder="https://example.com/your-image.jpg" />
            </div>
            
           <div className="input-group">
            <label htmlFor="linkedinUrl" className="input-label">LinkedIn URL</label>
            <input type="url" id="linkedinUrl" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="editor-input" placeholder="https://linkedin.com/in/yourprofile"/>
          </div>
          <div className="input-group">
            <label htmlFor="githubUrl" className="input-label">GitHub URL</label>
            <input type="url" id="githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="editor-input" placeholder="https://github.com/yourusername"/>
          </div>
          <div className="input-group">
            <label htmlFor="aboutMe" className="input-label">About Me</label>
            <textarea id="aboutMe" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} className="editor-textarea" placeholder="Tell a bit about yourself..."></textarea>
          </div>
          </div>

          {/* --- Skills Section --- */}
          <div className="editor-section">
            <h3 className="section-title">Skills</h3>
            <div className="add-item-form">
              <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Skill name (e.g., React)" className="editor-input" />
              <select value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} className="editor-input">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
              <button onClick={handleAddSkill} className="add-item-button">Add Skill</button>
            </div>
            <Droppable droppableId="skills-list" type="SKILLS">
              {(provided) => (
                <ul className="draggable-list" {...provided.droppableProps} ref={provided.innerRef}>
                  <AnimatePresence>
                    {skills.map((skill, index) => (
                      <Draggable key={skill.id} draggableId={skill.id} index={index}>
                        {(providedItem) => (
                          <motion.li
                            className="draggable-item"
                            ref={providedItem.innerRef}
                            {...providedItem.draggableProps}
                            {...providedItem.dragHandleProps}
                            layout
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <DragHandleIcon />
                            <span>{skill.name} ({skill.level})</span>
                            <button onClick={() => handleRemoveSkill(skill.id)} className="delete-item-button"><TrashIcon /></button>
                          </motion.li>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>

          {/* --- Projects Section --- */}
          <div className="editor-section">
            <h3 className="section-title">Projects</h3>
            <Droppable droppableId="projects-list" type="PROJECTS">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <AnimatePresence>
                    {projects.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(providedItem) => (
                          <motion.div
                            className="project-editor-card"
                            ref={providedItem.innerRef}
                            {...providedItem.draggableProps}
                             layout
                             initial={{ opacity: 0, y: -20 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <div className="card-header">
                              <span {...providedItem.dragHandleProps}><DragHandleIcon /></span>
                              <h4>{project.title || `Project ${index + 1}`}</h4>
                              <button onClick={() => handleRemoveProject(project.id)} className="delete-item-button"><TrashIcon /></button>
                            </div>
                            <div className="input-group">
                              <label className="input-label">Title</label>
                              <input type="text" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} className="editor-input"/>
                            </div>
                            <div className="input-group">
                              <label className="input-label">Description</label>
                              <textarea value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} className="editor-textarea"/>
                            </div>
                             <div className="input-group">
                              <label className="input-label">Thumbnail URL</label>
                              <input type="text" value={project.thumbnailUrl} onChange={(e) => handleProjectChange(index, 'thumbnailUrl', e.target.value)} className="editor-input"/>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <button onClick={handleAddProject} className="add-item-button full-width">Add Another Project</button>
          </div>

                  <div className="editor-section">
        <h3 className="section-title">Customize Styles & Layout</h3>
        
        <div className="input-group">
            <label htmlFor="fontFamily" className="input-label">Font Family</label>
            <select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="editor-input">
            {fontOptions.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
            ))}
            </select>
        </div>
        
        <div className="input-group">
            <label htmlFor="headerLayout" className="input-label">Header Layout</label>
            <select id="headerLayout" value={headerLayout} onChange={(e) => setHeaderLayout(e.target.value)} className="editor-input">
            {headerLayoutOptions.map(layout => (
                <option key={layout.id} value={layout.id}>{layout.name}</option>
            ))}
            </select>
        </div>
        
        <div className="color-picker-grid">
            <div className="input-group">
            <label htmlFor="headingColor" className="input-label">Heading Color</label>
            <input type="color" id="headingColor" value={headingColor} onChange={(e) => handleColorChange(setHeadingColor, e)} className="color-picker-input" />
            </div>
            <div className="input-group">
            <label htmlFor="bodyTextColor" className="input-label">Body Text Color</label>
            <input type="color" id="bodyTextColor" value={bodyTextColor} onChange={(e) => handleColorChange(setBodyTextColor, e)} className="color-picker-input" />
            </div>
            <div className="input-group">
            <label htmlFor="accentColor" className="input-label">Primary Accent</label>
            <input type="color" id="accentColor" value={accentColor} onChange={(e) => handleColorChange(setAccentColor, e)} className="color-picker-input" />
            </div>
            <div className="input-group">
            <label htmlFor="secondaryAccentColor" className="input-label">Secondary Accent</label>
            <input type="color" id="secondaryAccentColor" value={secondaryAccentColor} onChange={(e) => handleColorChange(setSecondaryAccentColor, e)} className="color-picker-input" />
            </div>
        </div>
        </div>

          <div className="save-button-container">
            <button className="save-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save Portfolio'}
            </button>
          </div>
        </div>



        {/* Right side: The Live Preview */}
        <div className="preview-panel">
          <PortfolioDisplay portfolioData={portfolioDataForPreview} />
        </div>
      </div>
    </DragDropContext>
  );
}

export default LiveBlankPortfolioEditor;