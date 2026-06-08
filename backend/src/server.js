require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Vitto Loan Portal API is running!`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});

// Graceful Shutdown on SIGINT or SIGTERM
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    
    try {
      await prisma.$disconnect();
      console.log('Prisma database client disconnected.');
      process.exit(0);
    } catch (err) {
      console.error('Error during Prisma disconnect:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('Force shutting down as graceful close timed out.');
    process.exit(1);
  }, 10);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Global Exception/Rejection Handlers to prevent abrupt crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});
