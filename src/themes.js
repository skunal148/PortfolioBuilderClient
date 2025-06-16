// This file is the single source of truth for all template and theme data.

// --- PALETTES ---
export const modernProfessionalPalettes = [
    { 
        name: 'Black & Almond', 
        backgroundColor: '#FFFFFF',
        headingColor: '#000000',
        bodyTextColor: '#2A2522',
        accentColor: '#000000' 
    },
    { 
        name: 'Blue & Gray Corporate', 
        backgroundColor: '#F9FAFB',
        headingColor: '#1E40AF', 
        bodyTextColor: '#4B5563', 
        accentColor: '#10B981'
    },
];

export const blankCanvasPalettes = [
    { id: 'blank-default', name: 'Default Dark', style: { backgroundColor: '#1e293b' }, headingColor: '#E5E7EB', bodyTextColor: '#D1D5DB', accentColor: '#34D399' },
    { id: 'light-gentle', name: 'Gentle Light', style: { backgroundColor: '#F3F4F6' }, headingColor: '#1F2937', bodyTextColor: '#374151', accentColor: '#3B82F6' },
    { id: 'ocean-breeze', name: 'Ocean Breeze', style: { backgroundImage: 'linear-gradient(to top right, #00c6ff, #0072ff)' }, headingColor: '#FFFFFF', bodyTextColor: '#E0F2FE', accentColor: '#FDE047' },
];

// --- TEMPLATE DEFAULTS ---
export const MODERN_PROFESSIONAL_DEFAULTS = {
    fontFamily: "'Open Sans', sans-serif",
    tagline: 'Dedicated Professional | Results-Oriented',
    ...modernProfessionalPalettes[0] // Default to the first palette in the list
};

export const BLANK_CANVAS_DEFAULTS = {
    fontFamily: "'Inter', sans-serif",
    tagline: 'Welcome to my portfolio',
    // Uses the predefined themes, not a single default color set
};

// You can add defaults for other templates here later
