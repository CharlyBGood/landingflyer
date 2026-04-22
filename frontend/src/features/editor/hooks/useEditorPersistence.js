import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEYS = {
  WORKING: 'editableHtml',
  ORIGINAL: 'originalTemplate',
};

const EMPTY_PLACEHOLDER = '<h1>No hay contenido...</h1>';

/**
 * Centralises the localStorage contract for the editor.
 *
 * Returns:
 * - html: current working HTML
 * - setHtml(next): update in-memory HTML (does NOT persist)
 * - save(next): persist and update lastSaved
 * - reset(): revert to originalTemplate (if present), persist
 * - lastSavedHtml: snapshot used for discard / dirty comparison
 */
export function useEditorPersistence() {
  const [html, setHtml] = useState('');
  const lastSavedRef = useRef('');

  useEffect(() => {
    const working = localStorage.getItem(STORAGE_KEYS.WORKING) || EMPTY_PLACEHOLDER;
    const original = localStorage.getItem(STORAGE_KEYS.ORIGINAL);

    setHtml(working);
    lastSavedRef.current = working;

    if (!original) {
      localStorage.setItem(STORAGE_KEYS.ORIGINAL, working);
    }

    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.WORKING && e.newValue) {
        setHtml(e.newValue);
        lastSavedRef.current = e.newValue;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const save = useCallback((next) => {
    setHtml(next);
    lastSavedRef.current = next;
    localStorage.setItem(STORAGE_KEYS.WORKING, next);
  }, []);

  const reset = useCallback(() => {
    const original = localStorage.getItem(STORAGE_KEYS.ORIGINAL);
    if (!original) return null;
    setHtml(original);
    lastSavedRef.current = original;
    localStorage.setItem(STORAGE_KEYS.WORKING, original);
    return original;
  }, []);

  const getLastSaved = useCallback(() => lastSavedRef.current, []);

  return { html, setHtml, save, reset, getLastSaved };
}
