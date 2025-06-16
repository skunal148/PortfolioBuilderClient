import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { MODERN_PROFESSIONAL_DEFAULTS, modernProfessionalPalettes } from '../../themes';

// Firebase and Firestore imports
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Component and Icon imports
import PortfolioDisplay from '../PortfolioDisplay';
import { DragHandleIcon, TrashIcon } from '../icons/EditorIcons';
import './LiveBlankPortfolioEditor.css'; // Re-using the editor panel styles

// --- Template Specific Data ---
const predefinedColorPalettes = modernProfessionalPalettes; 

const generateStableId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const createNewProject = () => ({ id: generateStableId('project'), title: '', description: '' });

const onDragEnd = (result) => {
        const { source, destination, type } = result;
        if (!destination) return;

        const lists = { SKILLS: skills, PROJECTS: projects, CERTIFICATIONS: certifications };
        const setLists = { SKILLS: setSkills, PROJECTS: setProjects, CERTIFICATIONS: setCertifications };
        
        const list = lists[type];
        const setList = setLists[type];

        if (!list || !setList) return;

        const reorderedList = Array.from(list);
        const [removed] = reorderedList.splice(source.index, 1);
        reorderedList.splice(destination.index, 0, removed);
        setList(reorderedList);
    };

// --- MAIN COMPONENT ---
function LiveModernProfessionalEditor() {
    const { portfolioId } = useParams();
    const navigate = useNavigate();

    // --- State Hooks ---
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [tagline, setTagline] = useState(MODERN_PROFESSIONAL_DEFAULTS.tagline);
    const [aboutMe, setAboutMe] = useState('');
    const [projects, setProjects] = useState([createNewProject()]);

    // Style states initialized with template defaults
    const [fontFamily, setFontFamily] = useState(MODERN_PROFESSIONAL_DEFAULTS.fontFamily);
    const [headingColor, setHeadingColor] = useState(MODERN_PROFESSIONAL_DEFAULTS.headingColor);
    const [bodyTextColor, setBodyTextColor] = useState(MODERN_PROFESSIONAL_DEFAULTS.bodyTextColor);
    const [accentColor, setAccentColor] = useState(MODERN_PROFESSIONAL_DEFAULTS.accentColor);
    const [portfolioBackgroundColor, setPortfolioBackgroundColor] = useState(MODERN_PROFESSIONAL_DEFAULTS.backgroundColor);

    const [loading, setLoading] = useState(false);

    // Handler to apply a full color palette
    const handlePaletteChange = (paletteName) => {
        const selected = predefinedColorPalettes.find(p => p.name === paletteName) || MODERN_PROFESSIONAL_DEFAULTS;
        setHeadingColor(selected.headingColor);
        setBodyTextColor(selected.bodyTextColor);
        setAccentColor(selected.accentColor);
        setPortfolioBackgroundColor(selected.backgroundColor);
    };

    const handleAddProject = () => setProjects(prev => [...prev, createNewProject()]);
    const handleRemoveProject = (id) => setProjects(prev => prev.filter(p => p.id !== id));
    const handleProjectChange = (id, field, value) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    // Handler for saving data
    const handleSavePortfolio = async () => {
        if (!auth.currentUser) return alert("You must be logged in to save.");
        setLoading(true);

        const dataToSave = {
            userId: auth.currentUser.uid,
            templateId: 'style-corp-sleek',
            name, profilePicture, tagline, aboutMe, projects,
            fontFamily, headingColor, bodyTextColor, accentColor, portfolioBackgroundColor,
            lastUpdated: serverTimestamp(),
        };

        try {
            if (portfolioId) {
                await updateDoc(doc(db, 'portfolios', portfolioId), dataToSave);
                alert('Portfolio updated successfully!');
            } else {
                const docRef = await addDoc(collection(db, 'portfolios'), { ...dataToSave, createdAt: serverTimestamp() });
                alert('Portfolio created successfully!');
                navigate(`/edit-corp-portfolio/${docRef.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert('Failed to save portfolio.');
        } finally {
            setLoading(false);
        }
    };

    const portfolioDataForPreview = {
        templateId: 'style-corp-sleek',
        name, profilePicture, tagline, aboutMe, projects,
        fontFamily, headingColor, bodyTextColor, accentColor,
        containerStyle: { fontFamily, backgroundColor: portfolioBackgroundColor }
    };

    // The JSX is very similar to the Blank Editor, just with fewer customization options
    return (
         <DragDropContext onDragEnd={onDragEnd}>
        <div className="editor-container">
            <div className="editor-panel">
                <div className="editor-header"><h2>Edit Modern Professional Portfolio</h2></div>

                <div className="editor-section">
                    <h3 className="section-title">Basic Information</h3>
                    <div className="input-group"><label className="input-label">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="editor-input" /></div>
                    <div className="input-group"><label className="input-label">Title / Tagline</label><input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="editor-input" /></div>
                    <div className="input-group"><label className="input-label">Professional Headshot URL</label><input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} className="editor-input" /></div>
                    <div className="input-group"><label className="input-label">Professional Summary</label><textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} className="editor-textarea" /></div>
                </div>

                <div className="editor-section">
                    <h3 className="section-title">Projects</h3>
                    <Droppable droppableId="projects-list" type="PROJECTS">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {projects.map((project, index) => (
                                    <Draggable key={project.id} draggableId={project.id} index={index}>
                                        {(p) => (
                                            <div className="project-editor-card" ref={p.innerRef} {...p.draggableProps}>
                                                <div className="card-header"><span {...p.dragHandleProps}><DragHandleIcon /></span><h4>{project.title || `Project ${index + 1}`}</h4><button onClick={() => handleRemoveProject(project.id)} className="delete-item-button"><TrashIcon /></button></div>
                                                <div className="input-group"><label className="input-label">Title</label><input type="text" value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} className="editor-input" /></div>
                                                <div className="input-group"><label className="input-label">Description</label><textarea value={project.description} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} className="editor-textarea" /></div>
                                                <div className="input-group"><label className="input-label">Thumbnail URL</label><input type="text" value={project.thumbnailUrl} onChange={(e) => handleProjectChange(project.id, 'thumbnailUrl', e.target.value)} className="editor-input" /></div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <button onClick={handleAddProject} className="add-item-button full-width">Add Project</button>
                </div>

                <div className="editor-section">
                    <h3 className="section-title">Customize Theme</h3>
                    <div className="input-group">
                        <label className="input-label">Font</label>
                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="editor-input">
                            {fontOptions.map(opt => <option key={opt.name} value={opt.value}>{opt.name}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Color Palette</label>
                        <select onChange={(e) => handlePaletteChange(e.target.value)} className="editor-input">
                            {predefinedColorPalettes.map(pal => <option key={pal.name} value={pal.name}>{pal.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="save-button-container">
                    <button onClick={handleSavePortfolio} className="save-button" disabled={loading}>{loading ? 'Saving...' : 'Save Portfolio'}</button>
                </div>
            </div>

            <div className="preview-panel">
                <PortfolioDisplay portfolioData={portfolioDataForPreview} />
            </div>
        </div>
        </DragDropContext>
    );
}

export default LiveModernProfessionalEditor;