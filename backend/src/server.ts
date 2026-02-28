
import express from "express";
import multer from "multer";
import { getCountyCityByLatLonNY } from "./services/coordLookup";
import { createOrderFromLatLon } from "./services/orders.service";
import { initDb } from "./db/database";
import dotenv from "dotenv";
import { getAllOrders } from "./services/orders.service";
import { importOrdersFromCsvBuffer } from "./services/ordersCsv.service";
dotenv.config();
const app = express();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.get("/health", (_req, res) => {
  console.log("HEALTH ROUTE HIT");
  return res.send("OK");
});

app.get("/orders", async (_req, res) => {
  try {
    const orders = await getAllOrders();
    return res.json(orders);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const { subtotal, latitude, longitude } = req.body ?? {};

    if (
      typeof subtotal !== "number" ||
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        error: "Expected { subtotal:number, latitude:number, longitude:number }",
      });
    }

    app.post("/orders/import-csv", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'CSV file is required in form-data field "file"',
      });
    }

    const result = await importOrdersFromCsvBuffer(req.file.buffer);
    return res.status(201).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

    const created = await createOrderFromLatLon({
      subtotal,
      latitude,
      longitude,
    });

    return res.status(201).json(created);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`); 
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}
console.log("SERVER FILE UPDATED");
start();

//це файл для обробки http запитів