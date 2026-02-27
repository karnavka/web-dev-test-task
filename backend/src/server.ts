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

app.listen(PORT, () => {
  console.log(getCountyCityByLatLonNY(35.64453, 87.37669).then(console.log).catch(console.error));
});

//це файл для обробки http запитів