- **Never apply styles directly via the `style` attribute in JSX/HTML. Always use Tailwind CSS classes if available, or otherwise use the appropriate CSS file.**
# Copilot Instructions for LandingFlyer

## Project Overview
LandingFlyer is a full-stack AI-powered landing page generator. It consists of a Node.js/Express backend (with Google VertexAI integration) and a React/Vite/Tailwind frontend. The backend orchestrates prompt engineering and HTML/CSS generation, while the frontend provides a visual editor for real-time landing page customization.

## Key Architectural Details
- **Backend**: Node.js 20, Express 5.1.0, Google VertexAI (Gemini 2.0 Flash), Multer, CORS, dotenv, Docker, Google Cloud Run, Service Account authentication.
- **Frontend**: React 19.1.0, Vite 7.0.4, Tailwind CSS 4.1.11, React Router DOM 7.7.1, Axios, localStorage for persistence.
- **AI Integration**: The backend uses `prompt.md` to guide a 3-phase prompt process, generating HTML with a `:root` CSS block containing theme variables.
- **Editor**: The main editor (`frontend/src/components/Editor.jsx`) allows WYSIWYG editing, color theming via CSS variables, and background image controls. All color pickers are mapped to a fixed set of common CSS variable names (e.g., `--primary`, `--secondary`, `--accent`, etc.).

## Developer Workflow
- **Local Development**: Run backend and frontend separately using npm scripts. Backend runs on Node.js, frontend on Vite dev server.
- **Deployment**: Backend is containerized with Docker and deployed to Google Cloud Run. Frontend is deployed to Netlify or Vercel.
- **AI Prompting**: All prompt logic is in `backend/prompt.md`. The backend injects prompt results into `backend/page_template.html`.
- **Frontend Editing**: The editor updates CSS variables directly in the DOM and in the embedded `<style>` block. No color logic is hardcoded; only variable names are referenced.

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
- `frontend/src/components/Editor.jsx`: Main visual editor, color pickers, and editing logic.
- `frontend/src/App.jsx`: App entry point, routing, and state management.
- `frontend/vite.config.js`: Vite configuration for frontend build.

## AI Agent Guidance
- **When generating or editing frontend code**: Always use CSS variables for theming. Never hardcode color values. Ensure all color pickers reference the fixed set of variable names.
- **When updating the editor**: Do not introduce stateful color logic or extract color values from style blocks. Update variables directly in the DOM and embedded CSS.
- **When modifying backend prompt logic**: Ensure the output HTML always includes a `:root` block with all theme variables. Follow the 3-phase prompt structure in `prompt.md`.
- **When adding new features**: Adhere to the mobile-first, semantic HTML/CSS conventions. Keep backend and frontend logic modular and separated.
- **When writing documentation**: Reference actual file paths and workflows. Avoid generic advice; focus on project-specific details.

## Example: Adding a New Theme Variable
1. Add the variable to the list in `Editor.jsx` (e.g., `--highlight`).
2. Ensure the AI prompt in `prompt.md` requests this variable in the `:root` block.
3. Update the template in `page_template.html` to include the new variable.
4. Never hardcode the color value in JS/JSX; always use the variable name.

---
For further details, see the main `README.md` and referenced files.
