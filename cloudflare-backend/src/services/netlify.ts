import JSZip from 'jszip';
import type { NetlifyDeployResult } from '../types.js';

const NETLIFY_API = 'https://api.netlify.com/api/v1';

/** Validate and fix HTML to ensure correct rendering */
function validateAndFixHTML(htmlContent: string): string {
  let html = htmlContent.trim();

  const hasDoctype = html.includes('<!DOCTYPE');
  const hasHtmlTag = html.includes('<html');
  const hasHeadTag = html.includes('<head');
  const hasBodyTag = html.includes('<body');

  if (!hasDoctype || !hasHtmlTag || !hasHeadTag || !hasBodyTag) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Landing Page';

    let bodyContent = html
      .replace(/<!DOCTYPE[^>]*>/i, '')
      .replace(/<html[^>]*>/i, '')
      .replace(/<\/html>/i, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
      .replace(/<body[^>]*>/i, '')
      .replace(/<\/body>/i, '')
      .trim();

    html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
${bodyContent}
</body>
</html>`;
  } else {
    if (!html.includes('<!DOCTYPE html>')) {
      html = html.replace(/<!DOCTYPE[^>]*>/i, '<!DOCTYPE html>');
    }
    if (!html.includes('charset=') && !html.includes('<meta charset')) {
      html = html.replace(/(<head[^>]*>)/i, '$1\n    <meta charset="UTF-8">');
    }
    if (!html.includes('viewport')) {
      html = html.replace(
        /(<head[^>]*>)/i,
        '$1\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
    }
  }

  return html;
}

/** Extract title from HTML */
export function extractTitleFromHTML(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1]?.trim() ?? '';
}

/** Generate a valid Netlify site name */
export function generateSiteName(baseName: string): string {
  let siteName = baseName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (siteName.length < 3) siteName = 'landing-page';

  const timestamp = Date.now().toString().slice(-6);
  const finalName = `${siteName}-${timestamp}`;

  if (finalName.length > 63) {
    const maxBase = 63 - timestamp.length - 1;
    return `${siteName.substring(0, maxBase)}-${timestamp}`;
  }

  return finalName;
}

/** Deploy a site to Netlify using the ZIP method */
export async function deployToNetlify(
  siteName: string,
  htmlContent: string,
  apiToken: string
): Promise<NetlifyDeployResult> {
  const validHTML = validateAndFixHTML(htmlContent);

  // Create ZIP in memory
  const zip = new JSZip();
  zip.file('index.html', validHTML);
  zip.file('_headers', `/*
  Content-Type: text/html; charset=utf-8
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=0, must-revalidate

/*.html
  Content-Type: text/html; charset=utf-8

/index.html
  Content-Type: text/html; charset=utf-8`);

  const zipBuffer = await zip.generateAsync({
    type: 'arraybuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    'User-Agent': 'LandingFlyer/2.0.0 (Cloudflare Worker)',
  };

  // Step 1: Create site with custom name
  const siteResponse = await fetch(`${NETLIFY_API}/sites`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: siteName }),
  });

  if (!siteResponse.ok) {
    const error = await siteResponse.text();
    throw new Error(`Netlify site creation error ${siteResponse.status}: ${error}`);
  }

  const siteData = await siteResponse.json<{
    id: string;
    name: string;
    ssl_url?: string;
    url: string;
  }>();

  // Step 2: Deploy ZIP to the created site
  const deployResponse = await fetch(`${NETLIFY_API}/sites/${siteData.id}/deploys`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/zip',
      'Content-Length': zipBuffer.byteLength.toString(),
    },
    body: zipBuffer,
  });

  if (!deployResponse.ok) {
    const error = await deployResponse.text();
    throw new Error(`Netlify deploy error ${deployResponse.status}: ${error}`);
  }

  const deployData = await deployResponse.json<{ id: string }>();

  return {
    success: true,
    siteId: siteData.id,
    siteName: siteData.name,
    url: siteData.ssl_url || siteData.url,
    deployId: deployData.id,
  };
}
