import express from "express";
import { pool } from "./database";

const app = express();

app.use(express.json());

//це просто тест не сприймати серйозно
app.get("/", (_req, res) => {
  res.json({ message: "API works " });
});


const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});