const STORAGE_KEYS = {
  generatedHtml: 'lf_generated_html',
  siteName: 'lf_site_name',
  businessData: 'lf_business_data',
};

function readStorage(storage, key) {
  try {
    return storage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore quota/privacy errors.
  }
}

export function loadPreviewState() {
  const sessionHtml = readStorage(sessionStorage, STORAGE_KEYS.generatedHtml);
  const localHtml = readStorage(localStorage, STORAGE_KEYS.generatedHtml);
  const legacyEditable = readStorage(localStorage, 'editableHtml');
  const legacyOriginal = readStorage(localStorage, 'originalTemplate');

  const sessionSiteName = readStorage(sessionStorage, STORAGE_KEYS.siteName);
  const localSiteName = readStorage(localStorage, STORAGE_KEYS.siteName);

  return {
    html: sessionHtml || localHtml || legacyEditable || legacyOriginal || '',
    siteName: (sessionSiteName || localSiteName || '').trim(),
  };
}

export function saveGeneratedPreview({ html, siteName = '', businessData = null }) {
  if (!html) return;

  writeStorage(sessionStorage, STORAGE_KEYS.generatedHtml, html);
  writeStorage(localStorage, STORAGE_KEYS.generatedHtml, html);

  writeStorage(localStorage, 'editableHtml', html);
  writeStorage(localStorage, 'originalTemplate', html);

  if (siteName) {
    writeStorage(sessionStorage, STORAGE_KEYS.siteName, siteName);
    writeStorage(localStorage, STORAGE_KEYS.siteName, siteName);
  }

  if (businessData) {
    const serialized = JSON.stringify(businessData);
    writeStorage(sessionStorage, STORAGE_KEYS.businessData, serialized);
    writeStorage(localStorage, STORAGE_KEYS.businessData, serialized);
  }
}

export function saveEditedPreviewHtml(html) {
  if (!html) return;

  writeStorage(sessionStorage, STORAGE_KEYS.generatedHtml, html);
  writeStorage(localStorage, STORAGE_KEYS.generatedHtml, html);
  writeStorage(localStorage, 'editableHtml', html);
}

export function savePreviewSiteName(siteName) {
  const normalized = (siteName || '').trim();
  writeStorage(sessionStorage, STORAGE_KEYS.siteName, normalized);
  writeStorage(localStorage, STORAGE_KEYS.siteName, normalized);
}
