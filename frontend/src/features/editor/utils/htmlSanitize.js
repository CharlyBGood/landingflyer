/**
 * Produce a publishable/persistable snapshot of the iframe document,
 * stripped of editor-only artifacts.
 */
export function extractCleanHtml(iframeDoc) {
  if (!iframeDoc) return null;

  const htmlEl = iframeDoc.documentElement.cloneNode(true);

  htmlEl
    .querySelectorAll('[contenteditable]')
    ?.forEach((el) => el.removeAttribute('contenteditable'));

  htmlEl.querySelector('body')?.removeAttribute('data-lf-edit');
  htmlEl.querySelector('#lf-img-search-panel')?.remove();
  htmlEl.querySelector('#lf-edit-style')?.remove();
  htmlEl.querySelectorAll('[data-lf-toast]')?.forEach((el) => el.remove());

  return '<!DOCTYPE html>' + htmlEl.outerHTML;
}

/**
 * Imperatively wipe any edit-mode artifacts from a live iframe document,
 * used when leaving edit mode without re-rendering the whole doc.
 */
export function stripEditModeFromDoc(iframeDoc) {
  if (!iframeDoc) return;
  try {
    iframeDoc.body?.removeAttribute('data-lf-edit');
    iframeDoc.getElementById('lf-img-search-panel')?.remove();
    iframeDoc.getElementById('lf-edit-style')?.remove();
    iframeDoc
      .querySelectorAll('[contenteditable]')
      .forEach((el) => el.removeAttribute('contenteditable'));
    iframeDoc
      .querySelectorAll('[data-lf-toast]')
      .forEach((el) => el.remove());
  } catch {
    /* ignore */
  }
}
