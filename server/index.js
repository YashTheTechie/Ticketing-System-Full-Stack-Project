import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/ticketroutes.js";

dotenv.config();

const app = express();

// ⚡ Middleware Configuration (Secure for Production)
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://127.0.0.1:3000", 
      process.env.FRONTEND_URL // Safely injects your live website link on Render
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
    credentials: true,
  })
);

app.use(express.json());

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SupportDesk API is running!");
});

// 🔌 Connect MongoDB Atlas & Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully to Atlas");

    app.listen(PORT, () => {
      console.log(`✅ SupportDesk Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failure:", err);
  });