import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { XMarkIcon, ImageIcon } from '../../../utilities/Icons.jsx';
import { searchImages } from '../utils/imageCommands.js';

const PRESETS = [
  { label: 'Calidad+', add: ', foto profesional, iluminación de estudio' },
  { label: 'Producto', add: ', producto en fondo blanco, 4k' },
  { label: 'Gastronomía', add: ', comida gourmet, estilo editorial' },
  { label: 'Interiores', add: ', interior cálido, luz ambiental' },
];

const PANEL_WIDTH = 340;
const PANEL_GAP = 10;

/**
 * React image picker anchored to the clicked image. Replaces the legacy
 * DOM-injected panel that lived inside the iframe. All actions delegate
 * through the provided callbacks; the panel itself is pure UI.
 */
export default function ImagePickerPanel({
  open,
  imageRect,
  iframeRef,
  defaultTerm = '',
  onClose,
  onApply,
  onUpload,
}) {
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const [provider, setProvider] = useState('unsplash');
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | empty | error
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!open) return;
    setTerm(defaultTerm || '');
    setResults([]);
    setStatus('idle');
    setProvider('unsplash');
    // Focus input after render
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open, defaultTerm]);

  // Abort in-flight search when closing.
  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
    }
  }, [open]);

  // Position relative to the iframe image rect.
  useLayoutEffect(() => {
    if (!open || !imageRect || !iframeRef.current || !panelRef.current) {
      setPos(null);
      return;
    }
    const iframeRect = iframeRef.current.getBoundingClientRect();
    const panelH = panelRef.current.getBoundingClientRect().height || 300;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = iframeRect.left + imageRect.left;
    if (left + PANEL_WIDTH > viewportW - 12) left = viewportW - PANEL_WIDTH - 12;
    if (left < 12) left = 12;

    let top = iframeRect.top + imageRect.bottom + PANEL_GAP;
    if (top + panelH > viewportH - 12) {
      // Flip above the image if there's no room below.
      const above = iframeRect.top + imageRect.top - panelH - PANEL_GAP;
      top = above > 12 ? above : Math.max(12, viewportH - panelH - 12);
    }
    setPos({ top, left });
  }, [open, imageRect, iframeRef]);

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Click outside to close.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target)) return;
      onClose?.();
    };
    // Defer to next tick so the click that opened the panel doesn't close it.
    const t = setTimeout(() => {
      window.addEventListener('mousedown', onMouseDown);
    }, 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [open, onClose]);

  const runSearch = useCallback(async () => {
    if (!term.trim()) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStatus('loading');
    const items = await searchImages({ provider, query: term.trim(), signal: ctrl.signal });
    if (ctrl.signal.aborted) return;
    setResults(items);
    setStatus(items.length ? 'idle' : 'empty');
  }, [provider, term]);

  const handleApply = () => {
    if (!term.trim()) return;
    onApply?.({ provider, query: term.trim() });
  };

  const handleUpload = (file) => {
    if (!file) return;
    onUpload?.(file);
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Reemplazar imagen"
      className="
        fixed z-50
        w-[340px] max-h-[70vh] overflow-auto
        rounded-xl
        bg-sinapsia-base/95 backdrop-blur
        border border-sinapsia-accent/50
        shadow-[0_10px_30px_rgba(0,0,0,0.45)]
        text-sinapsia-light
      "
      style={{
        top: pos ? `${pos.top}px` : '-9999px',
        left: pos ? `${pos.left}px` : '-9999px',
        visibility: pos ? 'visible' : 'hidden',
        width: `${PANEL_WIDTH}px`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-sinapsia-accent/30 bg-portfolio-base/40 rounded-t-xl">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ImageIcon size={16} />
          Reemplazar imagen
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar panel"
          className="p-1 rounded-md text-sinapsia-light/70 hover:text-sinapsia-light hover:bg-sinapsia-accent/20 focus:outline-none focus:ring-2 focus:ring-sinapsia-accent"
        >
          <XMarkIcon size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Provider tabs */}
        <div className="flex items-center gap-1.5">
          <ProviderTab
            active={provider === 'unsplash'}
            onClick={() => setProvider('unsplash')}
            label="Unsplash"
          />
          <ProviderTab
            active={provider === 'pexels'}
            onClick={() => setProvider('pexels')}
            label="Pexels"
          />
          <div className="flex-1" />
          <UploadButton onFile={handleUpload} />
        </div>

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
          }}
          placeholder="Ej: panadería artesanal, barbería moderna"
          className="
            w-full px-3 py-2 text-sm rounded-lg
            bg-portfolio-base/60 border border-sinapsia-accent/40
            placeholder:text-sinapsia-light/40
            focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:border-sinapsia-accent
          "
        />

        {/* Action row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApply}
            disabled={!term.trim()}
            className="
              px-3 py-2 text-sm font-semibold rounded-lg
              text-white bg-sinapsia-accent hover:bg-sinapsia-accent/90
              disabled:bg-sinapsia-accent/40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:ring-offset-2 focus:ring-offset-sinapsia-base
            "
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={runSearch}
            disabled={!term.trim() || status === 'loading'}
            className="
              px-3 py-2 text-sm rounded-lg
              text-sinapsia-light/85 hover:text-sinapsia-light
              bg-portfolio-base/60 hover:bg-portfolio-base
              border border-sinapsia-accent/40
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-sinapsia-accent
            "
          >
            {status === 'loading' ? 'Buscando…' : 'Sugerir'}
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setTerm((prev) => {
                  const base = prev.trim();
                  if (base.includes(p.add)) return prev;
                  return base ? `${base}${p.add}` : p.add.replace(/^,\s*/, '');
                });
              }}
              className="
                px-2.5 py-1 text-xs rounded-full
                text-sinapsia-light/80 hover:text-sinapsia-light
                bg-portfolio-base/40 hover:bg-portfolio-base
                border border-sinapsia-accent/30
                focus:outline-none focus:ring-2 focus:ring-sinapsia-accent
              "
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {status === 'empty' && (
          <p className="text-xs text-sinapsia-light/60">Sin resultados para ese término.</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-300">Error buscando imágenes.</p>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5">
            {results.map((it, i) => (
              <button
                key={`${it.thumb}-${i}`}
                type="button"
                onClick={() => setTerm(it.alt)}
                title="Usar este término"
                className="relative overflow-hidden rounded-md border border-sinapsia-accent/30 hover:border-sinapsia-accent focus:outline-none focus:ring-2 focus:ring-sinapsia-accent"
              >
                <img
                  src={it.thumb}
                  alt={it.alt}
                  className="w-full h-16 object-cover transition-opacity hover:opacity-80"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-sinapsia-light/50">
          Consejo: usa prefijos <code>u:</code> o <code>p:</code> para forzar proveedor.
        </p>
      </div>
    </div>
  );
}

function ProviderTab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        px-2.5 py-1 text-xs rounded-md font-medium
        border transition-colors duration-100
        focus:outline-none focus:ring-2 focus:ring-sinapsia-accent
        ${active
          ? 'bg-sinapsia-accent text-white border-sinapsia-accent'
          : 'bg-portfolio-base/60 text-sinapsia-light/80 border-sinapsia-accent/40 hover:bg-portfolio-base'}
      `}
    >
      {label}
    </button>
  );
}

function UploadButton({ onFile }) {
  const ref = useRef(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) onFile(f);
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="
          px-2.5 py-1 text-xs rounded-md font-medium
          border border-dashed border-sinapsia-accent/50
          text-sinapsia-light/85 hover:text-sinapsia-light
          hover:bg-sinapsia-accent/15
          focus:outline-none focus:ring-2 focus:ring-sinapsia-accent
        "
      >
        Subir
      </button>
    </>
  );
}
