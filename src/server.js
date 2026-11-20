import 'dotenv/config';
import express from "express";
import cors from "cors";
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "E-Pharmacy API is running",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

