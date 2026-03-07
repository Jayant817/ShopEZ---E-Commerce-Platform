import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// CORS: reads CLIENT_URL from .env. Falls back to "*" during development.
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));

app.use(express.json());

/* ---------------- DATABASE ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // No point running the server without a DB connection
  });

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

/* ---------------- ROOT ---------------- */

app.get("/", (req, res) => {
  res.json({ message: "ShopEZ API Running" });
});

/* ---------------- 404 HANDLER ---------------- */
// Catches any request that didn't match a route above

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
// Any error passed via next(err) lands here instead of crashing the server
// or leaking a raw stack trace to the client

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* ---------------- SERVER ---------------- */

// PORT from .env — works locally and on any cloud host
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
