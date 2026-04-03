import { sha1Hash, slugify } from '../utils/helpers.js';
import { uploadToCloudinary } from './cloudinary.js';
import { getUnsplashImageUrl } from './unsplash.js';
import { getPexelsImageUrl } from './pexels.js';
import type { Env } from '../types.js';

/** Check if a URL is a proxy image URL (/api/image/unsplash or /api/image/pexels) */
function isProxyImageUrl(value: string): boolean {
  return /^(?:https?:\/\/[^'"\s]+)?\/api\/image\/(unsplash|pexels)\?/i.test(value.trim());
}

/** Make relative proxy URLs absolute */
function ensureAbsoluteProxyUrls(html: string, baseUrl: string): string {
  if (!baseUrl) return html;

  const base = baseUrl.replace(/\/$/, '');
  let result = html;

  // src attributes
  result = result.replace(/(src=["'])(\/api\/image\/[^"'>\s]+)(["'])/g, `$1${base}$2$3`);

  // srcset attributes
  result = result.replace(/(srcset=["'])([^"']+)(["'])/g, (_match, prefix, value, suffix) => {
    const updated = value
      .split(',')
      .map((entry: string) => {
        const trimmed = entry.trim();
        if (!trimmed) return trimmed;
        const parts = trimmed.split(/\s+/);
        if (parts[0].startsWith('/api/image/')) {
          parts[0] = `${base}${parts[0]}`;
        }
        return parts.join(' ');
      })
      .join(', ');
    return `${prefix}${updated}${suffix}`;
  });

  // url() in CSS
  result = result.replace(
    /url\((['"]?)(\/api\/image\/[^'")]+)(['"]?)\)/g,
    `url($1${base}$2$3)`
  );

  return result;
}

/** Collect all proxy image URLs from HTML */
function collectProxyUrls(html: string): string[] {
  const urls = new Set<string>();

  // <img src="...">
  const srcMatches = html.matchAll(/src=["']([^"']+)["']/g);
  for (const m of srcMatches) {
    if (isProxyImageUrl(m[1])) urls.add(m[1]);
  }

  // srcset
  const srcsetMatches = html.matchAll(/srcset=["']([^"']+)["']/g);
  for (const m of srcsetMatches) {
    for (const entry of m[1].split(',')) {
      const url = entry.trim().split(/\s+/)[0];
      if (url && isProxyImageUrl(url)) urls.add(url);
    }
  }

  // url() in style blocks and inline styles
  const urlMatches = html.matchAll(/url\((['"]?)([^'")\s]+)\1\)/g);
  for (const m of urlMatches) {
    if (isProxyImageUrl(m[2])) urls.add(m[2]);
  }

  return Array.from(urls);
}

/** Collect Cloudinary preview URLs that need migration */
function collectPreviewCloudinaryUrls(html: string): string[] {
  const urls = new Set<string>();
  const regex = /https?:\/\/res\.cloudinary\.com\/[^'"\s)]+\/landingflyer\/preview\/[^'"\s)]+/g;
  const matches = html.matchAll(regex);
  for (const m of matches) {
    urls.add(m[0]);
  }
  return Array.from(urls);
}

/**
 * Process images in HTML: either make URLs absolute (preview) or rehost to Cloudinary (publish).
 */
export async function processImagesAndReplaceSrc(
  htmlContent: string,
  siteName: string,
  env: Env,
  options: { mode?: 'preview' | 'publish'; baseImageUrl?: string } = {}
): Promise<string> {
  const { mode = 'publish', baseImageUrl = '' } = options;

  // Preview mode: just make URLs absolute
  if (mode === 'preview') {
    return ensureAbsoluteProxyUrls(htmlContent, baseImageUrl);
  }

  // Publish mode: rehost all images to Cloudinary
  const siteSlug = slugify(siteName);
  const folder = `landingflyer/${siteSlug}`;
  const srcMap = new Map<string, string>();
  const cacheByHash = new Map<string, string>();

  const cloudinaryEnv = {
    CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
  };

  // Helper: fetch real image from provider, upload to Cloudinary
  async function rehostProviderUrl(originalSrc: string): Promise<void> {
    try {
      const qs = originalSrc.split('?')[1] || '';
      const searchTerm = new URLSearchParams(qs).get('term');
      if (!searchTerm) return;

      let realImageUrl: string | null = null;
      if (/unsplash/i.test(originalSrc)) {
        realImageUrl = await getUnsplashImageUrl(searchTerm, env.UNSPLASH_ACCESS_KEY, env.IMAGE_CACHE);
      } else if (/pexels/i.test(originalSrc)) {
        realImageUrl = await getPexelsImageUrl(searchTerm, env.PEXELS_API_KEY, env.IMAGE_CACHE);
      }
      if (!realImageUrl) return;

      const resp = await fetch(realImageUrl);
      if (!resp.ok) return;
      const buf = await resp.arrayBuffer();
      const hash = await sha1Hash(buf);
      const key = `buf:${hash}`;

      if (cacheByHash.has(key)) {
        srcMap.set(originalSrc, cacheByHash.get(key)!);
        return;
      }

      const publicId = `img-${hash}`;
      const url = await uploadToCloudinary(buf, publicId, folder, cloudinaryEnv);
      cacheByHash.set(key, url);
      srcMap.set(originalSrc, url);
    } catch (e) {
      console.error('[html-processor] rehostProviderUrl error:', (e as Error).message);
    }
  }

  // Helper: migrate Cloudinary preview URL to site folder
  async function migratePreviewUrl(previewUrl: string): Promise<void> {
    try {
      const resp = await fetch(previewUrl);
      if (!resp.ok) return;
      const buf = await resp.arrayBuffer();
      const hash = await sha1Hash(buf);
      const key = `buf:${hash}`;

      if (cacheByHash.has(key)) {
        srcMap.set(previewUrl, cacheByHash.get(key)!);
        return;
      }

      const publicId = `img-${hash}`;
      const url = await uploadToCloudinary(buf, publicId, folder, cloudinaryEnv);
      cacheByHash.set(key, url);
      srcMap.set(previewUrl, url);
    } catch (e) {
      console.error('[html-processor] migratePreviewUrl error:', (e as Error).message);
    }
  }

  // Collect and process all URLs in parallel
  const proxyUrls = collectProxyUrls(htmlContent);
  const previewUrls = collectPreviewCloudinaryUrls(htmlContent);

  await Promise.all([
    ...proxyUrls.map(u => rehostProviderUrl(u)),
    ...previewUrls.map(u => migratePreviewUrl(u)),
  ]);

  // Replace all URLs in the HTML
  let finalHtml = htmlContent;
  for (const [originalSrc, cloudUrl] of srcMap.entries()) {
    const escaped = originalSrc.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    finalHtml = finalHtml.replace(new RegExp(escaped, 'g'), cloudUrl);
  }

  return finalHtml;
}
