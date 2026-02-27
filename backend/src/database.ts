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
      id SERIAL PRIMARY KEY,

      county_name TEXT NOT NULL,
      city_name TEXT NOT NULL DEFAULT '',

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

      tax_rate_id INT NOT NULL REFERENCES tax_rates(id),
      //похідні, щоб не рахуватти кожного разу
      tax_amount NUMERIC(12,2) NOT NULL,
      total_amount NUMERIC(12,2) NOT NULL
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_tax_rate_id ON orders(tax_rate_id);`);
}