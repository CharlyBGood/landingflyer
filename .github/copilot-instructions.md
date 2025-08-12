- **Never apply styles directly via the `style` attribute in JSX/HTML. Always use Tailwind CSS classes if available, or otherwise use the appropriate CSS file.**
# Copilot Instructions for LandingFlyer

## Project Overview
LandingFlyer is a full-stack AI-powered landing page generator. It consists of a Node.js/Express backend (with Google VertexAI integration) and a React/Vite/Tailwind frontend. The backend orchestrates prompt engineering and HTML/CSS generation, while the frontend provides a visual editor for real-time landing page customization.

## Key Architectural Details
- **Backend**: Node.js 20, Express 5.1.0, Google VertexAI (Gemini 2.0 Flash), Multer, CORS, dotenv, Docker, Google Cloud Run, Service Account authentication.
- **Frontend**: React 19.1.0, Vite 7.0.4, Tailwind CSS 4.1.11, React Router DOM 7.7.1, Axios, localStorage for persistence.
- **AI Integration**: The backend uses `prompt.md` to guide a 3-phase prompt process, generating HTML with a `:root` CSS block containing theme variables.
- **Editor**: The main editor (`frontend/src/components/Editor.jsx`) allows WYSIWYG editing, color theming via CSS variables, and background image controls. All color pickers are mapped to a fixed set of common CSS variable names (e.g., `--primary`, `--secondary`, `--accent`, etc.).
- **Deployment**: NetlifyZipService implements the official ZIP Method for atomic deployments with HTML validation, content-type fixes, and company name-based URL generation.
- **Development Environment**: Windows PowerShell with specific command syntax requirements (`;` for command chaining, proper background process handling).

## Developer Workflow
- **Local Development**: Run backend and frontend separately using npm scripts. Backend runs on Node.js, frontend on Vite dev server.
  - **Windows PowerShell**: Use `;` for command chaining (e.g., `cd backend; npm start`). Check if servers are running before starting (`netstat -ano | findstr :3001`).
  - **Server Verification**: Always verify that servers aren't already running to avoid port conflicts.
- **Deployment**: Backend is containerized with Docker and deployed to Google Cloud Run. Frontend is deployed to Netlify or Vercel.
  - **NetlifyZipService**: Uses official ZIP Method for atomic deployments (<30 seconds vs >5 minutes with CLI).
  - **HTML Validation**: Automatic HTML structure validation and content-type fixing via `_headers` file.
- **AI Prompting**: All prompt logic is in `backend/prompt.md`. The backend injects prompt results into `backend/page_template.html`.
- **Frontend Editing**: The editor updates CSS variables directly in the DOM and in the embedded `<style>` block. No color logic is hardcoded; only variable names are referenced.
  - **Publishing Cleanup**: HTML is cleaned before publishing to remove `contentEditable` attributes and editing elements via `DOMUtils.cleanAllEditingElements()`.

## Project Conventions
- **Mobile-first, modern CSS**: All generated HTML/CSS must be responsive and use semantic HTML5.
- **No hardcoded color values in frontend logic**: Only reference CSS variables (e.g., `--primary`).
- **All editability and theming via CSS variables**: The editor must not manipulate inline styles or static color values.
- **No interference with text editing or background image controls**: Color pickers and other controls must not disrupt contentEditable regions.
- **AI-generated HTML must include a `:root` block with all theme variables**.

## Key Files
- `backend/server.js`: Express API, prompt orchestration, HTML/CSS injection.
- `backend/prompt.md`: AI prompt logic and workflow.
- `backend/page_template.html`: HTML/CSS template for AI output.
- `backend/services/NetlifyZipService.js`: Official ZIP Method deployment with HTML validation and content-type fixes.
- `frontend/src/components/Editor.jsx`: Main visual editor, color pickers, and editing logic.
- `frontend/src/utilities/domUtils.js`: Centralized DOM manipulation utilities for editing and cleanup.
- `frontend/src/App.jsx`: App entry point, routing, and state management.
- `frontend/vite.config.js`: Vite configuration for frontend build.
- `DEVELOPMENT_GUIDELINES.md`: Windows PowerShell-specific development procedures and server verification.

