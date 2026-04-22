import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URL, apiHeaders } from '../../utilities/api.js';
import { useIframeEditor } from '../../hooks/useIframeEditor.js';
import PublishModal from '../../components/editor/PublishModal.jsx';
import PublishSuccessModal from '../../components/editor/PublishSuccessModal.jsx';
import CartModal from '../../components/cart/CartModal.jsx';
import EditorTopBar from './components/EditorTopBar.jsx';
import { useEditorPersistence } from './hooks/useEditorPersistence.js';
import { extractCleanHtml, stripEditModeFromDoc } from './utils/htmlSanitize.js';

const TAILWIND_CDN_SNIPPET = `
<script src="https://cdn.tailwindcss.com"></script>
<script>
  window.tailwind = window.tailwind || {};
  tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter','system-ui','sans-serif'] } } } };
</script>`;

const EMPTY_DOC = `<!doctype html><html><body><div class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">No hay contenido para previsualizar.</div></body></html>`;

const stripScripts = (s) =>
  s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

function prepareIframeDoc(html, { editing }) {
  let doc = (html || '').trim();

  if (!doc) return EMPTY_DOC;

  const hasFullDoc = doc.includes('</html>');
  const body = editing ? stripScripts(doc) : doc;

  if (hasFullDoc) {
    if (/tailwindcss\.com/.test(body)) return body;
    return body.includes('</head>')
      ? body.replace('</head>', `${TAILWIND_CDN_SNIPPET}</head>`)
      : body.replace('<body>', `<body>${TAILWIND_CDN_SNIPPET}`);
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vista Previa</title>
${TAILWIND_CDN_SNIPPET}
</head>
<body>
${body}
</body>
</html>`;
}

export default function EditorPage() {
  const iframeRef = useRef(null);
  const toolbarRef = useRef(null);
  const uploadFilesRef = useRef(new Map());

  const { html, setHtml, save, reset, getLastSaved } = useEditorPersistence();
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [frameHeight, setFrameHeight] = useState(null);
  const [previewKey, setPreviewKey] = useState('');

  const [showCart, setShowCart] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const { enableEditingInIframe, disableEditingInIframe } = useIframeEditor({
    iframeRef,
    uploadFilesRef,
    setHasPendingEdits: setDirty,
  });

  // Compute toolbar + iframe heights
  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const toolbarH = toolbarRef.current?.offsetHeight ?? 0;
      setToolbarHeight(toolbarH);
      setFrameHeight(Math.max(200, vh - toolbarH));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [editing, dirty]);

  // Write HTML into iframe and toggle edit mode
  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;

    const docHtml = prepareIframeDoc(html, { editing });
    doc.open();
    doc.write(docHtml);
    doc.close();

    if (editing) {
      setTimeout(() => {
        try { enableEditingInIframe(); } catch { /* ignore */ }
      }, 0);
    } else {
      stripEditModeFromDoc(doc);
    }
  }, [html, editing, enableEditingInIframe, previewKey]);

  const handleToggleEditing = () => {
    setEditing((prev) => {
      const next = !prev;
      if (!next) {
        try { disableEditingInIframe(); } catch { /* ignore */ }
      }
      setDirty(false);
      return next;
    });
  };

  const handleSave = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const clean = extractCleanHtml(doc);
    if (!clean) return;

    save(clean);
    setDirty(false);
    setJustSaved(Date.now());

    // Re-enable editing after save (the iframe was not reloaded, but be safe)
    setTimeout(() => {
      try { enableEditingInIframe(); } catch { /* ignore */ }
    }, 0);
  }, [save, enableEditingInIframe]);

  const handleDiscard = () => {
    const doc = iframeRef.current?.contentDocument;
    try { doc?.__lfTeardown__?.(); } catch { /* ignore */ }
    uploadFilesRef.current.clear();

    const fallback = getLastSaved();
    setEditing(false);
    setDirty(false);
    if (fallback) setHtml(fallback);
    setPreviewKey(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  };

  const handleReset = () => {
    const doc = iframeRef.current?.contentDocument;
    try { doc?.__lfTeardown__?.(); } catch { /* ignore */ }
    uploadFilesRef.current.clear();

    const original = reset();
    if (!original) return;

    setEditing(false);
    setDirty(false);
    setPreviewKey(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    setJustSaved(Date.now());
  };

  const handlePublish = () => setShowCart(true);
  const handleCartConfirm = () => {
    setShowCart(false);
    setShowPublish(true);
  };

  const handlePublishSubmit = async (siteName) => {
    setIsPublishing(true);
    try {
      const doc = iframeRef.current?.contentDocument;
      const publishHtml = extractCleanHtml(doc) || html;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(`${API_URL}/api/publish`, {
        method: 'POST',
        headers: apiHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ htmlContent: publishHtml, siteName }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          `Error HTTP ${response.status}: ${err.details || err.error || 'Error desconocido'}`
        );
      }

      const result = await response.json();
      setPublishResult(result);
      setShowPublish(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error publicando:', error);
      if (error.name === 'AbortError') {
        alert(
          'La publicación está tardando más de lo esperado. El proceso puede estar completándose en segundo plano.'
        );
      } else {
        alert(`Error al publicar: ${error.message}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCloseModals = () => {
    setShowCart(false);
    setShowPublish(false);
    setShowSuccess(false);
    setPublishResult(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-sinapsia-base">
      <div ref={toolbarRef}>
        <EditorTopBar
          editing={editing}
          dirty={dirty}
          justSaved={justSaved}
          onToggleEditing={handleToggleEditing}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onReset={handleReset}
          onPublish={handlePublish}
        />
      </div>

      <div className="flex-1 overflow-hidden" style={{ paddingTop: toolbarHeight }}>
        <iframe
          key={previewKey}
          ref={iframeRef}
          title="preview"
          className="w-full border-0 bg-white"
          style={{ height: frameHeight ? `${frameHeight}px` : '100%' }}
        />
      </div>

      <CartModal
        isOpen={showCart}
        onClose={handleCloseModals}
        onConfirm={handleCartConfirm}
      />
      <PublishModal
        isOpen={showPublish}
        onClose={handleCloseModals}
        onPublish={handlePublishSubmit}
        isPublishing={isPublishing}
      />
      <PublishSuccessModal
        isOpen={showSuccess}
        onClose={handleCloseModals}
        publishResult={publishResult}
      />
    </div>
  );
}
