const Reminder = require("../models/reminder.model");

// Add a Reminder
exports.addReminder = async (req, res) => {
  const { message, date } = req.body;

  try {
    const reminder = new Reminder({
      userId: req.user.id,
      message,
      date,
    });

    await reminder.save();
    res.json({ reminder, msg: "Reminder added successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Get Reminders for a User
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });
    res.json(reminders);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// Delete a Reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    // Check if the reminder exists
    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    // Check if the user owns the reminder
    if (reminder.userId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "Unauthorized to delete this reminder" });
    }

    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ msg: "Reminder deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
