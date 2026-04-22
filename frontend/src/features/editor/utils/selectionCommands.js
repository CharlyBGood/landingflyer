/**
 * Runs a document.execCommand on the iframe document. Handles the focus
 * requirement (execCommand only acts on the active document's selection).
 */
export function execIframeCommand(iframeDoc, command, value = null) {
  if (!iframeDoc) return false;
  try {
    iframeDoc.execCommand(command, false, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Snapshot the first Range of the iframe selection. Useful before opening
 * a modal (which takes focus and typically clears the iframe's selection).
 */
export function captureSelectionRange(iframeDoc) {
  try {
    const sel = iframeDoc?.getSelection?.();
    if (!sel || sel.rangeCount === 0) return null;
    return sel.getRangeAt(0).cloneRange();
  } catch {
    return null;
  }
}

/**
 * Restore a previously captured Range into the iframe's Selection.
 */
export function restoreSelectionRange(iframeDoc, range) {
  try {
    const sel = iframeDoc?.getSelection?.();
    if (!sel || !range) return false;
    sel.removeAllRanges();
    sel.addRange(range);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns the closest ancestor <a> that fully contains the given Range,
 * or null if the selection spans anchor boundaries / isn't inside one.
 */
export function anchorForRange(range) {
  if (!range) return null;
  const node = range.commonAncestorContainer;
  const el = node.nodeType === 1 ? node : node.parentElement;
  return el?.closest?.('a') || null;
}

/**
 * Apply a link to a captured Range. If the range is inside an existing anchor,
 * mutates it (href / target / rel / optional new text). Otherwise wraps the
 * range's contents in a new <a>. If the range is collapsed and no anchor is
 * present, inserts a fresh anchor with the provided text at the caret.
 *
 * `text` is optional — when null/empty the existing selection text is kept.
 */
export function applyLinkToRange(iframeDoc, range, { href, text, target }) {
  if (!iframeDoc || !range || !href) return null;

  const existing = anchorForRange(range);
  const safeTarget = target === '_blank' ? '_blank' : null;
  const rel = safeTarget === '_blank' ? 'noopener noreferrer' : null;

  if (existing) {
    existing.setAttribute('href', href);
    if (safeTarget) {
      existing.setAttribute('target', safeTarget);
      existing.setAttribute('rel', rel);
    } else {
      existing.removeAttribute('target');
      existing.removeAttribute('rel');
    }
    if (text && text !== existing.textContent) {
      existing.textContent = text;
    }
    return existing;
  }

  const anchor = iframeDoc.createElement('a');
  anchor.setAttribute('href', href);
  if (safeTarget) {
    anchor.setAttribute('target', safeTarget);
    anchor.setAttribute('rel', rel);
  }

  if (range.collapsed) {
    anchor.textContent = text || href;
    range.insertNode(anchor);
  } else {
    const contents = range.extractContents();
    if (text) {
      anchor.textContent = text;
    } else {
      anchor.appendChild(contents);
    }
    range.insertNode(anchor);
  }

  return anchor;
}

/**
 * Replace an anchor with its children (unwrap).
 */
export function unwrapAnchor(anchor) {
  if (!anchor || !anchor.parentNode) return;
  const parent = anchor.parentNode;
  while (anchor.firstChild) parent.insertBefore(anchor.firstChild, anchor);
  parent.removeChild(anchor);
}

/**
 * After a DOM mutation inside the iframe, dispatch a synthetic 'input' event
 * so listeners (dirty flag, undo history) react. contenteditable typing
 * fires input automatically, but manual DOM edits do not.
 */
export function dispatchSyntheticInput(iframeDoc) {
  try {
    iframeDoc?.body?.dispatchEvent(new (iframeDoc.defaultView?.Event || Event)('input', { bubbles: true }));
  } catch {
    /* ignore */
  }
}