## AI Agent Guidance
- **When generating or editing frontend code**: Always use CSS variables for theming. Never hardcode color values. Ensure all color pickers reference the fixed set of variable names.
- **When updating the editor**: Do not introduce stateful color logic or extract color values from style blocks. Update variables directly in the DOM and embedded CSS.
- **When modifying backend prompt logic**: Ensure the output HTML always includes a `:root` block with all theme variables. Follow the 3-phase prompt structure in `prompt.md`.
- **When adding new features**: Adhere to the mobile-first, semantic HTML/CSS conventions. Keep backend and frontend logic modular and separated.
- **When working with deployments**: Use NetlifyZipService for all Netlify deployments. Ensure HTML is validated and cleaned before publishing. The service automatically handles HTML structure validation and content-type fixes.
- **When using terminal commands**: Use Windows PowerShell syntax (`;` for chaining). Always verify server status before starting to avoid port conflicts.
- **When implementing HTML cleanup**: Use `DOMUtils.cleanAllEditingElements()` to remove contentEditable attributes and editing UI before publishing. This is mandatory for clean published sites.
- **When debugging HTML rendering issues**: Check for missing DOCTYPE, incomplete HTML structure, and verify MIME type. The validateAndFixHTML function handles most issues automatically.
- **When creating company name URLs**: Use the intelligent word processing in generateSiteName that removes common business terms and creates short, memorable URLs.
- **When writing documentation**: Reference actual file paths and workflows. Avoid generic advice; focus on project-specific details.

## Example: Adding a New Theme Variable
1. Add the variable to the list in `Editor.jsx` (e.g., `--highlight`).
2. Ensure the AI prompt in `prompt.md` requests this variable in the `:root` block.
3. Update the template in `page_template.html` to include the new variable.
4. Never hardcode the color value in JS/JSX; always use the variable name.

## Technical Solutions & Patterns

### NetlifyZipService Deployment
The `NetlifyZipService` implements Netlify's official ZIP Method for atomic deployments:
- **HTML Validation**: Automatically validates and fixes HTML structure to ensure proper rendering
- **_headers File**: Creates `_headers` file to force `Content-Type: text/html` and prevent HTML-as-text issues
- **Company Name URLs**: Generates intelligent, short URLs from company names (e.g., "Panadería San José" → "panaderiasj12345.netlify.app")
- **Deploy Speed**: Completes deployments in <30 seconds vs >5 minutes with CLI methods
- **Error Diagnostics**: Comprehensive logging and MIME type verification

### HTML Content-Type Solutions
When HTML renders as plain text instead of webpage:
1. **Root Cause**: Missing DOCTYPE, incomplete HTML structure, or incorrect MIME type detection
2. **Solution**: `validateAndFixHTML()` ensures complete HTML5 structure with UTF-8 charset
3. **Backup Solution**: `_headers` file forces correct Content-Type in Netlify
4. **Verification**: Post-deploy MIME type checking confirms successful fix

### Publishing Workflow
The publishing process includes mandatory HTML cleanup:
```javascript
// In Editor.jsx handlePublishSubmit
const clone = contentRef.current.cloneNode(true);
DOMUtils.cleanAllEditingElements(clone);
DOMUtils.removeContentEditableAttributes(clone);
const cleanHtmlContent = clone.innerHTML;
```

### Windows PowerShell Development
- **Command Chaining**: Use `;` instead of `&&` (e.g., `cd backend; npm start`)
- **Server Verification**: Always check running processes before starting servers
- **Port Checking**: `netstat -ano | findstr :3001` for backend, `:5173` for frontend
- **Background Processes**: Use `isBackground: true` in terminal tools for long-running servers

### DOM Utilities Architecture
`frontend/src/utilities/domUtils.js` provides centralized DOM manipulation:
- **removeContentEditableAttributes**: Removes all contentEditable attributes for publishing
- **cleanAllEditingElements**: Comprehensive cleanup of editing UI elements
- **Background button management**: Handles dynamic background image controls
- **Validation utilities**: Ensures proper element sizing and structure

---
For further details, see the main `README.md` and referenced files.
