import { pool } from "./database";

type TaxSeedRow = {
  county_name: string;
  city_name: string;
  state_rate: number;
  county_rate: number;
  city_rate: number;
  special_rate: number;
};

const TAX_SEED: TaxSeedRow[] = [
  {
    county_name: "Herkimer",
    city_name: "",
    state_rate: 0.04,
    county_rate: 0.0425,
    city_rate: 0,
    special_rate: 0,
  },
  {
    county_name: "Erie",
    city_name: "",
    state_rate: 0.04,
    county_rate: 0.0475,
    city_rate: 0,
    special_rate: 0,
  },
  {
    county_name: "New York",
    city_name: "New York",
    state_rate: 0.04,
    county_rate: 0,
    city_rate: 0.045,
    special_rate: 0.00375,
  },
  {
    county_name: "Kings",
    city_name: "New York",
    state_rate: 0.04,
    county_rate: 0,
    city_rate: 0.045,
    special_rate: 0.00375,
  },
  {
    county_name: "Queens",
    city_name: "New York",
    state_rate: 0.04,
    county_rate: 0,
    city_rate: 0.045,
    special_rate: 0.00375,
  },
];

export async function seedTaxRates() {
  for (const row of TAX_SEED) {
    const composite_rate =
      row.state_rate + row.county_rate + row.city_rate + row.special_rate;

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
        row.county_name,
        row.city_name,
        row.state_rate,
        row.county_rate,
        row.city_rate,
        row.special_rate,
        composite_rate,
      ]
    );
  }
}

async function main() {
  try {
    await seedTaxRates();
    console.log("Seed completed");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();