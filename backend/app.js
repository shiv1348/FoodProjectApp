// Configure express, middlewares, and routes
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Route imports
const auth = require("./routes/auth");
const restaurant = require("./routes/restaurant");
const menu = require("./routes/menu");
const foodItem = require("./routes/foodItem");
const cart = require("./routes/cart");
const order = require("./routes/order");
const payment = require("./routes/payment");
const razorpay = require("./routes/razorpay");
const ai = require("./routes/ai");

// Error handling middleware
const errorMiddleware = require("./middlewares/errors");

// Standard middlewares with Vercel & Render CORS support
app.use(cors({
    origin: (origin, callback) => {
        // Allow local dev, vercel deployments, render, and direct API calls
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Mount API routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/store", restaurant); // singular alias for backward compatibility
app.use("/api/v1/eats/menus", menu);
app.use("/api/v1/eats/items", foodItem);
app.use("/api/v1/cart", cart);
app.use("/api/v1/order", order);
app.use("/api/v1/orders", order); // plural alias
app.use("/api/v1/eats/orders", order); // eats/orders alias
app.use("/api/v1/payment", payment);
app.use("/api/v1/payment/razorpay", razorpay);
app.use("/api/v1/ai", ai);

// Health check and root endpoints for Render / Cloud deployment
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
    res.status(200).json({ 
        message: "Food Delivery API is running live 🚀", 
        health: "/health",
        environment: process.env.NODE_ENV || "DEVELOPMENT"
    });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
