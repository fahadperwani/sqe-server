const express = require("express");
const {
  addHealthData,
  getHealthStats,
  deleteHealthData,
  getHealthStatsByPeriod,
} = require("../controllers/health.controller");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/health", verifyToken, addHealthData);
router.get("/health/data", verifyToken, getHealthStats);
router.delete("/health/:id", verifyToken, deleteHealthData);
router.get("/health/stats/:period", verifyToken, getHealthStatsByPeriod); // New route for getting health stats by period

module.exports = router;
