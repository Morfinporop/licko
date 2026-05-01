import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import supportRoutes from './routes/support.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for Railway
app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../data/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'BioLink' });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

// Serve static frontend
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  
  // SPA fallback - serve index.html for all non-API, non-upload, non-health routes
  app.use((req, res, next) => {
    // Skip if it's an API route, upload, or health check
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/uploads/') || 
        req.path === '/health') {
      return next();
    }
    
    // Skip if it's a static file (has extension)
    const hasExtension = path.extname(req.path) !== '';
    if (hasExtension) {
      return next();
    }
    
    // Serve index.html for SPA routes
    res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
      if (err) {
        res.status(500).send('Error loading page');
      }
    });
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'BioLink API running. Frontend not built yet.' });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BioLink server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
