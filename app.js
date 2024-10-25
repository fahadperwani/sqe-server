const express = require("express");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const reminderRoutes = require("./routes/reminder.routes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", reminderRoutes);

// Connect to MongoDB (if running in production)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}

// Export the app for use in server.js and test files
module.exports = app;
