import { load } from 'cheerio';
import axios from 'axios';
import { URLSearchParams } from 'url';
import crypto from 'crypto';

import { uploadImageToCloudinary } from './cloudinaryService.js';
import { getUnsplashImageUrl } from './UnsplashService.js';

// Descarga la imagen desde una URL pública y la sube a Cloudinary
async function uploadImageFromUrl(imageUrl, publicId, folder) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    if (!response.data || response.status !== 200) {
      console.error('[Cloudinary] Error descargando imagen:', imageUrl, response.status);
      throw new Error('No se pudo descargar la imagen');
    }
    const buffer = Buffer.from(response.data);
    const url = await uploadImageToCloudinary(buffer, publicId, folder);
    return url;
  } catch (err) {
    console.error('[Cloudinary] Error en uploadImageFromUrl:', imageUrl, err.message);
    throw err;
  }
}

function slugify(input) {
  return (input || 'site')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'site';
}

function hashBuffer(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 20);
}

function ensureAbsoluteProxyUrls(htmlContent, baseImageUrl) {
  if (!baseImageUrl) {
    return htmlContent;
  }

  const normalizedBase = baseImageUrl.replace(/\/$/, '');
  let updatedHtml = htmlContent;

  const absolutize = (input) => {
    if (!input) return input;
    const trimmed = input.trim();
    if (/^(?:[a-z]+:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
      return trimmed;
    }
    if (trimmed.startsWith('/api/image/')) {
      return `${normalizedBase}${trimmed}`;
    }
    return trimmed;
  };

  updatedHtml = updatedHtml.replace(/(src=["'])([^"'>\s]+)(["'])/g, (match, prefix, url, suffix) => {
    const absolute = absolutize(url);
    return absolute === url ? match : `${prefix}${absolute}${suffix}`;
  });

  updatedHtml = updatedHtml.replace(/(srcset=["'])([^"']+)(["'])/g, (match, prefix, value, suffix) => {
    const entries = value.split(',').map((entry) => {
      const trimmed = entry.trim();
      if (!trimmed) return trimmed;
      const parts = trimmed.split(/\s+/);
      const url = parts[0];
      const descriptor = parts.slice(1).join(' ');
      const absolute = absolutize(url);
      return descriptor ? `${absolute} ${descriptor}` : absolute;
    });
    const joined = entries.join(', ');
    return `${prefix}${joined}${suffix}`;
  });

  updatedHtml = updatedHtml.replace(/url\((['"]?)(\/api\/image\/[^'"\)]+)(['"]?)\)/g, (match, quoteStart, path, quoteEnd) => {
    const absolute = absolutize(path);
    const closingQuote = typeof quoteEnd === 'string' && quoteEnd.length ? quoteEnd : quoteStart;
    return `url(${quoteStart}${absolute}${closingQuote})`;
  });

  return updatedHtml;
}

function isProxyImageUrl(value) {
  if (!value) return false;
  const trimmed = value.trim();
  return /^(?:https?:\/\/[^'"\s]+)?\/api\/image\/(unsplash|pexels)\?/i.test(trimmed);
}

/**
 * Sube todas las imágenes del HTML a Cloudinary y reemplaza los src por las URLs públicas, manteniendo el HTML original intacto.
 * @param {string} htmlContent - HTML original.
 * @param {string} siteName - Nombre/carpeta destino en Cloudinary.
 * @param {object} [options]
 * @param {'preview'|'publish'} [options.mode='publish'] - Controla el comportamiento de rehosteo.
 * @param {boolean} [options.rehost] - Forzar rehost o deshabilitarlo explícitamente.
 * @param {string} [options.baseImageUrl] - URL base para rutas /api/image cuando no se rehostea.
 * @returns {Promise<string>} HTML con URLs finales.
 */
export async function processImagesAndReplaceSrc(htmlContent, siteName, options = {}) {
  const {
    mode = 'publish',
    rehost,
    baseImageUrl = ''
  } = options;

  const shouldRehost = typeof rehost === 'boolean' ? rehost : mode !== 'preview';

  if (!shouldRehost) {
    return ensureAbsoluteProxyUrls(htmlContent, baseImageUrl);
  }

  const $ = load(htmlContent, { decodeEntities: false });
  const srcMap = new Map(); // originalUrl -> cloudinaryUrl
  const cacheByKey = new Map(); // cacheKey -> cloudinaryUrl

  const siteSlug = slugify(siteName);
  const folder = `landingflyer/${siteSlug}`;

  const styleBlocks = $('style');

  // 1) Recolectar URLs de <img src> que sean proxies /api/image/(unsplash|pexels)
  const imgElements = $('img');
  const srcsToReplace = [];
  imgElements.each((i, el) => {
    const src = $(el).attr('src');
    if (!src) return;
    if (isProxyImageUrl(src)) {
      srcsToReplace.push(src);
    }
    const srcset = $(el).attr('srcset');
    if (srcset) {
      // srcset: comma-separated list of "url [descriptor]"
      srcset.split(',').forEach(part => {
        const url = (part || '').trim().split('\u0020')[0]; // split on space
        if (url && isProxyImageUrl(url)) {
          srcsToReplace.push(url);
        }
      });
    }
  });

  // 2) URLs en <style> embebidos (background-image, etc.)
  const styleUrls = [];
  styleBlocks.each((i, el) => {
    const css = $(el).html();
    if (!css) return;
    const matches = [...css.matchAll(/url\((['"]?)([^'"\)]+)\1\)/g)];
    matches.forEach((m) => {
      const candidate = m[2];
      if (isProxyImageUrl(candidate)) {
        styleUrls.push(candidate);
      }
    });
  });

  // 3) URLs en atributos style inline
  const inlineStyleUrls = [];
  $('[style]').each((i, el) => {
    const style = $(el).attr('style');
    if (!style) return;
    const matches = [...style.matchAll(/url\((['"]?)([^'"\)]+)\1\)/g)];
    matches.forEach((m) => {
      const candidate = m[2];
      if (isProxyImageUrl(candidate)) {
        inlineStyleUrls.push(candidate);
      }
    });
  });

  // 4) Migración de URLs Cloudinary antiguas del folder preview
  const cloudinaryPreviewUrls = [];
  const collectCloudinary = (val) => {
    if (!val) return;
    if (/https?:\/\/res\.cloudinary\.com\//i.test(val) && /\/landingflyer\/preview\//i.test(val)) {
      cloudinaryPreviewUrls.push(val);
    }
  };
  imgElements.each((i, el) => collectCloudinary($(el).attr('src')));
  styleBlocks.each((i, el) => {
    const css = $(el).html();
    if (!css) return;
    const matches = [...css.matchAll(/url\((['"]?)(https?:\/\/res\.cloudinary\.com\/[^'"\)]+)\1\)/g)];
    matches.forEach(m => collectCloudinary(m[2]));
  });
  $('[style]').each((i, el) => {
    const style = $(el).attr('style');
    if (!style) return;
    const matches = [...style.matchAll(/url\((['"]?)(https?:\/\/res\.cloudinary\.com\/[^'"\)]+)\1\)/g)];
    matches.forEach(m => collectCloudinary(m[2]));
  });

  // Unificar y deduplicar
  const proxyUrls = Array.from(new Set([...srcsToReplace, ...styleUrls, ...inlineStyleUrls])).filter(Boolean);
  const previewUrls = Array.from(new Set(cloudinaryPreviewUrls));

  // Helper: subir imagen real desde proveedor (Unsplash/Pexels) y mapear
  async function rehostProviderUrl(originalSrc) {
    try {
      const qs = originalSrc.split('?')[1] || '';
      const searchTerm = new URLSearchParams(qs).get('term');
      if (!searchTerm) {
        console.warn(`[Cloudinary] No se encontró term en: ${originalSrc}`);
        return;
      }
      let realImageUrl = null;
      if (/unsplash/i.test(originalSrc)) {
        try { realImageUrl = await getUnsplashImageUrl(searchTerm); }
        catch (err) { console.error('[Cloudinary] Unsplash URL fail:', err?.message || err); return; }
      } else if (/pexels/i.test(originalSrc)) {
        try { const { getPexelsImageUrl } = await import('./PexelsService.js'); realImageUrl = await getPexelsImageUrl(searchTerm); }
        catch (err) { console.error('[Cloudinary] Pexels URL fail:', err?.message || err); return; }
      } else {
        return;
      }
      if (!realImageUrl) return;

      // Descarga para generar hash y subir
      const resp = await axios.get(realImageUrl, { responseType: 'arraybuffer' });
      if (resp.status !== 200 || !resp.data) return;
      const buf = Buffer.from(resp.data);
      const h = hashBuffer(buf);
      const key = `buf:${h}`;
      if (cacheByKey.has(key)) { srcMap.set(originalSrc, cacheByKey.get(key)); return; }
      const publicId = `img-${h}`;
      const url = await uploadImageToCloudinary(buf, publicId, folder);
      if (url) { cacheByKey.set(key, url); srcMap.set(originalSrc, url); }
    } catch (e) {
      console.error('[Cloudinary] rehostProviderUrl error:', e?.message || e);
    }
  }

  // Helper: migrar una URL Cloudinary del folder preview al folder del sitio
  async function migratePreviewUrl(previewUrl) {
    try {
      const resp = await axios.get(previewUrl, { responseType: 'arraybuffer' });
      if (resp.status !== 200 || !resp.data) return;
      const buf = Buffer.from(resp.data);
      const h = hashBuffer(buf);
      const key = `buf:${h}`;
      if (cacheByKey.has(key)) { srcMap.set(previewUrl, cacheByKey.get(key)); return; }
      const publicId = `img-${h}`;
      const url = await uploadImageToCloudinary(buf, publicId, folder);
      if (url) { cacheByKey.set(key, url); srcMap.set(previewUrl, url); }
    } catch (e) {
      console.error('[Cloudinary] migratePreviewUrl error:', e?.message || e);
    }
  }

  // 5) Ejecutar rehosting en paralelo (limitado por Promise.all del tamaño actual)
  await Promise.all([
    ...proxyUrls.map((u) => rehostProviderUrl(u)),
    ...previewUrls.map((u) => migratePreviewUrl(u)),
  ]);

  // 6) Reemplazar en el HTML original
  let finalHtml = htmlContent;
  const replaceAll = (originalSrc, cloudUrl) => {
    if (!originalSrc || !cloudUrl) return;
    const safe = originalSrc.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // <img src>
    finalHtml = finalHtml.replace(new RegExp(`(<img[^>]+src=["'])${safe}(["'])`, 'g'), `$1${cloudUrl}$2`);
    // url('...') in CSS
    finalHtml = finalHtml.replace(new RegExp(`url\\(\\s*(["'\`]?)${safe}\\1\\s*\\)`, 'g'), `url('${cloudUrl}')`);
    // srcset attributes (replace raw occurrences as a fallback)
    finalHtml = finalHtml.replace(new RegExp(safe, 'g'), cloudUrl);
  };
  for (const [originalSrc, cloudUrl] of srcMap.entries()) {
    replaceAll(originalSrc, cloudUrl);
  }

  return finalHtml;
}
