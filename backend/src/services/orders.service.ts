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
export async function createOrderFromLatLon(input: CreateOrderInput) {

    const geo = await getCountyCityByLatLonNY(input.latitude, input.longitude, input.signal);
    const county = geo.county.replace(/\s+County$/i, "").trim();
    const city = geo.city
        .replace(/\s+(city|village|town|borough)$/i, "")
        .trim();
    const tax = await findTaxRateByCountyCity(county, city);
    const composite = Number(tax.composite_rate);
    const taxAmount = round(input.subtotal * composite);
    const totalAmount = round(input.subtotal + taxAmount);

    const orderId = (await insertedRow(input, tax, taxAmount, totalAmount)).id;
    const row = await getOrderWithTaxById(orderId);
    return {
        id: row.id,
        subtotal: Number(row.subtotal),
        tax_amount: Number(row.tax_amount),
        total_amount: Number(row.total_amount),
        composite_rate: Number(row.composite_rate),
        jurisdictions: {
            county: row.county_name,
            city: row.city_name ?? null,
        },
        breakdown: {
            state_rate: Number(row.state_rate),
            county_rate: Number(row.county_rate),
            city_rate: Number(row.city_rate),
            special_rate: Number(row.special_rate),
        },
    };
}

export async function getOrderWithTaxById(orderId: number) {

    const result = await pool.query(
        `
    SELECT
      o.id,
      o.subtotal,
      o.tax_amount,
      o.total_amount,
      t.county_name,
      t.city_name,
      t.state_rate,
      t.county_rate,
      t.city_rate,
      t.special_rate,
      t.composite_rate
    FROM orders o
    JOIN tax_rates t ON t.id_tax = o.tax_rate_id
    WHERE o.id = $1
    `,
        [orderId]
    );

    if (result.rows.length === 0) {
        throw new Error("Order not found");
    }

    return result.rows[0];
}
 export async function insertedRow(input: CreateOrderInput, tax: TaxRateRow, taxAmount: number, totalAmount: number) {
     const inserted = await pool.query<{ id: number }>(
        `
    INSERT INTO orders (subtotal, tax_rate_id, tax_amount, total_amount)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
        [input.subtotal, tax.id, taxAmount, totalAmount]
    );
    return inserted.rows[0];
 }

