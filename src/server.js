import 'dotenv/config';
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "E-Pharmacy API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

