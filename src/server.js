require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedEmisores = require('./config/seed');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Conectar a MongoDB y luego correr seed
(async () => {
  await connectDB();
  await seedEmisores();
})();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'factura-app-backend' }));

// Rutas
app.use('/api/facturas', require('./routes/facturas'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/emisores', require('./routes/emisores'));

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});