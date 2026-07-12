const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());

// Parse raw body for Stripe Webhook signature verification
app.use('/api/funding/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// SPA build static folder path
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

async function startServer() {
  // Connect to Database (determines real vs mock Mongoose)
  await connectDB();

  // Load routes after cache overrides are complete
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/users');
  const donationRoutes = require('./routes/donations');
  const fundingRoutes = require('./routes/funding');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/funding', fundingRoutes);
  app.use('/api/create-payment-intent', (req, res, next) => {
    req.url = '/create-payment-intent';
    next();
  }, fundingRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
  });

  // React Router refresh fallback fix
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
      if (err) {
        res.json({ message: 'Welcome to the Blood Donation API', status: 'healthy' });
      }
    });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
