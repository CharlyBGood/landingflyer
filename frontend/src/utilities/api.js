/**
 * api.js - Centralized API client
 *
 * All requests to the backend go through here, ensuring:
 * - Consistent base URL from VITE_API_URL
 * - X-API-Key header on every request
 */

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/+$/, '');
export const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Returns headers object with API key included
 */
export function apiHeaders(extra = {}) {
  const headers = { ...extra };
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }
  return headers;
}

/**
 * Fetch wrapper that injects API key header
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const headers = apiHeaders(options.headers || {});
  return fetch(url, { ...options, headers });
}
