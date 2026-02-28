import express from "express";
import { pool } from "./database";
import { getCountyCityByLatLonNY } from "./services/coordLookup";
import { createOrderFromLatLon } from "./services/orders.service";
import { initDb } from "./database";

const app = express();

app.use(express.json());

//це просто тест не сприймати серйозно



app.post("/orders", async (req, res) => {
  try {
    const { subtotal, latitude, longitude } = req.body ?? {};
    if (typeof subtotal !== "number" || typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ error: "Expected { subtotal:number, latitude:number, longitude:number }" });
    }

    const created = await createOrderFromLatLon({ subtotal, latitude, longitude});
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: (e as Error).message });
  }
});


const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, async () => {
  try {
    const result = await getCountyCityByLatLonNY(43.306126, -74.887929);
    console.log(result);
    initDb();
  } catch (err) {
    console.error(err);
  }
});

//це файл для обробки http запитів