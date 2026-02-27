import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

//тут прописати метод створення таблиць і викликати його при старті сервева
export async function initDb() {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tax_rates (
      id_tax SERIAL PRIMARY KEY,

      county_name TEXT NOT NULL,
      city_name TEXT,  -- nullable,

      state_rate NUMERIC(6,5) NOT NULL,
      county_rate NUMERIC(6,5) NOT NULL,
      city_rate NUMERIC(6,5) NOT NULL,
      special_rate NUMERIC(6,5) NOT NULL,
      composite_rate NUMERIC(6,5) NOT NULL,

      UNIQUE (county_name, city_name)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,

      subtotal NUMERIC(12,2) NOT NULL,

      tax_rate_id INT NOT NULL REFERENCES tax_rates(id_tax),

      tax_amount NUMERIC(12,2) NOT NULL,
      total_amount NUMERIC(12,2) NOT NULL
    );
  `);
  
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_tax_rate_id ON orders(tax_rate_id);`);
}