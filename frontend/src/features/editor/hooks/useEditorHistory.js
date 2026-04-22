import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_STACK = 50;
const DEBOUNCE_MS = 400;

/**
 * Lightweight undo/redo stack over the iframe body's innerHTML.
 *
 * Design:
 * - Snapshots are taken on `input` events inside the iframe, debounced.
 * - Stacks are capped at MAX_STACK entries (FIFO eviction on overflow).
 * - Undo/redo replace body.innerHTML wholesale. Callers should provide
 *   `onRestore` to re-wire any event handlers after a restore.
 * - Version state forces re-renders so button disabled states stay fresh.
 */
export function useEditorHistory({ iframeRef, enabled, onRestore, onChange }) {
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const lastSnapshotRef = useRef('');
  const debounceTimerRef = useRef(null);
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const snapshot = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;
    const html = doc.body.innerHTML;
    if (html === lastSnapshotRef.current) return;
    undoStackRef.current.push(lastSnapshotRef.current);
    if (undoStackRef.current.length > MAX_STACK) undoStackRef.current.shift();
    redoStackRef.current = [];
    lastSnapshotRef.current = html;
    bump();
  }, [iframeRef, bump]);

  const flushPending = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
      snapshot();
    }
  }, [snapshot]);

  const restore = useCallback(
    (html) => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc?.body) return;
      doc.body.innerHTML = html;
      lastSnapshotRef.current = html;
      try { onRestore?.(); } catch { /* ignore */ }
      try { onChange?.(); } catch { /* ignore */ }
      bump();
    },
    [iframeRef, onRestore, onChange, bump]
  );

  const undo = useCallback(() => {
    flushPending();
    if (undoStackRef.current.length === 0) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;
    const prev = undoStackRef.current.pop();
    redoStackRef.current.push(doc.body.innerHTML);
    restore(prev);
  }, [iframeRef, restore, flushPending]);

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;
    const next = redoStackRef.current.pop();
    undoStackRef.current.push(doc.body.innerHTML);
    restore(next);
  }, [iframeRef, restore]);

  const reset = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    lastSnapshotRef.current = iframeRef.current?.contentDocument?.body?.innerHTML || '';
    bump();
  }, [iframeRef, bump]);

  useEffect(() => {
    if (!enabled) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    lastSnapshotRef.current = doc.body?.innerHTML || '';
    undoStackRef.current = [];
    redoStackRef.current = [];
    bump();

    const onInput = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        snapshot();
      }, DEBOUNCE_MS);
    };

    const onKey = (e) => {
      const isMac = typeof navigator !== 'undefined'
        && /mac/i.test(navigator.platform || navigator.userAgent || '');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    doc.addEventListener('input', onInput, true);
    doc.addEventListener('keydown', onKey, true);

    return () => {
      doc.removeEventListener('input', onInput, true);
      doc.removeEventListener('keydown', onKey, true);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [enabled, iframeRef, snapshot, undo, redo, bump]);

  return {
    undo,
    redo,
    reset,
    snapshot,
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    _version: version,
  };
}
