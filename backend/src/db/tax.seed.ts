import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { pool } from "./database";

type CsvRow = {
  county: string;
  city: string;
  combined_rate: string;
  reporting_code: string;
  includes_mctd: string;
  effective_date: string;
  source_url: string;
  notes: string;
  rate_percent: string;
};

type CountyBase = {
  state_rate: number;
  county_rate: number;
  special_rate: number;
  composite_rate: number;
};

function toNumber(value: string, field: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${field}: "${value}"`);
  }
  return n;
}

function toBool(value: string): boolean {
  return String(value).trim().toLowerCase() === "true";
}

function normalizeName(value: string): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

async function seedTaxRates() {
  const filePath = path.resolve(
    process.cwd(),
    "data",
    "tax-rate.csv"
  );

  const raw = await fs.readFile(filePath, "utf-8");

  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const countyDefaults = new Map<string, CountyBase>();

  
  for (const row of rows) {
    const county = normalizeName(row.county);
    const city = normalizeName(row.city);

    if (county === "New York State only") continue;
    if (city) continue; 

    const combined = toNumber(row.combined_rate, "combined_rate");
    const includesMctd = toBool(row.includes_mctd);

    const state_rate = 0.04;
    const special_rate = includesMctd ? 0.00375 : 0;
    const county_rate = Number((combined - state_rate - special_rate).toFixed(5));
    const city_rate = 0;
    const composite_rate = combined;

    countyDefaults.set(county, {
      state_rate,
      county_rate,
      special_rate,
      composite_rate,
    });

    await pool.query(
      `
      INSERT INTO tax_rates (
        county_name,
        city_name,
        state_rate,
        county_rate,
        city_rate,
        special_rate,
        composite_rate
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (county_name, city_name)
      DO UPDATE SET
        state_rate = EXCLUDED.state_rate,
        county_rate = EXCLUDED.county_rate,
        city_rate = EXCLUDED.city_rate,
        special_rate = EXCLUDED.special_rate,
        composite_rate = EXCLUDED.composite_rate
      `,
      [
        county,
        "",
        state_rate,
        county_rate,
        city_rate,
        special_rate,
        composite_rate,
      ]
    );
  }

  for (const row of rows) {
    const county = normalizeName(row.county);
    const city = normalizeName(row.city);

    if (county === "New York State only") continue;
    if (!city) continue; 

    const combined = toNumber(row.combined_rate, "combined_rate");

    const countyBase = countyDefaults.get(county);
    if (!countyBase) {
      throw new Error(`Missing county default for county "${county}"`);
    }

    const state_rate = countyBase.state_rate;
    const county_rate = countyBase.county_rate;
    const special_rate = countyBase.special_rate;

    const city_rate = Number(
      (combined - state_rate - county_rate - special_rate).toFixed(5)
    );

    const composite_rate = combined;

    await pool.query(
      `
      INSERT INTO tax_rates (
        county_name,
        city_name,
        state_rate,
        county_rate,
        city_rate,
        special_rate,
        composite_rate
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (county_name, city_name)
      DO UPDATE SET
        state_rate = EXCLUDED.state_rate,
        county_rate = EXCLUDED.county_rate,
        city_rate = EXCLUDED.city_rate,
        special_rate = EXCLUDED.special_rate,
        composite_rate = EXCLUDED.composite_rate
      `,
      [
        county,
        city,
        state_rate,
        county_rate,
        city_rate,
        special_rate,
        composite_rate,
      ]
    );
  }
}

async function main() {
  try {
    await seedTaxRates();
    console.log("Tax seed completed");
  } catch (error) {
    console.error("Tax seed failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();