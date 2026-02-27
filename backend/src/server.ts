import express from "express";
import { pool } from "./database";
import { getCountyCityByLatLonNY } from "./services/coordLookup";
import { get } from "node:http";

const app = express();

app.use(express.json());

//це просто тест не сприймати серйозно

app.post("/orders", (req, res) => {

  res.json({ message: "API works " });
});


const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, async () => {
  try {
    const result = await getCountyCityByLatLonNY(43.306126, -74.887929);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

//це файл для обробки http запитів