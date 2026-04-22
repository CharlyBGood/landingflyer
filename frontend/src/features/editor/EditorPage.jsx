import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URL, apiHeaders } from '../../utilities/api.js';
import { useIframeEditor } from '../../hooks/useIframeEditor.js';
import PublishModal from '../../components/editor/PublishModal.jsx';
import PublishSuccessModal from '../../components/editor/PublishSuccessModal.jsx';
import CartModal from '../../components/cart/CartModal.jsx';
import EditorTopBar from './components/EditorTopBar.jsx';
import SelectionToolbar from './components/SelectionToolbar.jsx';
import LinkEditDialog from './components/LinkEditDialog.jsx';
import { useEditorPersistence } from './hooks/useEditorPersistence.js';
import { useEditorHistory } from './hooks/useEditorHistory.js';
import { useIframeSelection } from './hooks/useIframeSelection.js';
import { extractCleanHtml, stripEditModeFromDoc } from './utils/htmlSanitize.js';
import {
  execIframeCommand,
  captureSelectionRange,
  restoreSelectionRange,
  anchorForRange,
  applyLinkToRange,
  unwrapAnchor,
  dispatchSyntheticInput,
} from './utils/selectionCommands.js';

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
  const uploadFilesRef = useRef(new Map());
  const savedRangeRef = useRef(null);

  const { html, setHtml, save, reset, getLastSaved } = useEditorPersistence();
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(null);
  const [previewKey, setPreviewKey] = useState('');

  const [showCart, setShowCart] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const [linkDialog, setLinkDialog] = useState({ open: false, initial: null, defaultText: '' });

  const { enableEditingInIframe, disableEditingInIframe } = useIframeEditor({
    iframeRef,
    uploadFilesRef,
    setHasPendingEdits: setDirty,
  });

  // Rewire editor handlers after a wholesale DOM restore (undo/redo/link).
  const rewireEditing = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    try { doc.__lfTeardown__?.(); } catch { /* ignore */ }
    try { enableEditingInIframe(); } catch { /* ignore */ }
  }, [enableEditingInIframe]);

  const history = useEditorHistory({
    iframeRef,
    enabled: editing,
    onRestore: rewireEditing,
    onChange: () => setDirty(true),
  });

  const selection = useIframeSelection({
    iframeRef,
    enabled: editing && !linkDialog.open,
    refreshKey: previewKey,
  });

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

  // --- Formatting commands ---

  const runInlineCommand = (command) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    try { iframeRef.current?.contentWindow?.focus(); } catch { /* ignore */ }
    history.snapshot();
    execIframeCommand(doc, command);
    setDirty(true);
    dispatchSyntheticInput(doc);
  };

  const handleBold = () => runInlineCommand('bold');
  const handleItalic = () => runInlineCommand('italic');

  const handleOpenLinkDialog = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const range = captureSelectionRange(doc);
    savedRangeRef.current = range;
    const anchor = anchorForRange(range);
    const defaultText = selection.text || '';
    setLinkDialog({
      open: true,
      initial: anchor ? {
        href: anchor.getAttribute('href') || '',
        text: anchor.textContent || '',
        target: anchor.getAttribute('target') || null,
      } : null,
      defaultText,
    });
  };

  const handleOpenLinkExternal = () => {
    const href = selection.anchor?.getAttribute('href');
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleUnlinkFromToolbar = () => {
    if (!selection.anchor) return;
    const doc = iframeRef.current?.contentDocument;
    history.snapshot();
    unwrapAnchor(selection.anchor);
    setDirty(true);
    dispatchSyntheticInput(doc);
  };

  const handleLinkSubmit = ({ href, text, target }) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const range = savedRangeRef.current;
    if (!range) {
      setLinkDialog((d) => ({ ...d, open: false }));
      return;
    }
    history.snapshot();
    restoreSelectionRange(doc, range);
    applyLinkToRange(doc, range, { href, text, target });
    setDirty(true);
    dispatchSyntheticInput(doc);
    rewireEditing();
    savedRangeRef.current = null;
    setLinkDialog({ open: false, initial: null, defaultText: '' });
  };

  const handleLinkRemove = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const range = savedRangeRef.current;
    const anchor = anchorForRange(range);
    if (!anchor) {
      setLinkDialog((d) => ({ ...d, open: false }));
      return;
    }
    history.snapshot();
    unwrapAnchor(anchor);
    setDirty(true);
    dispatchSyntheticInput(doc);
    savedRangeRef.current = null;
    setLinkDialog({ open: false, initial: null, defaultText: '' });
  };

  const handleLinkDialogOpenChange = (open) => {
    if (!open) {
      savedRangeRef.current = null;
      setLinkDialog({ open: false, initial: null, defaultText: '' });
    }
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

  const selectionToolbarVisible =
    editing && !linkDialog.open && selection.rect && (selection.hasSelection || selection.anchor);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-sinapsia-base">
      <EditorTopBar
        editing={editing}
        dirty={dirty}
        justSaved={justSaved}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onToggleEditing={handleToggleEditing}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onReset={handleReset}
        onPublish={handlePublish}
        onUndo={history.undo}
        onRedo={history.redo}
      />

      <div className="flex-1 min-h-0">
        <iframe
          key={previewKey}
          ref={iframeRef}
          title="preview"
          className="w-full h-full border-0 bg-white"
        />
      </div>

      <SelectionToolbar
        visible={Boolean(selectionToolbarVisible)}
        rect={selection.rect}
        iframeRef={iframeRef}
        hasAnchor={Boolean(selection.anchor)}
        anchorHref={selection.anchor?.getAttribute('href') || ''}
        onBold={handleBold}
        onItalic={handleItalic}
        onLink={handleOpenLinkDialog}
        onUnlink={handleUnlinkFromToolbar}
        onOpenLink={handleOpenLinkExternal}
      />

      <LinkEditDialog
        open={linkDialog.open}
        onOpenChange={handleLinkDialogOpenChange}
        initial={linkDialog.initial}
        defaultText={linkDialog.defaultText}
        onSubmit={handleLinkSubmit}
        onRemove={handleLinkRemove}
      />

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
