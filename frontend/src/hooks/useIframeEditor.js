import { useCallback } from 'react';

export function useIframeEditor({ iframeRef, uploadFilesRef, setHasPendingEdits }) {

  const enableEditingInIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    // Assign unique IDs to editable images
    const assignImageIds = (d) => {
      const imgs = Array.from(d.querySelectorAll('img[data-editable-image="true"]'));
      let idx = 0;
      imgs.forEach((img) => {
        if (!img.getAttribute('data-lf-img-id')) {
          img.setAttribute('data-lf-img-id', `lfimg-${Date.now()}-${idx++}`);
        }
      });
    };

    // Inject edit styles
    const styleId = 'lf-edit-style';
    if (!doc.getElementById(styleId)) {
      const style = doc.createElement('style');
      style.id = styleId;
      style.textContent = `
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
          background: rgba(99,102,241,0.06);
        }
        #lf-img-search-panel img {
          width: 100%;
          height: 70px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          transition: opacity 0.15s;
        }
        #lf-img-search-panel img:hover {
          opacity: 0.8;
        }
      `;
      doc.head.appendChild(style);
    }

    // Enable contenteditable on marked elements
    const editables = Array.from(doc.querySelectorAll('[data-editable="true"]'));
    editables.forEach((el) => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });

    try { setHasPendingEdits(false); } catch { /* ignore */ }

    const onInput = () => { try { setHasPendingEdits(true); } catch { /* ignore */ } };
    doc.addEventListener('input', onInput, true);

    doc.body.setAttribute('data-lf-edit', 'on');
    assignImageIds(doc);

    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/+$/, '');

    // --- Image search panel ---
    const panelId = 'lf-img-search-panel';
    let panel = doc.getElementById(panelId);
    if (!panel) {
      panel = doc.createElement('div');
      panel.id = panelId;
      panel.style.cssText = [
        'display:none', 'position:absolute', 'z-index:2147483647',
        'width:340px', 'max-height:70vh', 'overflow:auto',
        'background:#0b1020', 'color:#f3f4f6',
        'border:1px solid rgba(255,255,255,0.12)', 'border-radius:8px',
        'box-shadow:0 8px 24px rgba(0,0,0,0.35)',
        'font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial',
      ].join(';');
      panel.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#0f172a;border-bottom:1px solid rgba(255,255,255,0.08);border-radius:8px 8px 0 0;">
          <h4 style="margin:0;font-size:12px;font-weight:600;color:#e5e7eb;">Reemplazar imagen</h4>
          <button id="lf-img-close" style="padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#111827;color:#e5e7eb;font-size:12px;cursor:pointer;">Cerrar</button>
        </div>
        <div style="padding:10px;">
          <div style="display:flex;gap:6px;margin-bottom:8px;align-items:center;flex-wrap:wrap;">
            <button id="lf-prov-pexels" style="padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#111827;color:#e5e7eb;font-size:11px;cursor:pointer;">Pexels</button>
            <button id="lf-prov-unsplash" style="padding:4px 8px;border-radius:6px;border:1px solid #10b981;background:#10b981;color:#0b1020;font-size:11px;cursor:pointer;">Unsplash</button>
            <span style="width:1px;height:20px;background:rgba(255,255,255,0.12);"></span>
            <button id="lf-prov-upload" style="padding:4px 8px;border-radius:6px;border:1px dashed rgba(255,255,255,0.35);background:#0b1020;color:#e5e7eb;font-size:11px;cursor:pointer;">Subir imagen</button>
          </div>
          <input id="lf-img-term" type="text" placeholder="Ej: panadería artesanal, barbería moderna" style="width:100%;padding:8px 10px;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:#0b1020;color:#f3f4f6;outline:none;font-size:12px;box-sizing:border-box;" />
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button id="lf-img-apply" style="padding:6px 10px;border-radius:6px;border:1px solid #ea580c;background:#ea580c;color:#fff;font-size:12px;cursor:pointer;">Aplicar</button>
            <button id="lf-img-suggest" style="padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:#111827;color:#e5e7eb;font-size:12px;cursor:pointer;">Sugerencias</button>
          </div>
          <div id="lf-img-presets" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
            <button data-add=", foto profesional, iluminación de estudio" style="padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:#0b1020;color:#e5e7eb;font-size:11px;cursor:pointer;">Calidad+</button>
            <button data-add=", producto en fondo blanco, 4k" style="padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:#0b1020;color:#e5e7eb;font-size:11px;cursor:pointer;">Producto</button>
            <button data-add=", comida gourmet, estilo editorial" style="padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:#0b1020;color:#e5e7eb;font-size:11px;cursor:pointer;">Gastronomía</button>
            <button data-add=", interior cálido, luz ambiental" style="padding:4px 8px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:#0b1020;color:#e5e7eb;font-size:11px;cursor:pointer;">Interiores</button>
          </div>
          <div id="lf-img-results" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px;"></div>
          <div style="font-size:11px;color:#94a3b8;margin-top:8px;">Consejo: usa prefijos u: (Unsplash) o p: (Pexels)</div>
        </div>
      `;
      doc.body.appendChild(panel);
      panel.dataset.provider = 'unsplash';
    }

    // Provider detection from search term
    const providerFromTerm = (raw) => {
      const term = raw.trim();
      if (/^(p:|pexels:)/i.test(term)) return { provider: 'pexels', query: term.replace(/^(p:|pexels:)/i, '').trim() };
      if (/^(u:|unsplash:)/i.test(term)) return { provider: 'unsplash', query: term.replace(/^(u:|unsplash:)/i, '').trim() };
      return { provider: 'unsplash', query: term };
    };

    // Toast notification inside iframe
    const showToast = (message) => {
      try { Array.from(doc.querySelectorAll('[data-lf-toast]')).forEach((el) => el.remove()); } catch { /* ignore */ }
      const toast = doc.createElement('div');
      toast.setAttribute('data-lf-toast', '1');
      toast.textContent = message;
      toast.style.cssText = [
        'position:fixed', 'left:50%', 'top:16px', 'transform:translateX(-50%)',
        'background:rgba(17,24,39,0.95)', 'color:#e5e7eb',
        'border:1px solid rgba(255,255,255,0.15)', 'border-radius:8px',
        'padding:8px 12px', 'font-size:12px', 'z-index:2147483647',
        'box-shadow:0 8px 24px rgba(0,0,0,0.35)',
      ].join(';');
      doc.body.appendChild(toast);
      setTimeout(() => { try { toast.remove(); } catch { /* ignore */ } }, 2200);
    };

    let lastTargetImgId = null;

    const openPanelForImage = (target) => {
      const id = target.getAttribute('data-lf-img-id');
      if (!id || !panel) return;
      lastTargetImgId = id;
      panel.dataset.targetId = id;
      const input = panel.querySelector('#lf-img-term');
      if (input) {
        const suggestion = (target.getAttribute('alt') || '').trim();
        input.value = suggestion || input.value || '';
      }
      const win = doc.defaultView || window;
      const rect = target.getBoundingClientRect();
      const scrollX = win.scrollX || doc.documentElement.scrollLeft || 0;
      const scrollY = win.scrollY || doc.documentElement.scrollTop || 0;
      const viewportW = win.innerWidth || doc.documentElement.clientWidth || 1000;
      const PANEL_W = 340;
      let left = rect.left + scrollX;
      if (left < 12) left = 12;
      if (left + PANEL_W > viewportW - 12) left = Math.max(12, viewportW - PANEL_W - 12) + scrollX;
      const top = rect.bottom + scrollY + 8;
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.display = 'block';
    };

    const onImgClick = (ev) => {
      openPanelForImage(ev.currentTarget);
    };

    // Make all images clickable for replacement
    let imgs = Array.from(doc.querySelectorAll('img[data-editable-image="true"]'));
    if (imgs.length === 0) {
      const allImgs = Array.from(doc.querySelectorAll('img'));
      imgs = allImgs.filter((im) => !(panel && panel.contains(im)));
      imgs.forEach((im) => im.setAttribute('data-editable-image', 'true'));
      assignImageIds(doc);
      imgs = Array.from(doc.querySelectorAll('img[data-editable-image="true"]')).filter((im) => !(panel && panel.contains(im)));
    }
    imgs.forEach((img) => img.addEventListener('click', onImgClick));

    // Also listen on parent containers for easier clicking
    const containerListeners = [];
    imgs.forEach((img) => {
      const parent = img.parentElement;
      if (!parent) return;
      const handler = (ev) => {
        const t = ev.target;
        if (panel && t && panel.contains(t)) return;
        openPanelForImage(img);
      };
      parent.addEventListener('click', handler, true);
      containerListeners.push({ el: parent, fn: handler });
      parent.setAttribute('data-lf-has-img-listener', '1');
      const id = img.getAttribute('data-lf-img-id');
      if (id) parent.setAttribute('data-lf-img-container', id);
    });

    // Panel elements
    const closeBtn = panel.querySelector('#lf-img-close');
    const applyBtn = panel.querySelector('#lf-img-apply');
    const suggestBtn = panel.querySelector('#lf-img-suggest');
    const termInput = panel.querySelector('#lf-img-term');
    const resultsDiv = panel.querySelector('#lf-img-results');
    const provUnsplash = panel.querySelector('#lf-prov-unsplash');
    const provPexels = panel.querySelector('#lf-prov-pexels');
    const btnUpload = panel.querySelector('#lf-prov-upload');
    const presetsDiv = panel.querySelector('#lf-img-presets');

    const hidePanel = () => { if (panel) panel.style.display = 'none'; if (resultsDiv) resultsDiv.innerHTML = ''; };

    const setProvider = (prov) => {
      if (!panel) return;
      panel.dataset.provider = prov;
      if (provPexels) {
        if (prov === 'pexels') { provPexels.style.background = '#10b981'; provPexels.style.borderColor = '#10b981'; provPexels.style.color = '#0b1020'; }
        else { provPexels.style.background = '#111827'; provPexels.style.borderColor = 'rgba(255,255,255,0.15)'; provPexels.style.color = '#e5e7eb'; }
      }
      if (provUnsplash) {
        if (prov === 'unsplash') { provUnsplash.style.background = '#10b981'; provUnsplash.style.borderColor = '#10b981'; provUnsplash.style.color = '#0b1020'; }
        else { provUnsplash.style.background = '#111827'; provUnsplash.style.borderColor = 'rgba(255,255,255,0.15)'; provUnsplash.style.color = '#e5e7eb'; }
      }
    };
    provPexels?.addEventListener('click', () => setProvider('pexels'));
    provUnsplash?.addEventListener('click', () => setProvider('unsplash'));

    // Upload handler
    const onUploadClick = () => {
      let tId = panel?.dataset.targetId || lastTargetImgId || '';
      if (!tId) {
        const first = doc.querySelector('img[data-editable-image="true"]');
        if (first) tId = first.getAttribute('data-lf-img-id') || '';
      }
      if (!tId) { showToast('Primero selecciona una imagen del contenido'); return; }
      const targetImg = doc.querySelector(`img[data-lf-img-id="${CSS.escape(tId)}"]`);
      if (!targetImg) return;
      const input = doc.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
      input.tabIndex = -1;
      doc.body.appendChild(input);
      const cleanup = () => { try { input.remove(); } catch { /* ignore */ } };
      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        cleanup();
        if (!file) return;
        const blobUrl = URL.createObjectURL(file);
        targetImg.setAttribute('src', blobUrl);
        targetImg.setAttribute('data-lf-provider', 'upload');
        targetImg.setAttribute('data-lf-upload-name', file.name || 'upload');
        targetImg.removeAttribute('data-lf-term');
        uploadFilesRef.current.set(tId, file);
        showToast('Vista previa local lista');
        try { setHasPendingEdits(true); } catch { /* ignore */ }
        hidePanel();
      }, { once: true });
      input.click();
    };
    btnUpload?.addEventListener('click', onUploadClick);
    setProvider(panel.dataset.provider || 'unsplash');

    // Preset quality tags
    const onPresetClick = (e) => {
      if (!termInput) return;
      const add = e.target?.getAttribute('data-add');
      if (!add) return;
      const base = termInput.value.trim();
      if (base.includes(add)) return;
      termInput.value = base ? `${base}${add}` : add.replace(/^,\s*/, '');
    };
    presetsDiv?.addEventListener('click', onPresetClick);

    // Apply: set image src to backend proxy URL
    const onApply = () => {
      const tId = panel?.dataset.targetId;
      if (!tId) return;
      const targetImg = doc.querySelector(`img[data-lf-img-id="${CSS.escape(tId)}"]`);
      if (!targetImg || !termInput) return;
      const raw = termInput.value || '';
      if (!raw.trim()) return;
      let sel = providerFromTerm(raw);
      if (!/^(p:|pexels:|u:|unsplash:)/i.test(raw)) {
        const prov = panel?.dataset.provider || 'unsplash';
        sel = { provider: prov, query: sel.query };
      }
      const url = `${apiUrl}/api/image/${sel.provider}?term=${encodeURIComponent(sel.query)}`;
      targetImg.setAttribute('src', url);
      targetImg.setAttribute('data-lf-term', sel.query);
      targetImg.setAttribute('data-lf-provider', sel.provider);
      // Fallback: if pexels fails, try unsplash
      if (!targetImg.__lfFallbackHooked__) {
        targetImg.__lfFallbackHooked__ = true;
        targetImg.addEventListener('error', () => {
          try {
            const prov = targetImg.getAttribute('data-lf-provider');
            if (prov === 'pexels' && !targetImg.__lfTriedFallback__) {
              targetImg.__lfTriedFallback__ = true;
              targetImg.setAttribute('src', `${apiUrl}/api/image/unsplash?term=${encodeURIComponent(sel.query)}`);
              targetImg.setAttribute('data-lf-provider', 'unsplash');
              showToast('Pexels no respondió; usando Unsplash');
            }
          } catch { /* ignore */ }
        });
      }
      try { setHasPendingEdits(true); } catch { /* ignore */ }
      hidePanel();
    };

    // Suggest: search API and show thumbnail grid
    const onSuggest = async () => {
      if (!termInput || !resultsDiv) return;
      const q = termInput.value.trim();
      if (!q) return;
      resultsDiv.innerHTML = '<div style="font-size:12px;color:#94a3b8;">Buscando...</div>';
      const activeProv = panel?.dataset.provider || 'unsplash';
      try {
        // Use backend proxy for suggestions to avoid exposing API keys
        const res = await fetch(`${apiUrl}/api/image/${activeProv}?term=${encodeURIComponent(q)}&suggest=true`);
        if (res.ok && res.headers.get('content-type')?.includes('json')) {
          const data = await res.json();
          const items = data?.results || data?.photos || [];
          if (!items.length) { resultsDiv.innerHTML = '<div style="font-size:12px;color:#94a3b8;">Sin resultados</div>'; return; }
          resultsDiv.innerHTML = '';
          items.slice(0, 9).forEach((it) => {
            const img = doc.createElement('img');
            img.src = it?.urls?.small || it?.urls?.thumb || it?.src?.medium || it?.src?.small || '';
            img.alt = it?.alt_description || it?.alt || q;
            img.title = 'Click para usar este término';
            img.addEventListener('click', () => { if (termInput) termInput.value = (it?.alt_description || it?.alt || q).toString(); });
            resultsDiv.appendChild(img);
          });
        } else {
          // Backend returned the image directly, just show it as a preview
          resultsDiv.innerHTML = '<div style="font-size:12px;color:#94a3b8;">Usa "Aplicar" para establecer la imagen</div>';
        }
      } catch {
        resultsDiv.innerHTML = '<div style="font-size:12px;color:#fca5a5;">Error buscando imágenes</div>';
      }
    };

    closeBtn?.addEventListener('click', () => hidePanel());
    applyBtn?.addEventListener('click', onApply);
    suggestBtn?.addEventListener('click', onSuggest);

    // Close panel on click outside
    const onDocClick = (e) => {
      if (!panel) return;
      const target = e.target;
      const isImgEditable = !!(target?.closest && target.closest('img[data-editable-image="true"]'));
      if (panel.style.display !== 'none' && target && !panel.contains(target) && !isImgEditable) {
        hidePanel();
      }
    };
    doc.addEventListener('click', onDocClick, true);

    // Teardown function for cleanup
    doc.__lfTeardown__ = () => {
      imgs.forEach((img) => img.removeEventListener('click', onImgClick));
      containerListeners.forEach(({ el, fn }) => {
        try { el.removeEventListener('click', fn, true); } catch { /* ignore */ }
        try { el.removeAttribute('data-lf-has-img-listener'); } catch { /* ignore */ }
        try { el.removeAttribute('data-lf-img-container'); } catch { /* ignore */ }
      });
      closeBtn?.removeEventListener('click', () => hidePanel());
      applyBtn?.removeEventListener('click', onApply);
      suggestBtn?.removeEventListener('click', onSuggest);
      if (btnUpload) btnUpload.removeEventListener('click', onUploadClick);
      if (panel) panel.style.display = 'none';
      doc.removeEventListener('click', onDocClick, true);
      if (presetsDiv) presetsDiv.removeEventListener('click', onPresetClick);
      doc.removeEventListener('input', onInput, true);
      try { Array.from(doc.querySelectorAll('[data-lf-toast]')).forEach((el) => el.remove()); } catch { /* ignore */ }
      doc.body.removeAttribute('data-lf-edit');
    };
  }, [iframeRef, uploadFilesRef, setHasPendingEdits]);

  const disableEditingInIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    try { if (doc.__lfTeardown__) doc.__lfTeardown__(); } catch { /* ignore */ }
    const editables = Array.from(doc.querySelectorAll('[data-editable="true"]'));
    editables.forEach((el) => el.removeAttribute('contenteditable'));
    const panel = doc.getElementById('lf-img-search-panel');
    if (panel) panel.style.display = 'none';
    doc.body.removeAttribute('data-lf-edit');
  }, [iframeRef]);

  return { enableEditingInIframe, disableEditingInIframe };
}
