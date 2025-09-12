// Template content types for the editor

/**
 * @typedef {Object} EditableText
 * @property {string} id - Unique identifier
 * @property {string} content - Text content
 * @property {'heading'|'paragraph'|'button'|'label'} type - Type of text element
 */

/**
 * @typedef {Object} EditableImage  
 * @property {string} id - Unique identifier
 * @property {string} src - Image source URL
 * @property {string} alt - Alt text for accessibility
 */

/**
 * @typedef {Object} EditableColor
 * @property {string} id - Unique identifier
 * @property {string} value - Hex color value
 * @property {string} name - Display name
 * @property {'primary'|'secondary'|'accent'|'background'} type - Color type
 */

/**
 * @typedef {Object} TemplateContent
 * @property {EditableText[]} texts - Array of editable texts
 * @property {EditableImage[]} images - Array of editable images  
 * @property {EditableColor[]} colors - Array of editable colors
 */

/**
 * @typedef {Object} EditableTemplate
 * @property {string} id - Unique identifier
 * @property {string} name - Template name
 * @property {string} description - Template description
 * @property {React.Component} component - React component for the template
 * @property {string} thumbnail - Thumbnail image URL
 * @property {string} color - Template color theme
 * @property {TemplateContent} defaultContent - Default content structure
 */

// Default template content structure
export const createDefaultContent = () => ({
  texts: [],
  images: [],
  colors: []
});

// Helper functions for content manipulation
export const getTextById = (content, id) => 
  content.texts.find(t => t.id === id)?.content || '';

export const getImageById = (content, id) => 
  content.images.find(i => i.id === id)?.src || '';

export const getColorById = (content, id) => 
  content.colors.find(c => c.id === id)?.value || '';

// Template content validators
export const validateTemplateContent = (content) => {
  if (!content || typeof content !== 'object') {
    return false;
  }
  
  const hasValidArrays = 
    Array.isArray(content.texts) &&
    Array.isArray(content.images) &&
    Array.isArray(content.colors);
    
  return hasValidArrays;
};