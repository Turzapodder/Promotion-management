import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING || 'postgresql://localhost:5432/practice_db'
});

export default pool;
