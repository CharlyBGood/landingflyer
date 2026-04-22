import { useEffect, useState } from 'react';

const EMPTY = {
  hasSelection: false,
  rect: null,
  text: '',
  anchor: null,
  inEditable: false,
};

/**
 * Observes the text selection inside the iframe and reports:
 * - bounding rect (in iframe viewport coords)
 * - selected plain text
 * - closest enclosing <a> (if any)
 * - whether the selection lies within a [contenteditable="true"] element
 *
 * Consumers typically translate the rect into page coords using
 * iframe.getBoundingClientRect() before positioning UI.
 */
export function useIframeSelection({ iframeRef, enabled, refreshKey }) {
  const [sel, setSel] = useState(EMPTY);

  useEffect(() => {
    if (!enabled) {
      setSel(EMPTY);
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    const win = iframe?.contentWindow;
    if (!doc || !win) return;

    let rafId = 0;

    const compute = () => {
      rafId = 0;
      const selection = doc.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setSel(EMPTY);
        return;
      }

      const range = selection.getRangeAt(0);
      const text = selection.toString();

      const container = range.commonAncestorContainer;
      const el = container.nodeType === 1 ? container : container.parentElement;
      if (!el) { setSel(EMPTY); return; }

      const editable = el.closest?.('[contenteditable="true"]');
      const anchor = el.closest?.('a');

      if (!editable && !anchor) {
        setSel(EMPTY);
        return;
      }

      let rect = null;
      if (!selection.isCollapsed) {
        const r = range.getBoundingClientRect();
        if (r && (r.width > 0 || r.height > 0)) {
          rect = { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
        }
      } else if (anchor) {
        const r = anchor.getBoundingClientRect();
        rect = { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
      }

      if (!rect) {
        setSel(EMPTY);
        return;
      }

      setSel({
        hasSelection: !selection.isCollapsed,
        rect,
        text,
        anchor: anchor || null,
        inEditable: Boolean(editable),
      });
    };

    const schedule = () => {
      if (rafId) return;
      rafId = win.requestAnimationFrame(compute);
    };

    const clear = () => setSel(EMPTY);

    doc.addEventListener('selectionchange', schedule);
    doc.addEventListener('mouseup', schedule, true);
    doc.addEventListener('keyup', schedule, true);
    win.addEventListener('scroll', clear, true);
    win.addEventListener('resize', clear);

    return () => {
      if (rafId) win.cancelAnimationFrame(rafId);
      doc.removeEventListener('selectionchange', schedule);
      doc.removeEventListener('mouseup', schedule, true);
      doc.removeEventListener('keyup', schedule, true);
      win.removeEventListener('scroll', clear, true);
      win.removeEventListener('resize', clear);
    };
  }, [iframeRef, enabled, refreshKey]);

  return sel;
}
