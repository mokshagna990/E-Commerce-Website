const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");

// ✅ Added routes for user history & recommendations
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);

// Middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

// Debug middleware
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`[DEBUG] ${req.method} ${req.path}`);
        console.log("Request Body:", req.body);
        console.log("Request Headers:", req.headers);
        next();
    });
}

// API routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);

// ✅ Register new API routes
app.use("/api/recommendations", recommendationRoutes);

// Test routes
app.get("/test", (req, res) => {
    res.json({ message: "API is working" });
});

// API test route
app.get("/api/test", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            status: "Connected",
            database: mongoose.connection.name,
            collections: collections.map((c) => c.name),
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        message: "Something broke!",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
});

// 404 handler
app.use((req, res) => {
    console.log("404 Not Found:", req.method, req.path);
    res.status(404).json({ message: "Route not found" });
});

// Database connection
connectDB()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err.message));

mongoose.connection.on("disconnected", () => {
    console.warn("Database disconnected");
});

mongoose.connection.on("error", (err) => {
    console.error("Database error:", err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

// Global error handlers
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});

module.exports = app;
