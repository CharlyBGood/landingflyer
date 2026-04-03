import { Hono } from 'hono';
import type { Env } from '../types.js';

const status = new Hono<{ Bindings: Env }>();

/**
 * GET /api/deploy-status/:siteId/:deployId
 * Returns deploy status (always ready for ZIP method).
 */
status.get('/:siteId/:deployId', async (c) => {
  return c.json({
    state: 'ready',
    ready: true,
    message: 'Deploy completado con ZIP Method atómico',
  });
});

export default status;
