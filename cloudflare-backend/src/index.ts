import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types.js';
import imageRoutes from './routes/image.js';
import generateRoutes from './routes/generate.js';
import publishRoutes from './routes/publish.js';
import statusRoutes from './routes/status.js';

const app = new Hono<{ Bindings: Env }>();

// CORS for all origins (same as Express backend)
app.use('*', cors());

// Mount routes
app.route('/api/image', imageRoutes);
app.route('/api/generate-preview', generateRoutes);
app.route('/api/publish', publishRoutes);
app.route('/api/deploy-status', statusRoutes);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', runtime: 'cloudflare-workers' }));

export default app;
