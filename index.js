//index.js

const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const parkingRoutes = require('./src/routes/parkingRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/parkings', parkingRoutes);
app.use('/api/bookings', bookingRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TixPark API is running',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  =============================================
  🚀 Server berjalan di port ${PORT}
  =============================================
  Endpoints:
  - Auth:     http://localhost:${PORT}/api/auth
  - Parkings: http://localhost:${PORT}/api/parkings
  - Bookings: http://localhost:${PORT}/api/bookings
  `);
});