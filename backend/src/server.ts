import app from './app';
import pool from './config/database';

const PORT = process.env.PORT || 3000;

// Test database connection and start server
const startServer = async () => {
  try {
    // Run simple startup migrations for products table (dev-safe, idempotent)
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
    `);
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS weight NUMERIC NOT NULL DEFAULT 1;
    `);
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_unit TEXT DEFAULT 'kg';
    `);

    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection established');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

startServer();