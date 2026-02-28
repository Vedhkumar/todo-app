import pool from './db.js';

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id        SERIAL PRIMARY KEY,
      title     TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ Database migration complete');
}
