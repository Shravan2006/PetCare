const express = require("express");

const logger = require("./middleware/logger");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const PORT = 3002;

// Built-in middleware
app.use(express.json());

// Request logging middleware
app.use(logger);

// Home route
app.get("/", (req, res) => {
  res.send("PetCare Express API is running!");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Appointment routes
app.use("/api/appointments", appointmentRoutes);

// 404 error handler
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `PetCare Express server running at http://localhost:${PORT}`
  );
});