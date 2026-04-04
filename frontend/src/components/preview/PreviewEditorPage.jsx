import { useEffect, useMemo, useRef, useState } from 'react';
import PublishModal from '../editor/PublishModal.jsx';
import PublishSuccessModal from '../editor/PublishSuccessModal.jsx';
import CartModal from '../cart/CartModal.jsx';
import PreviewHeader from './PreviewHeader.jsx';
import MobileActionBar from './MobileActionBar.jsx';
import { useIframeEditor } from '../../hooks/useIframeEditor.js';
import {
  loadPreviewState,
  saveEditedPreviewHtml,
  saveGeneratedPreview,
  savePreviewSiteName,
} from '../../utilities/previewStorage.js';

export default function PreviewEditorPage() {
  const iframeRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [siteName, setSiteName] = useState('');
  const [editing, setEditing] = useState(false);
  const [hasPendingEdits, setHasPendingEdits] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showCartModal, setShowCartModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const {
    enableEditingInIframe,
    disableEditingInIframe,
    getIframeSrcDoc,
    exportCleanHtml,
  } = useIframeEditor({
    iframeRef,
    onDirtyChange: setHasPendingEdits,
  });

  useEffect(() => {
    const state = loadPreviewState();
    setHtmlContent(state.html || '');
    setSiteName(state.siteName || '');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!siteName) return;
    savePreviewSiteName(siteName);
  }, [siteName]);

  useEffect(() => {
    if (!iframeRef.current) return;
    if (editing) {
      enableEditingInIframe();
      return;
    }
    disableEditingInIframe();
  }, [disableEditingInIframe, editing, enableEditingInIframe, htmlContent]);

  const iframeSrcDoc = useMemo(() => {
    return getIframeSrcDoc(htmlContent, editing);
  }, [editing, getIframeSrcDoc, htmlContent]);

  const handleSave = () => {
    const cleaned = exportCleanHtml(htmlContent);
    if (!cleaned) return;

    setHtmlContent(cleaned);
    saveEditedPreviewHtml(cleaned);
    setHasPendingEdits(false);
  };

  const handleDiscard = () => {
    const base = loadPreviewState().html;
    setHtmlContent(base || htmlContent);
    setHasPendingEdits(false);
  };

  const handleToggleEditing = () => {
    const next = !editing;
    setEditing(next);
    if (!next) setHasPendingEdits(false);
  };

  const handlePublishSubmit = async (targetSiteName) => {
    setIsPublishing(true);

    try {
      const cleanHtml = editing ? exportCleanHtml(htmlContent) : htmlContent;
      if (!cleanHtml) throw new Error('No hay contenido para publicar');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';

      const response = await fetch(`${apiUrl}/api/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlContent: cleanHtml, siteName: targetSiteName }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setPublishResult(result);
      setShowPublishModal(false);
      setShowSuccessModal(true);

      saveGeneratedPreview({ html: cleanHtml, siteName: targetSiteName });
      saveEditedPreviewHtml(cleanHtml);
    } catch (error) {
      const baseMessage = error?.name === 'AbortError'
        ? 'La publicación tardó demasiado tiempo (timeout)'
        : error?.message || 'Error desconocido al publicar';

      alert(`Error al publicar: ${baseMessage}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleOpenPublish = () => {
    setShowCartModal(true);
  };

  const handleCartConfirm = () => {
    setShowCartModal(false);
    setShowPublishModal(true);
  };

  const handleCloseModals = () => {
    setShowCartModal(false);
    setShowPublishModal(false);
    setShowSuccessModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Cargando editor...</p>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">No hay contenido disponible</h1>
          <p className="text-gray-600 mt-2">Genera una landing en la pantalla principal y vuelve a abrir el editor.</p>
          <a href="/" className="inline-flex mt-4 px-5 py-2 bg-portfolio-accent text-portfolio-text rounded-lg font-semibold">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white pb-16 md:pb-0">
      <PreviewHeader
        siteName={siteName}
        onSiteNameChange={setSiteName}
        editing={editing}
        hasPendingEdits={hasPendingEdits}
        onToggleEditing={handleToggleEditing}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onPublish={handleOpenPublish}
      />

      <iframe
        ref={iframeRef}
        srcDoc={iframeSrcDoc}
        title="Vista previa editable"
        className="w-full h-[92vh] border-none bg-white"
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => {
          if (editing) enableEditingInIframe();
        }}
      />

      <MobileActionBar
        editing={editing}
        hasPendingEdits={hasPendingEdits}
        onToggleEditing={handleToggleEditing}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onPublish={handleOpenPublish}
      />

      <CartModal
        isOpen={showCartModal}
        onClose={handleCloseModals}
        onConfirm={handleCartConfirm}
      />

      <PublishModal
        isOpen={showPublishModal}
        onClose={handleCloseModals}
        onPublish={handlePublishSubmit}
        isPublishing={isPublishing}
      />

      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModals}
        publishResult={publishResult}
      />
    </div>
  );
}
