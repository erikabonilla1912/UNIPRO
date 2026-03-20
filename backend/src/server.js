require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Rutas API
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor UNIPRO corriendo en http://localhost:${PORT}`);
});

module.exports = app;
