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

    // Create promotions table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        banner_url TEXT,
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        discount_type TEXT CHECK (discount_type IN ('percentage','fixed','weighted')),
        percentage_rate NUMERIC,
        fixed_amount NUMERIC,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);

    // Ensure new promotion columns exist on existing tables
    await pool.query(`
      ALTER TABLE promotions ADD COLUMN IF NOT EXISTS description TEXT;
    `);
    await pool.query(`
      ALTER TABLE promotions ADD COLUMN IF NOT EXISTS banner_url TEXT;
    `);
    await pool.query(`
      ALTER TABLE promotions ADD COLUMN IF NOT EXISTS discount_type TEXT CHECK (discount_type IN ('percentage','fixed','weighted'));
    `);
    await pool.query(`
      ALTER TABLE promotions ADD COLUMN IF NOT EXISTS percentage_rate NUMERIC;
    `);
    await pool.query(`
      ALTER TABLE promotions ADD COLUMN IF NOT EXISTS fixed_amount NUMERIC;
    `);

    // Slabs table for weighted promotions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotion_slabs (
        id SERIAL PRIMARY KEY,
        promotion_id INTEGER NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
        min_weight NUMERIC NOT NULL,
        max_weight NUMERIC NOT NULL,
        unit_weight NUMERIC NOT NULL,
        unit_discount NUMERIC NOT NULL
      );
    `);

    // Orders tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_address TEXT,
        customer_phone TEXT,
        notes TEXT,
        promotion_id INTEGER REFERENCES promotions(id),
        shipping_cost NUMERIC NOT NULL DEFAULT 0,
        subtotal NUMERIC NOT NULL,
        total_discount NUMERIC NOT NULL,
        grand_total NUMERIC NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
      );
    `);
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Created';
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        unit_price NUMERIC NOT NULL,
        quantity INTEGER NOT NULL,
        unit_weight NUMERIC NOT NULL,
        line_subtotal NUMERIC NOT NULL,
        line_discount NUMERIC NOT NULL,
        line_total NUMERIC NOT NULL
      );
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