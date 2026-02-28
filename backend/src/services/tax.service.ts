import { pool } from "../database";
import { getCountyCityByLatLonNY } from "./coordLookup";
//це для SQL запитів таблиці податків в кожному окрузі
export type TaxRateRow = {
  id: number;
  county_name: string;
  city_name: string; 
  state_rate: string;
  county_rate: string;
  city_rate: string;
  special_rate: string;
  composite_rate: string;
};

export async function findTaxRateByCountyCity(
  countyName: string,
  cityName: string
): Promise<TaxRateRow> {
  const county = countyName.trim();
  const city = cityName.trim();

  let res = await pool.query<TaxRateRow>(
    `
    SELECT *
    FROM tax_rates
    WHERE county_name = $1 AND city_name = $2
    LIMIT 1
    `,
    [county, city]
  );

  if (res.rows.length > 0) return res.rows[0];

  res = await pool.query<TaxRateRow>(
    `
    SELECT *
    FROM tax_rates
    WHERE county_name = $1 AND city_name = ''
    LIMIT 1
    `,
    [county]
  );

  if (res.rows.length > 0) return res.rows[0];

  throw new Error(`No tax rate found for county="${county}", city="${city}" (and no county-default).`);
}