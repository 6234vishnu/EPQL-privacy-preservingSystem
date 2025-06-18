import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    origin: process.env.FRONTEND_URL,
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});
