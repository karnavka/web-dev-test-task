import { parse } from "csv-parse/sync";
import { createOrderFromLatLon } from "./orders.service";

type CsvOrderRow = {
  id: string;
  longitude: string;
  latitude: string;
  timestamp: string;
  subtotal: string;
};

function toNumber(value: string, field: string): number {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid ${field}: "${value}"`);
  }
  return num;
}

export async function importOrdersFromCsvBuffer(fileBuffer: Buffer) {
  const csvText = fileBuffer.toString("utf-8");

  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvOrderRow[];

  const createdOrders: any[] = [];
  const errors: Array<{ row: number; error: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const longitude = toNumber(row.longitude, "longitude");
      const latitude = toNumber(row.latitude, "latitude");
      const subtotal = toNumber(row.subtotal, "subtotal");

      const created = await createOrderFromLatLon({
        subtotal,
        latitude,
        longitude,
      });

      createdOrders.push({
        sourceRow: i + 2,
        csvId: row.id,
        created,
      });
    } catch (error) {
      errors.push({
        row: i + 2,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    totalRows: rows.length,
    createdCount: createdOrders.length,
    errorCount: errors.length,
    createdOrders,
    errors,
  };
}