import { useCallback, useRef } from 'react';

const EDIT_STYLE_ID = 'lf-edit-style';
const IMG_EDIT_ATTR = 'data-editable-image';

const EDIT_CSS = `
body[data-lf-edit="on"] [data-editable="true"] {
  outline: 2px dashed rgba(245,158,11,0.8);
  outline-offset: 2px;
}
body[data-lf-edit="on"] [data-editable="true"]:hover {
  background: rgba(245,158,11,0.06);
}
body[data-lf-edit="on"] img[data-editable-image="true"] {
  outline: 2px dashed rgba(99,102,241,0.7);
  outline-offset: 2px;
  cursor: pointer;
  pointer-events: auto !important;
}
body[data-lf-edit="on"] img[data-editable-image="true"]:hover {
  opacity: 0.9;
}
`;

/**
 * Ensures the editable-image attribute is present on every img (excluding
 * those inside any UI panel supplied via `excludeAncestorSelector`) and
 * assigns stable IDs for later lookup / upload mapping.
 */
function markAllImagesEditable(doc) {
  const all = Array.from(doc.querySelectorAll('img'));
  all.forEach((img) => {
    if (!img.hasAttribute(IMG_EDIT_ATTR)) img.setAttribute(IMG_EDIT_ATTR, 'true');
    if (!img.getAttribute('data-lf-img-id')) {
      img.setAttribute('data-lf-img-id', `lfimg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    }
  });
}

/**
 * Slim editor hook. Responsibilities:
 *   - Enable contenteditable on [data-editable="true"] elements.
 *   - Inject an <style id="lf-edit-style"> into the iframe's head.
 *   - Report 'input' events as dirty via setHasPendingEdits.
 *   - Detect clicks on editable images and surface them via onImageClick,
 *     providing the image element and its bounding rect (iframe coords).
 *
 * Anything UI (image picker panel, toasts, provider tabs, upload flow) is
 * now rendered in the parent React tree. This hook is intentionally
 * free of API calls and DOM-built widgets.
 */
export function useIframeEditor({ iframeRef, setHasPendingEdits, onImageClick }) {
  const teardownRef = useRef(null);
  const handlersRef = useRef({ setHasPendingEdits, onImageClick });
  handlersRef.current = { setHasPendingEdits, onImageClick };

  const enable = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    // Tear down any previous session on the same doc to avoid duplicate listeners.
    try { teardownRef.current?.(); } catch { /* ignore */ }
    teardownRef.current = null;

    // Inject edit styles.
    if (!doc.getElementById(EDIT_STYLE_ID)) {
      const style = doc.createElement('style');
      style.id = EDIT_STYLE_ID;
      style.textContent = EDIT_CSS;
      doc.head?.appendChild(style);
    }

    // Enable contenteditable on marked elements.
    const editables = Array.from(doc.querySelectorAll('[data-editable="true"]'));
    editables.forEach((el) => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });

    markAllImagesEditable(doc);

    doc.body?.setAttribute('data-lf-edit', 'on');
    try { handlersRef.current.setHasPendingEdits?.(false); } catch { /* ignore */ }

    const onInput = () => {
      try { handlersRef.current.setHasPendingEdits?.(true); } catch { /* ignore */ }
    };

    const onClick = (e) => {
      const target = e.target;
      if (!target) return;
      const img = target.closest?.('img[data-editable-image="true"]');
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = img.getBoundingClientRect();
      const id = img.getAttribute('data-lf-img-id');
      try {
        handlersRef.current.onImageClick?.({
          image: img,
          id,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, bottom: rect.bottom, right: rect.right },
        });
      } catch { /* ignore */ }
    };

    doc.addEventListener('input', onInput, true);
    doc.addEventListener('click', onClick, true);

    teardownRef.current = () => {
      try { doc.removeEventListener('input', onInput, true); } catch { /* ignore */ }
      try { doc.removeEventListener('click', onClick, true); } catch { /* ignore */ }
      try { doc.body?.removeAttribute('data-lf-edit'); } catch { /* ignore */ }
      try { doc.getElementById(EDIT_STYLE_ID)?.remove(); } catch { /* ignore */ }
      editables.forEach((el) => {
        try { el.removeAttribute('contenteditable'); } catch { /* ignore */ }
      });
    };

    // Publish teardown on doc for external callers (legacy contract).
    try { doc.__lfTeardown__ = teardownRef.current; } catch { /* ignore */ }
  }, [iframeRef]);

  const disable = useCallback(() => {
    try { teardownRef.current?.(); } catch { /* ignore */ }
    teardownRef.current = null;
  }, []);

  const getImageById = useCallback((id) => {
    if (!id) return null;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return null;
    return doc.querySelector(`img[data-lf-img-id="${CSS.escape(id)}"]`);
  }, [iframeRef]);

  return {
    enableEditingInIframe: enable,
    disableEditingInIframe: disable,
    getImageById,
  };
}
