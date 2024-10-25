const express = require("express");
const {
  addReminder,
  getReminders,
  deleteReminder,
} = require("../controllers/reminder.controller");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/reminder", verifyToken, addReminder);
router.get("/reminder", verifyToken, getReminders);
router.delete("/reminder/:id", verifyToken, deleteReminder);

module.exports = router;
