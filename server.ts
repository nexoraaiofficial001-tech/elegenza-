import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultSiteConfig } from './shared/siteConfig.js';
import { seedMenuItems, seedCategories, seedPromos, seedTables } from './shared/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory working state for server-side endpoints
let serverMenuItems = [...seedMenuItems];
let serverOrders: any[] = [];
let serverReservations: any[] = [];
let serverStaffCalls: any[] = [];

// ═══ API V1 ROUTES ═══

// Health check
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    brand: defaultSiteConfig.brandName,
  });
});

// Public: Site Config & Settings
app.get('/api/v1/settings', (_req: Request, res: Response) => {
  res.json({ success: true, data: defaultSiteConfig });
});

// Public: Menu & Categories
app.get('/api/v1/menu', (_req: Request, res: Response) => {
  res.json({ success: true, data: serverMenuItems });
});

app.get('/api/v1/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: seedCategories });
});

// Promo Validation
app.post('/api/v1/promos/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  const found = seedPromos.find((p) => p.code.toUpperCase() === String(code || '').trim().toUpperCase());
  if (!found || !found.active) {
    return res.status(400).json({ success: false, error: { message: 'Invalid or expired promo code.' } });
  }
  if (subtotal < found.minOrder) {
    return res.status(400).json({ success: false, error: { message: `Minimum order of Rs ${found.minOrder} required.` } });
  }
  return res.json({ success: true, data: found });
});

// Orders creation
app.post('/api/v1/orders', (req: Request, res: Response) => {
  const orderData = req.body;
  const count = String(serverOrders.length + 1).padStart(4, '0');
  const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const orderNumber = `ELG-${today}-${count}`;

  const newOrder = {
    ...orderData,
    id: 'ord_' + Date.now(),
    orderNumber,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  serverOrders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

// Get order by ID
app.get('/api/v1/orders/:id', (req: Request, res: Response) => {
  const order = serverOrders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: { message: 'Order not found.' } });
  }
  res.json({ success: true, data: order });
});

// Table Staff Assistance
app.post('/api/v1/staff-calls', (req: Request, res: Response) => {
  const { tableNo, type } = req.body;
  const call = {
    id: 'call_' + Date.now(),
    tableNo,
    type,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  serverStaffCalls.unshift(call);
  res.status(201).json({ success: true, data: call });
});

// Reservations
app.post('/api/v1/reservations', (req: Request, res: Response) => {
  const resData = req.body;
  const code = `RES-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${serverReservations.length + 1}`;
  const newRes = {
    ...resData,
    id: 'res_' + Date.now(),
    reservationCode: code,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  serverReservations.unshift(newRes);
  res.status(201).json({ success: true, data: newRes });
});

// ═══ VITE MIDDLEWARE (DEV) OR STATIC FILES (PROD) ═══
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Vite dev middleware mounted in Express
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ Cafe Eleganza full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
