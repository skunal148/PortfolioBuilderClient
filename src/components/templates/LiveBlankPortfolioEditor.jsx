import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase and Firestore imports
import { auth, db } from '../../firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Component and Icon imports
import PortfolioDisplay from '../PortfolioDisplay';
import { DragHandleIcon, TrashIcon } from '../icons/EditorIcons';
import './LiveBlankPortfolioEditor.css';

// --- Static Data (defined outside the component for performance) ---

const generateStableId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const createNewProject = () => ({ id: generateStableId('project'), title: '', description: '', thumbnailUrl: '', liveDemoUrl: '', sourceCodeUrl: '' });
const createNewCertification = () => ({ id: generateStableId('certification'), title: '', issuingBody: '', dateIssued: '' });

const fontOptions = [
    { name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Monospace', value: 'monospace' },
];
const headerLayoutOptions = [
    { id: 'image-top-center', name: 'Image Top, Text Centered' },
    { id: 'image-left-text-right', name: 'Image Left, Text Right' },
];
const predefinedBackgroundThemes = [
    { id: 'blank-default', name: 'Default Dark', style: { backgroundColor: '#1e293b' }, headingColor: '#E5E7EB', bodyTextColor: '#D1D5DB', accentColor: '#34D399' },
    { id: 'light-gentle', name: 'Gentle Light', style: { backgroundColor: '#F3F4F6' }, headingColor: '#1F2937', bodyTextColor: '#374151', accentColor: '#3B82F6' },
    { id: 'ocean-breeze', name: 'Ocean Breeze', style: { backgroundImage: 'linear-gradient(to top right, #00c6ff, #0072ff)' }, headingColor: '#FFFFFF', bodyTextColor: '#E0F2FE', accentColor: '#FDE047' },
];


// --- MAIN COMPONENT ---
function LiveBlankPortfolioEditor() {
    const { portfolioId } = useParams();
    const navigate = useNavigate();

    // --- State Hooks for all portfolio data and settings ---
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [tagline, setTagline] = useState('');
    
    const [projects, setProjects] = useState([createNewProject()]);
    const [skills, setSkills] = useState([]);
    const [certifications, setCertifications] = useState([]);

    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
    
    const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
    const [headingColor, setHeadingColor] = useState('#f1f5f9');
    const [bodyTextColor, setBodyTextColor] = useState('#cbd5e1');
    const [accentColor, setAccentColor] = useState('#34d399');
    const [secondaryAccentColor, setSecondaryAccentColor] = useState('#e11d48');
    const [headerLayout, setHeaderLayout] = useState(headerLayoutOptions[0].id);

    const [backgroundType, setBackgroundType] = useState('theme');
    const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState(predefinedBackgroundThemes[0].id);
    const [customBackgroundImageUrl, setCustomBackgroundImageUrl] = useState('');
    
    const [loading, setLoading] = useState(true);

    // --- Effect to load existing data if editing ---
    useEffect(() => {
        const loadPortfolioData = async () => {
            if (!portfolioId) {
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'portfolios', portfolioId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Load all data into state
                    setName(data.name || '');
                    setProfilePicture(data.profilePicture || '');
                    setTagline(data.tagline || '');
                    setLinkedinUrl(data.linkedinUrl || '');
                    setGithubUrl(data.githubUrl || '');
                    setAboutMe(data.aboutMe || '');
                    setResumeUrl(data.resumeUrl || '');

                    setProjects(data.projects?.length ? data.projects : [createNewProject()]);
                    setSkills(data.skills || []);
                    setCertifications(data.certifications || []);

                    // Load style settings
                    setFontFamily(data.fontFamily || fontOptions[0].value);
                    setHeadingColor(data.headingColor || '#f1f5f9');
                    setBodyTextColor(data.bodyTextColor || '#cbd5e1');
                    setAccentColor(data.accentColor || '#34d399');
                    setSecondaryAccentColor(data.secondaryAccentColor || '#e11d48');
                    setHeaderLayout(data.headerLayout || headerLayoutOptions[0].id);
                    setBackgroundType(data.backgroundType || 'theme');
                    setSelectedBackgroundTheme(data.selectedBackgroundTheme || predefinedBackgroundThemes[0].id);
                    setCustomBackgroundImageUrl(data.customBackgroundImageUrl || '');
                } else {
                    console.error("No such portfolio found!");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error loading portfolio:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPortfolioData();
    }, [portfolioId, navigate]);

    // --- Handler Functions ---
    const handleAddSkill = () => {
        if (newSkillName.trim()) {
            setSkills(prev => [...prev, { id: generateStableId('skill'), name: newSkillName.trim(), level: newSkillLevel }]);
            setNewSkillName('');
        }
    };
    const handleRemoveSkill = (id) => setSkills(prev => prev.filter(s => s.id !== id));

    const handleAddProject = () => setProjects(prev => [...prev, createNewProject()]);
    const handleRemoveProject = (id) => setProjects(prev => prev.filter(p => p.id !== id));
    const handleProjectChange = (id, field, value) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleAddCertification = () => setCertifications(prev => [...prev, createNewCertification()]);
    const handleRemoveCertification = (id) => setCertifications(prev => prev.filter(c => c.id !== id));
    const handleCertificationChange = (id, field, value) => {
        setCertifications(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleBackgroundThemeChange = (themeId) => {
        setSelectedBackgroundTheme(themeId);
        const theme = predefinedBackgroundThemes.find(t => t.id === themeId);
        if (theme) {
            setHeadingColor(theme.headingColor);
            setBodyTextColor(theme.bodyTextColor);
            setAccentColor(theme.accentColor);
            setCustomBackgroundImageUrl('');
        }
    };

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

    const getContainerStyle = () => {
        let style = { fontFamily };
        if (backgroundType === 'customImage' && customBackgroundImageUrl) {
            style.backgroundImage = `url(${customBackgroundImageUrl})`;
        } else {
            const theme = predefinedBackgroundThemes.find(t => t.id === selectedBackgroundTheme) || predefinedBackgroundThemes[0];
            Object.assign(style, theme.style);
        }
        return style;
    };

    const handleSavePortfolio = async () => {
        if (!auth.currentUser) return alert("You must be logged in to save.");
        setLoading(true);

        const dataToSave = {
            userId: auth.currentUser.uid, templateId: 'blank',
            name, profilePicture, tagline, linkedinUrl, githubUrl, aboutMe, resumeUrl,
            projects, skills, certifications,
            fontFamily, headingColor, bodyTextColor, accentColor, secondaryAccentColor, headerLayout,
            backgroundType, selectedBackgroundTheme, customBackgroundImageUrl,
            lastUpdated: serverTimestamp(),
        };

        try {
            if (portfolioId) {
                await updateDoc(doc(db, 'portfolios', portfolioId), dataToSave);
                alert('Portfolio updated successfully!');
            } else {
                const docRef = await addDoc(collection(db, 'portfolios'), { ...dataToSave, createdAt: serverTimestamp() });
                alert('Portfolio created successfully!');
                navigate(`/edit-blank/${docRef.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert('Failed to save portfolio.');
        } finally {
            setLoading(false);
        }
    };

    const portfolioDataForPreview = {
        name, profilePicture, tagline, aboutMe, projects, skills, certifications,
        fontFamily, headingColor, bodyTextColor, accentColor, headerLayout,
        containerStyle: getContainerStyle(), resumeUrl
    };

    if (loading && portfolioId) {
        return <div className="loading-container">Loading portfolio...</div>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="editor-container">
                <div className="editor-panel">
                    <div className="editor-header">
                        <h2>{portfolioId ? 'Edit Your Portfolio' : 'Create Blank Portfolio'}</h2>
                    </div>

                    <div className="editor-section">
                      <h3 className="section-title">Basic Information</h3>
                      <div className="input-group"><label className="input-label">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="editor-input" /></div>
                      <div className="input-group"><label className="input-label">Tagline</label><input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="editor-input" /></div>
                      <div className="input-group"><label className="input-label">Profile Picture URL</label><input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} className="editor-input" /></div>
                      <div className="input-group"><label className="input-label">LinkedIn URL</label><input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="editor-input" /></div>
                      <div className="input-group"><label className="input-label">GitHub URL</label><input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="editor-input" /></div>
                      <div className="input-group"><label className="input-label">About Me</label><textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} className="editor-textarea"></textarea></div>
                    </div>

                    <div className="editor-section">
                        <h3 className="section-title">Skills</h3>
                        <div className="add-item-form">
                            <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Skill name (e.g., React)" className="editor-input" />
                            <select value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} className="editor-input">
                                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
                            </select>
                            <button onClick={handleAddSkill} className="add-item-button">Add</button>
                        </div>
                        <Droppable droppableId="skills-list" type="SKILLS">
                            {(provided) => (
                                <ul className="draggable-list" {...provided.droppableProps} ref={provided.innerRef}>
                                    <AnimatePresence>
                                        {skills.map((skill, index) => (
                                            <Draggable key={skill.id} draggableId={skill.id} index={index}>
                                                {(p) => (
                                                    <motion.li className="draggable-item" ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} layout initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
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
                                                    <div className="input-group"><label className="input-label">Title</label><input type="text" value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} className="editor-input"/></div>
                                                    <div className="input-group"><label className="input-label">Description</label><textarea value={project.description} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} className="editor-textarea"/></div>
                                                    <div className="input-group"><label className="input-label">Thumbnail URL</label><input type="text" value={project.thumbnailUrl} onChange={(e) => handleProjectChange(project.id, 'thumbnailUrl', e.target.value)} className="editor-input"/></div>
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
                        <h3 className="section-title">Certifications</h3>
                        <Droppable droppableId="certifications-list" type="CERTIFICATIONS">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {certifications.map((cert, index) => (
                                        <Draggable key={cert.id} draggableId={cert.id} index={index}>
                                            {(p) => (
                                                <div className="project-editor-card" ref={p.innerRef} {...p.draggableProps}>
                                                    <div className="card-header"><span {...p.dragHandleProps}><DragHandleIcon /></span><h4>{cert.title || `Certification ${index + 1}`}</h4><button onClick={() => handleRemoveCertification(cert.id)} className="delete-item-button"><TrashIcon /></button></div>
                                                    <div className="input-group"><label className="input-label">Certification</label><input type="text" value={cert.title} onChange={(e) => handleCertificationChange(cert.id, 'title', e.target.value)} className="editor-input"/></div>
                                                    <div className="input-group"><label className="input-label">Issuing Body</label><input type="text" value={cert.issuingBody} onChange={(e) => handleCertificationChange(cert.id, 'issuingBody', e.target.value)} className="editor-input"/></div>
                                                    <div className="input-group"><label className="input-label">Date Issued</label><input type="text" value={cert.dateIssued} onChange={(e) => handleCertificationChange(cert.id, 'dateIssued', e.target.value)} className="editor-input"/></div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <button onClick={handleAddCertification} className="add-item-button full-width">Add Certification</button>
                    </div>

                    <div className="editor-section">
                        <h3 className="section-title">Customize Styles & Layout</h3>
                        <div className="input-group">
                            <label className="input-label">Background</label>
                            <div className="radio-group">
                                <label><input type="radio" value="theme" checked={backgroundType === 'theme'} onChange={() => setBackgroundType('theme')} /> Theme</label>
                                <label><input type="radio" value="customImage" checked={backgroundType === 'customImage'} onChange={() => setBackgroundType('customImage')} /> Custom Image</label>
                            </div>
                        </div>
                        {backgroundType === 'theme' ? (
                            <div className="input-group">
                                <label className="input-label">Theme</label>
                                <select value={selectedBackgroundTheme} onChange={(e) => handleBackgroundThemeChange(e.target.value)} className="editor-input">
                                    {predefinedBackgroundThemes.map(theme => (<option key={theme.id} value={theme.id}>{theme.name}</option>))}
                                </select>
                            </div>
                        ) : (
                            <div className="input-group">
                                <label className="input-label">Background Image URL</label>
                                <input type="text" value={customBackgroundImageUrl} onChange={(e) => setCustomBackgroundImageUrl(e.target.value)} className="editor-input" placeholder="https://..." />
                            </div>
                        )}
                        <div className="input-group"><label className="input-label">Font Family</label><select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="editor-input">{fontOptions.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}</select></div>
                        <div className="input-group"><label className="input-label">Header Layout</label><select value={headerLayout} onChange={(e) => setHeaderLayout(e.target.value)} className="editor-input">{headerLayoutOptions.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                        <div className="color-picker-grid">
                            <div className="input-group"><label className="input-label">Headings</label><input type="color" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} className="color-picker-input" /></div>
                            <div className="input-group"><label className="input-label">Body Text</label><input type="color" value={bodyTextColor} onChange={(e) => setBodyTextColor(e.target.value)} className="color-picker-input" /></div>
                            <div className="input-group"><label className="input-label">Primary Accent</label><input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="color-picker-input" /></div>
                            <div className="input-group"><label className="input-label">Secondary Accent</label><input type="color" value={secondaryAccentColor} onChange={(e) => setSecondaryAccentColor(e.target.value)} className="color-picker-input" /></div>
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

export default LiveBlankPortfolioEditor;
