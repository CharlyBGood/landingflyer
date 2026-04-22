import { useLayoutEffect, useRef, useState } from 'react';
import { BoldIcon, ItalicIcon, LinkIcon, UnlinkIcon, ExternalLinkIcon } from '../../../utilities/Icons.jsx';

const TOOLBAR_GAP = 10;

/**
 * Floating context toolbar positioned above a text selection inside the iframe.
 *
 * Rect is in iframe viewport coords; we translate into page coords using the
 * iframe's own bounding rect. The toolbar uses position:fixed so those viewport
 * coords map 1:1 without scroll math.
 */
export default function SelectionToolbar({
  visible,
  rect,
  iframeRef,
  hasAnchor,
  anchorHref,
  onBold,
  onItalic,
  onLink,
  onUnlink,
  onOpenLink,
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!visible || !rect || !iframeRef.current || !ref.current) {
      setPos(null);
      return;
    }
    const iframeRect = iframeRef.current.getBoundingClientRect();
    const toolbarRect = ref.current.getBoundingClientRect();
    const toolbarW = toolbarRect.width || 180;
    const toolbarH = toolbarRect.height || 40;

    const centerX = iframeRect.left + rect.left + rect.width / 2;
    let top = iframeRect.top + rect.top - toolbarH - TOOLBAR_GAP;
    let left = centerX - toolbarW / 2;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    if (top < 8) {
      // No room above → place below the selection.
      top = iframeRect.top + rect.bottom + TOOLBAR_GAP;
    }
    if (top + toolbarH > viewportH - 8) top = viewportH - toolbarH - 8;
    if (left < 8) left = 8;
    if (left + toolbarW > viewportW - 8) left = viewportW - toolbarW - 8;

    setPos({ top, left });
  }, [visible, rect, iframeRef]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Formato de texto"
      onMouseDown={(e) => e.preventDefault()}
      className="
        fixed z-50
        flex items-center gap-0.5
        px-1.5 py-1 rounded-xl
        bg-sinapsia-base/95 backdrop-blur
        border border-sinapsia-accent/50
        shadow-[0_6px_24px_rgba(0,0,0,0.35)]
      "
      style={{
        top: pos ? `${pos.top}px` : '-9999px',
        left: pos ? `${pos.left}px` : '-9999px',
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      <ToolbarBtn onClick={onBold} label="Negrita (Ctrl+B)" icon={<BoldIcon size={16} />} />
      <ToolbarBtn onClick={onItalic} label="Cursiva (Ctrl+I)" icon={<ItalicIcon size={16} />} />
      <span className="mx-0.5 w-px h-5 bg-sinapsia-accent/40" aria-hidden="true" />
      <ToolbarBtn
        onClick={onLink}
        label={hasAnchor ? 'Editar enlace' : 'Crear enlace'}
        icon={<LinkIcon size={16} />}
        active={hasAnchor}
      />
      {hasAnchor && (
        <>
          <ToolbarBtn
            onClick={onOpenLink}
            label={anchorHref ? `Abrir ${anchorHref}` : 'Abrir enlace'}
            icon={<ExternalLinkIcon size={14} />}
          />
          <ToolbarBtn
            onClick={onUnlink}
            label="Quitar enlace"
            icon={<UnlinkIcon size={16} />}
          />
        </>
      )}
    </div>
  );
}

function ToolbarBtn({ onClick, label, icon, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center
        w-8 h-8 rounded-md
        transition-colors duration-100
        focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:ring-offset-1 focus:ring-offset-sinapsia-base
        ${active
          ? 'bg-sinapsia-accent/25 text-sinapsia-light'
          : 'text-sinapsia-light/85 hover:text-sinapsia-light hover:bg-sinapsia-accent/20'}
      `}
    >
      {icon}
    </button>
  );
}
