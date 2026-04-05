import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types.js';
import imageRoutes from './routes/image.js';
import generateRoutes from './routes/generate.js';
import publishRoutes from './routes/publish.js';
import statusRoutes from './routes/status.js';

const app = new Hono<{ Bindings: Env }>();

// --- CAPA 1: CORS restringido ---
// Solo permite requests desde tus dominios
const ALLOWED_ORIGINS = [
  // LandingFlyer (Vercel)
  'https://landingflyer.vercel.app',
  'https://landingflyer.sinapsialab.com',
  'https://landingflyer-charlybgoods-projects.vercel.app',
  // SinapsiaLab (Namecheap / Vercel)
  'https://sinapsialab.com',
  'https://www.sinapsialab.com',
  'https://sinapsialab-astro.vercel.app',
  // Dev local
  'http://localhost:5173', // Vite
  'http://localhost:4321', // Astro
];

app.use('*', cors({
  origin: (origin) => {
    // Permitir Vercel preview deploys (*.vercel.app)
    if (origin && /^https:\/\/(landingflyer|sinapsialab)[a-z0-9-]*\.vercel\.app$/.test(origin)) {
      return origin;
    }
    return ALLOWED_ORIGINS.includes(origin) ? origin : '';
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key'],
  maxAge: 86400, // Cache preflight 24h
}));

// --- CAPA 2: API Key validation ---
// Requiere header X-API-Key en rutas /api/*
// El health check queda abierto para monitoreo
app.use('/api/*', async (c, next) => {
  const expectedKey = c.env.API_KEY;

  // Si no hay API_KEY configurada como secret, skip (para no romper durante setup)
  if (!expectedKey) {
    await next();
    return;
  }

  // Aceptar API key via header O query param (para img src que no pueden enviar headers)
  const apiKey = c.req.header('X-API-Key') || c.req.query('key');

  if (!apiKey || apiKey !== expectedKey) {
    return c.json({ error: 'Unauthorized', message: 'Missing or invalid API key' }, 401);
  }

  await next();
});

// --- CAPA 3: Rate limiting básico por IP ---
// Usa KV para trackear requests por IP (límite: 30 req/min)
const RATE_LIMIT = 30;
const RATE_WINDOW = 60; // segundos

app.use('/api/*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  const key = `ratelimit:${ip}`;

  try {
    const current = await c.env.IMAGE_CACHE.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= RATE_LIMIT) {
      return c.json(
        { error: 'Too Many Requests', message: 'Rate limit exceeded. Try again in a minute.' },
        429
      );
    }

    // Ejecutar la ruta primero
    await next();

    // Incrementar contador después de responder
    c.executionCtx.waitUntil(
      c.env.IMAGE_CACHE.put(key, String(count + 1), { expirationTtl: RATE_WINDOW })
    );
  } catch {
    // Si falla el rate limiting, dejar pasar (no bloquear por errores de KV)
    await next();
  }
});

// Mount routes
app.route('/api/image', imageRoutes);
app.route('/api/generate-preview', generateRoutes);
app.route('/api/publish', publishRoutes);
app.route('/api/deploy-status', statusRoutes);

// Health check (público, sin API key ni rate limit)
app.get('/health', (c) => c.json({ status: 'ok', runtime: 'cloudflare-workers' }));

export default app;
