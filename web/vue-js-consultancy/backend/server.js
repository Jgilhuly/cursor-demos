import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import servicesRouter from './routes/services.js';
import teamRouter from './routes/team.js';
import contactRouter from './routes/contact.js';
import faqRouter from './routes/faq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/services', servicesRouter);
app.use('/api/team', teamRouter);
app.use('/api/contact', contactRouter);
app.use('/api/faq', faqRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'NeuraLink AI Backend'
  });
});

// Basic info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'NeuraLink AI Backend',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/services',
      '/api/team',
      '/api/contact',
      '/api/faq'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested endpoint does not exist' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NeuraLink AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
