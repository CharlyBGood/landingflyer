import { useCallback, useRef } from 'react';

function attachTailwind(html) {
  if (!html) return '';
  if (/cdn\.tailwindcss\.com|tailwindcss/i.test(html)) return html;

  const tailwindScript = [
    '<script src="https://cdn.tailwindcss.com"></script>',
    '<script>window.tailwind = window.tailwind || {}; tailwind.config = { theme: { extend: {} } };</script>',
  ].join('');

  if (html.includes('</head>')) {
    return html.replace('</head>', `${tailwindScript}</head>`);
  }

  if (html.includes('<body>')) {
    return html.replace('<body>', `<body>${tailwindScript}`);
  }

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${tailwindScript}</head><body>${html}</body></html>`;
}

function stripScripts(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function useIframeEditor({ iframeRef, onDirtyChange }) {
  const teardownRef = useRef(null);

  const disableEditingInIframe = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    if (typeof teardownRef.current === 'function') {
      teardownRef.current();
      teardownRef.current = null;
    }

    doc.querySelectorAll('[data-editable="true"]').forEach((el) => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });

    doc.querySelector('#lf-editor-style')?.remove();
  }, [iframeRef]);

  const enableEditingInIframe = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    disableEditingInIframe();

    const style = doc.createElement('style');
    style.id = 'lf-editor-style';
    style.textContent = [
      'body [data-editable="true"] { outline: 0.125rem dashed rgba(251, 146, 60, 0.9); outline-offset: 0.125rem; }',
      'body img[data-editable-image="true"] { outline: 0.125rem dashed rgba(59, 130, 246, 0.9); outline-offset: 0.125rem; cursor: pointer; }',
    ].join('');
    doc.head.appendChild(style);

    doc.querySelectorAll('[data-editable="true"]').forEach((el) => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });

    const onInput = () => {
      onDirtyChange(true);
    };

    const onImageClick = (event) => {
      const image = event.target.closest('img[data-editable-image="true"]');
      if (!image) return;

      const input = doc.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.hidden = true;

      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (!file) {
          input.remove();
          return;
        }

        image.src = URL.createObjectURL(file);
        image.setAttribute('data-user-image', 'true');
        onDirtyChange(true);
        input.remove();
      }, { once: true });

      doc.body.appendChild(input);
      input.click();
    };

    doc.addEventListener('input', onInput, true);
    doc.addEventListener('click', onImageClick, true);

    teardownRef.current = () => {
      doc.removeEventListener('input', onInput, true);
      doc.removeEventListener('click', onImageClick, true);
    };
  }, [disableEditingInIframe, iframeRef, onDirtyChange]);

  const getIframeSrcDoc = useCallback((html, editing) => {
    if (!html) return '';
    const safeHtml = editing ? stripScripts(html) : html;
    return attachTailwind(safeHtml);
  }, []);

  const exportCleanHtml = useCallback((fallbackHtml = '') => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return fallbackHtml;

    const clone = doc.documentElement.cloneNode(true);
    clone.querySelector('#lf-editor-style')?.remove();
    clone.querySelectorAll('[contenteditable]').forEach((el) => el.removeAttribute('contenteditable'));
    clone.querySelectorAll('[spellcheck]').forEach((el) => el.removeAttribute('spellcheck'));

    return `<!DOCTYPE html>${clone.outerHTML}`;
  }, [iframeRef]);

  return {
    enableEditingInIframe,
    disableEditingInIframe,
    getIframeSrcDoc,
    exportCleanHtml,
  };
}
