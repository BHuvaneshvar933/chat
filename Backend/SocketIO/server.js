import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const server = http.createServer(app);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatapp";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

app.use(express.json());
app.use(cookieParser());

//  Fix CORS to Allow Cookies & WebSockets
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

//  Function to Get Receiver Socket ID
export const getReceiverSocketId = (receiverId) => users[receiverId] || null;

// Handle Socket.IO Connections
io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("🔹 Online Users:", users);
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log(" A user disconnected:", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

// Route: User Login (Set JWT in HTTP-Only Cookie)
app.post("/api/user/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication check
  if (username !== "testuser" || password !== "password123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign({ username }, process.env.JWT_SECRET || "your_secret_key", { expiresIn: "1h" });

  //  Set HTTP-Only Cookie
  res.cookie("token", token, {
    httpOnly: true, //  Prevent client-side access
    secure: false, //  Change to `true` if using HTTPS
    sameSite: "Lax", //  Change to "None" if cross-origin
  });

  res.json({ message: "Login successful" });
});

//  Route: Logout (Clear JWT Cookie)
app.post("/api/user/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

// Route: Get User Data (Requires JWT Authentication)
app.get("/api/user/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    res.json({ user: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

//  Start Server Only Once
const PORT = process.env.PORT || 4002;
if (!server.listening) {
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export { app, io, server };
