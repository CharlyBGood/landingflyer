import { useState, useEffect, useRef, useCallback } from 'react';
import { PencilIcon, CheckIcon, GlobeIcon } from '../utilities';
import { useIframeEditor } from '../hooks/useIframeEditor';
import PublishModal from './editor/PublishModal.jsx';
import PublishSuccessModal from './editor/PublishSuccessModal.jsx';
import CartModal from './cart/CartModal.jsx';
import '../styles/Editor.css';

function Editor() {
  const iframeRef = useRef(null);
  const uploadFilesRef = useRef(new Map());
  const toolbarRef = useRef(null);
  const lastSavedHtmlRef = useRef('');

  const [html, setHtml] = useState('');
  const [editing, setEditing] = useState(false);
  const [hasPendingEdits, setHasPendingEdits] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const [frameHeight, setFrameHeight] = useState(null);
  const [previewKey, setPreviewKey] = useState('');

  const { enableEditingInIframe, disableEditingInIframe } = useIframeEditor({
    iframeRef,
    uploadFilesRef,
    setHasPendingEdits,
  });

  // Load HTML from localStorage on mount
  useEffect(() => {
    const workingContent = localStorage.getItem('editableHtml') || '<h1>No hay contenido...</h1>';
    const originalTemplate = localStorage.getItem('originalTemplate');
    setHtml(workingContent);
    lastSavedHtmlRef.current = workingContent;
    if (!originalTemplate) {
      localStorage.setItem('originalTemplate', workingContent);
    }
  }, []);

  // Compute iframe height
  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const toolbarH = toolbarRef.current?.offsetHeight ?? 0;
      setFrameHeight(Math.max(200, vh - toolbarH));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [editing, saveMessage]);

  // Write HTML into iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const tailwindCdn = `
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script>
      window.tailwind = window.tailwind || {};
      tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter','system-ui','sans-serif'] } } } };
    <\/script>`;

    let docHtml = html && html.trim();
    const stripScripts = (s) => s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    if (!docHtml) {
      docHtml = `<!doctype html><html><body><div class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">No hay contenido para previsualizar.</div></body></html>`;
    } else if (docHtml.includes('</html>')) {
      if (editing) docHtml = stripScripts(docHtml);
      if (!/tailwindcss\.com/.test(docHtml)) {
        if (docHtml.includes('</head>')) {
          docHtml = docHtml.replace('</head>', `${tailwindCdn}</head>`);
        } else {
          docHtml = docHtml.replace('<body>', `<body>${tailwindCdn}`);
        }
      }
    } else {
      const bodyHtml = editing ? stripScripts(docHtml) : docHtml;
      docHtml = `<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Vista Previa</title>\n${tailwindCdn}\n</head>\n<body>\n${bodyHtml}\n</body>\n</html>`;
    }

    doc.open();
    doc.write(docHtml);
    doc.close();

    if (editing) {
      setTimeout(() => { try { enableEditingInIframe(); } catch { /* ignore */ } }, 0);
    } else {
      try {
        doc.body?.removeAttribute('data-lf-edit');
        doc.getElementById('lf-img-search-panel')?.remove();
        doc.getElementById('lf-edit-style')?.remove();
        Array.from(doc.querySelectorAll('[contenteditable]')).forEach((el) => el.removeAttribute('contenteditable'));
        Array.from(doc.querySelectorAll('[data-lf-toast]')).forEach((el) => el.remove());
      } catch { /* ignore */ }
    }
  }, [html, editing, enableEditingInIframe, previewKey]);

  // Sync from other tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'editableHtml' && e.newValue) setHtml(e.newValue);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const showSuccessMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleToggleEditing = () => {
    const next = !editing;
    setEditing(next);
    if (next) {
      lastSavedHtmlRef.current = html;
      setHasPendingEdits(false);
    } else {
      setHasPendingEdits(false);
      try { disableEditingInIframe(); } catch { /* ignore */ }
    }
  };

  const handleSaveEdits = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    // Clone the document, strip editor artifacts
    const htmlEl = doc.documentElement.cloneNode(true);
    htmlEl.querySelectorAll('[contenteditable]')?.forEach((el) => el.removeAttribute('contenteditable'));
    htmlEl.querySelector('body')?.removeAttribute('data-lf-edit');
    htmlEl.querySelector('#lf-img-search-panel')?.remove();
    htmlEl.querySelector('#lf-edit-style')?.remove();
    htmlEl.querySelectorAll('[data-lf-toast]')?.forEach((el) => el.remove());

    const newHtml = '<!DOCTYPE html>' + htmlEl.outerHTML;
    setHtml(newHtml);
    lastSavedHtmlRef.current = newHtml;
    setHasPendingEdits(false);

    localStorage.setItem('editableHtml', newHtml);
    showSuccessMessage('Cambios guardados exitosamente');

    // Re-enable editing after save
    setTimeout(() => { try { enableEditingInIframe(); } catch { /* ignore */ } }, 0);
  }, [enableEditingInIframe]);

  const handleDiscardEdits = () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    try { if (doc?.__lfTeardown__) doc.__lfTeardown__(); } catch { /* ignore */ }
    try { uploadFilesRef.current.clear(); } catch { /* ignore */ }

    const fallback = lastSavedHtmlRef.current || localStorage.getItem('editableHtml') || '';
    setEditing(false);
    if (fallback) setHtml(fallback);
    setPreviewKey(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    setHasPendingEdits(false);
    lastSavedHtmlRef.current = fallback;
    showSuccessMessage('Cambios descartados');
  };

  const handleReset = () => {
    const originalTemplate = localStorage.getItem('originalTemplate');
    if (!originalTemplate) return;

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    try { if (doc?.__lfTeardown__) doc.__lfTeardown__(); } catch { /* ignore */ }
    try { uploadFilesRef.current.clear(); } catch { /* ignore */ }

    setHtml(originalTemplate);
    lastSavedHtmlRef.current = originalTemplate;
    localStorage.setItem('editableHtml', originalTemplate);
    setEditing(false);
    setHasPendingEdits(false);
    setPreviewKey(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    showSuccessMessage('Restaurado al estado original');
  };

  const handlePublish = () => {
    setShowCartModal(true);
  };

  const handleCartConfirm = () => {
    setShowCartModal(false);
    setShowPublishModal(true);
  };

  const handlePublishSubmit = async (siteName) => {
    setIsPublishing(true);

    try {
      // Get clean HTML from iframe
      let publishHtml = html;
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      if (doc) {
        const htmlEl = doc.documentElement.cloneNode(true);
        htmlEl.querySelectorAll('[contenteditable]')?.forEach((el) => el.removeAttribute('contenteditable'));
        htmlEl.querySelector('body')?.removeAttribute('data-lf-edit');
        htmlEl.querySelector('#lf-img-search-panel')?.remove();
        htmlEl.querySelector('#lf-edit-style')?.remove();
        htmlEl.querySelectorAll('[data-lf-toast]')?.forEach((el) => el.remove());
        publishHtml = '<!DOCTYPE html>' + htmlEl.outerHTML;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const response = await fetch(`${apiUrl}/api/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlContent: publishHtml, siteName }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error HTTP ${response.status}: ${errorData.details || errorData.error || 'Error desconocido'}`);
      }

      const result = await response.json();
      setPublishResult(result);
      setShowPublishModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error publicando:', error);
      if (error.name === 'AbortError') {
        alert('La publicacion esta tardando mas de lo esperado. El proceso puede estar completandose en segundo plano.');
      } else {
        alert(`Error al publicar: ${error.message}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCloseModals = () => {
    setShowCartModal(false);
    setShowPublishModal(false);
    setShowSuccessModal(false);
    setPublishResult(null);
  };

  return (
    <div className="editor-page">
      <div className="editor-toolbar" ref={toolbarRef}>
        <div className="toolbar-main">
          <button
            onClick={handleToggleEditing}
            className={`edit-mode-btn ${editing ? 'active' : ''}`}
            aria-label={editing ? 'Salir de edicion' : 'Activar edicion'}
          >
            <PencilIcon size={20} />
            <span className="btn-text">{editing ? 'Salir' : 'Editar'}</span>
          </button>

          <button
            onClick={handleReset}
            className="edit-mode-btn reset-btn"
            aria-label="Restaurar al estado original"
          >
            <span className="btn-text">Reset</span>
          </button>

          {editing && (
            <>
              <button onClick={handleSaveEdits} className="save-changes-btn" aria-label="Guardar cambios">
                <CheckIcon size={16} />
                <span className="btn-text">Guardar</span>
              </button>

              {hasPendingEdits && (
                <button onClick={handleDiscardEdits} className="edit-mode-btn discard-btn" aria-label="Descartar cambios">
                  <span className="btn-text">Descartar</span>
                </button>
              )}
            </>
          )}
        </div>

        <button
          onClick={handlePublish}
          className="edit-mode-btn publish-btn-custom flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-semibold text-sinapsia-light bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Publicar pagina"
        >
          <GlobeIcon size={18} className="shrink-0" />
          <span className="btn-text">Publicar</span>
        </button>

        {(editing || saveMessage) && (
          <div className="toolbar-instructions">
            <div className={`instructions-content ${saveMessage ? 'success-message' : ''}`}>
              <span className="instruction-icon">{saveMessage ? '\u2705' : '\uD83D\uDCA1'}</span>
              <span className="instruction-text">
                {saveMessage ? (
                  <span className="font-medium">{saveMessage}</span>
                ) : (
                  <>
                    <span className="font-medium">Editar:</span>
                    <span className="hidden sm:inline"> Click en textos para editar, click en imagenes para reemplazar</span>
                    <span className="sm:hidden"> Toca textos/imagenes</span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="editor-content">
        <iframe
          key={previewKey}
          ref={iframeRef}
          title="preview"
          className="editor-iframe"
          style={{ height: frameHeight ? `${frameHeight}px` : undefined }}
        />
      </div>

      <CartModal isOpen={showCartModal} onClose={handleCloseModals} onConfirm={handleCartConfirm} />
      <PublishModal isOpen={showPublishModal} onClose={handleCloseModals} onPublish={handlePublishSubmit} isPublishing={isPublishing} />
      <PublishSuccessModal isOpen={showSuccessModal} onClose={handleCloseModals} publishResult={publishResult} />
    </div>
  );
}

export default Editor;
