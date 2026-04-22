import { API_URL, API_KEY, apiHeaders } from '../../../utilities/api.js';

const PROVIDERS = ['unsplash', 'pexels'];

/**
 * Returns the backend proxy URL for a provider query. The proxy keeps
 * third-party API keys off the client.
 */
export function buildImageProxyUrl(provider, query) {
  const keyParam = API_KEY ? `&key=${encodeURIComponent(API_KEY)}` : '';
  const prov = PROVIDERS.includes(provider) ? provider : 'unsplash';
  return `${API_URL}/api/image/${prov}?term=${encodeURIComponent(query)}${keyParam}`;
}

/**
 * Parses a search term and returns { provider, query }. Supports prefixes:
 *   u:/unsplash:  → unsplash
 *   p:/pexels:    → pexels
 * Otherwise falls back to defaultProvider.
 */
export function providerFromTerm(raw, defaultProvider = 'unsplash') {
  const term = (raw || '').trim();
  if (/^(p:|pexels:)/i.test(term)) {
    return { provider: 'pexels', query: term.replace(/^(p:|pexels:)/i, '').trim() };
  }
  if (/^(u:|unsplash:)/i.test(term)) {
    return { provider: 'unsplash', query: term.replace(/^(u:|unsplash:)/i, '').trim() };
  }
  return { provider: defaultProvider, query: term };
}

/**
 * Applies a provider query as the source of the given image element.
 * Wires a one-shot error handler so a pexels failure falls back to unsplash.
 */
export function applyProviderImage(img, { provider, query }) {
  if (!img || !query) return;
  const url = buildImageProxyUrl(provider, query);
  img.setAttribute('src', url);
  img.setAttribute('data-lf-term', query);
  img.setAttribute('data-lf-provider', provider);
  img.removeAttribute('data-lf-upload-name');

  if (!img.__lfFallbackHooked__) {
    img.__lfFallbackHooked__ = true;
    img.addEventListener('error', function onErr() {
      try {
        const prov = img.getAttribute('data-lf-provider');
        if (prov === 'pexels' && !img.__lfTriedFallback__) {
          img.__lfTriedFallback__ = true;
          img.setAttribute('src', buildImageProxyUrl('unsplash', query));
          img.setAttribute('data-lf-provider', 'unsplash');
        }
      } catch { /* ignore */ }
    });
  }
}

/**
 * Applies a locally uploaded File as the image's source (blob URL preview).
 * Registers the File in `uploadFilesRef` keyed by the image's lf-img-id so
 * the publish flow can multipart-upload it later.
 */
export function applyUploadImage(img, file, uploadFilesRef) {
  if (!img || !file) return;
  const blobUrl = URL.createObjectURL(file);
  img.setAttribute('src', blobUrl);
  img.setAttribute('data-lf-provider', 'upload');
  img.setAttribute('data-lf-upload-name', file.name || 'upload');
  img.removeAttribute('data-lf-term');
  const id = img.getAttribute('data-lf-img-id');
  if (id && uploadFilesRef?.current) {
    uploadFilesRef.current.set(id, file);
  }
}

/**
 * Calls the search proxy with `suggest=true` and returns a normalised list:
 *   [{ thumb, alt }]
 * Handles both unsplash and pexels shapes. Returns [] on any error.
 */
export async function searchImages({ provider, query, signal }) {
  const prov = PROVIDERS.includes(provider) ? provider : 'unsplash';
  const url = `${API_URL}/api/image/${prov}?term=${encodeURIComponent(query)}&suggest=true`;
  try {
    const res = await fetch(url, { headers: apiHeaders(), signal });
    if (!res.ok) return [];
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) return [];
    const data = await res.json();
    const items = data?.results || data?.photos || [];
    return items.slice(0, 9).map((it) => ({
      thumb: it?.urls?.small || it?.urls?.thumb || it?.src?.medium || it?.src?.small || '',
      alt: it?.alt_description || it?.alt || query,
    })).filter((it) => it.thumb);
  } catch {
    return [];
  }
}
