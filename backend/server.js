const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Typing event
  socket.on("typing", (data) => {
    console.log("Typing event received:", data);
    socket.broadcast.emit("typing", data); // Notify all clients except sender
  });

  // Message event
  socket.on("message", (data) => {
    io.emit("message", data); // Send message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
