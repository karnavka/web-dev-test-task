import express from "express";

const app = express();

app.use(express.json());

//це просто тест не сприймати серйозно
app.get("/", (_req, res) => {
  res.json({ message: "API works " });
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});