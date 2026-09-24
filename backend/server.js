// Load environment variables (local config.env if exists, or system environment on cloud)
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "./config/config.env");
if (fs.existsSync(configPath)) {
  dotenv.config({ path: configPath });
} else {
  dotenv.config();
}

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDatabase = require("./config/database");

// Connect to database
connectDatabase();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Real-time socket event handlers
io.on("connection", (socket) => {
  console.log(`⚡ Socket client connected: ${socket.id}`);

  // Client joins specific order tracking room
  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
    console.log(`📦 Socket ${socket.id} joined room for order: ${orderId}`);
  });

  // Emit live order updates
  socket.on("updateOrderStatus", ({ orderId, status }) => {
    io.to(orderId).emit("orderStatusUpdate", { orderId, status, timestamp: new Date() });
    console.log(`📢 Emitted orderStatusUpdate for ${orderId}: ${status}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket client disconnected: ${socket.id}`);
  });
});

// Attach io to app so routes/controllers can emit events
app.set("io", io);

// Start server
const PORT = process.env.PORT || 8080;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on PORT: ${PORT} on host 0.0.0.0 with Socket.io real-time engine`);
});
