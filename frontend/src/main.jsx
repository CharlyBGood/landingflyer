import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import GrapesJsEditor from './components/GrapesJsEditor.jsx';
import TailwindPreview from './components/TailwindPreview.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/editor" element={<TailwindPreview />} />
        <Route path="/grapesjs" element={<GrapesJsEditor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
