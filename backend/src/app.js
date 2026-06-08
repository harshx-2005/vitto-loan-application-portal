const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRouter = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Headers
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // Vite default development port
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vitto Loan Portal API is healthy and operational',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api', apiRouter);

// Catch-all 404 handler for undefined routes
app.use((req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
