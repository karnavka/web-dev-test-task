import { pool } from "../database";
import { findTaxRateByCountyCity } from "./tax.service";
import { getCountyCityByLatLonNY } from "./coordLookup";
import { TaxRateRow } from "./tax.service";
export type CreateOrderInput = {
    subtotal: number;
    latitude: number;
    longitude: number;
    signal?: AbortSignal;
};
function round(x: number) {
    return Math.round(x * 100) / 100;
}

function normalizeCountyName(name: string): string {
  return name.replace(/\s+County$/i, "").trim();
}

function normalizeCityName(name: string): string {
  return name.replace(/\s+town$/i, "").trim();
}

export async function createOrderFromLatLon(input: CreateOrderInput) {
  const { subtotal, latitude, longitude } = input;

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Subtotal must be a non-negative number");
  }

  const location = await getCountyCityByLatLonNY(latitude, longitude);

  const county = normalizeCountyName(location.county);
  const city = normalizeCityName(location.city);

  let taxRateResult = await pool.query(
    `
    SELECT *
    FROM tax_rates
    WHERE county_name = $1
      AND city_name = $2
    LIMIT 1
    `,
    [county, city]
  );

  if (taxRateResult.rows.length === 0) {
    taxRateResult = await pool.query(
      `
      SELECT *
      FROM tax_rates
      WHERE county_name = $1
        AND city_name = ''
      LIMIT 1
      `,
      [county]
    );
  }

  if (taxRateResult.rows.length === 0) {
    throw new Error(`Tax rate not found for county="${county}", city="${city}"`);
  }

  const taxRate = taxRateResult.rows[0];

  const rate =
    taxRate.combined_rate != null
      ? Number(taxRate.combined_rate)
      : Number(taxRate.composite_rate);

  const taxAmount = Number((subtotal * rate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const insertResult = await pool.query(
    `
    INSERT INTO orders (
      subtotal,
      tax_rate_id,
      tax_amount,
      total_amount
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [subtotal, taxRate.id_tax, taxAmount, totalAmount]
  );

  return {
    order: insertResult.rows[0],
    location: {
      county,
      city,
    },
    taxRate,
  };
}

export async function getAllOrders() {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.subtotal,
      o.tax_amount,
      o.total_amount,
      t.county_name,
      t.city_name
    FROM orders o
    JOIN tax_rates t
      ON o.tax_rate_id = t.id_tax
    ORDER BY o.id DESC
    `
  );

  return result.rows;
}