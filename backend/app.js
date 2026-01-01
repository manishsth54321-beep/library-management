import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test / default route
app.get("/", (req, res) => {
  res.json({
    message: "Library Management System API is running",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/issues", issueRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});