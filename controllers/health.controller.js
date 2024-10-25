const HealthData = require("../models/health.model");

// Add Health Data
exports.addHealthData = async (req, res) => {
  const { bloodSugar, bloodPressure, heartRate } = req.body;
  console.log({ bloodSugar, bloodPressure, heartRate });
  try {
    const healthData = new HealthData({
      userId: req.user.id,
      bloodSugar,
      bloodPressure,
      heartRate,
    });
    await healthData.save();

    // Check if any health data is abnormal
    const reminder = checkHealthData(healthData);
    res.json({ healthData, reminder });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// Check health data for any abnormalities
function checkHealthData(healthData) {
  const { bloodSugar, bloodPressure, heartRate } = healthData;
  let reminders = [];

  if (bloodSugar > 140) {
    reminders.push("Your blood sugar is high. Please take your medication.");
  }
  if (bloodPressure.systolic > 130 || bloodPressure.diastolic > 80) {
    reminders.push("Your blood pressure is high. Please consult a doctor.");
  }
  if (heartRate > 100 || heartRate < 60) {
    reminders.push(
      "Abnormal heart rate detected. Please check with your physician."
    );
  }

  return reminders.length ? reminders : "All vitals are normal";
}

// Get Health Stats for a Period (Month, Year)
exports.getHealthStats = async (req, res) => {
  //   const { period } = req.params; // "month" or "year"
  const userId = req.user.id;

  //   let startDate, endDate;

  //   if (period === "month") {
  //     startDate = new Date(new Date().setDate(1)); // First day of the current month
  //     endDate = new Date();
  //   } else if (period === "year") {
  //     startDate = new Date(new Date().getFullYear(), 0, 1); // First day of the current year
  //     endDate = new Date();
  //   } else {
  //     return res
  //       .status(400)
  //       .json({ msg: 'Invalid period. Use "month" or "year".' });
  //   }

  try {
    const healthData = await HealthData.find({
      userId,
      //   createdAt: { $gte: startDate, $lte: endDate },
    });

    res.json(healthData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// Delete Health Data
exports.deleteHealthData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await HealthData.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ msg: "Health data not found" });
    }

    res.json({ msg: "Health data deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// Get Health Stats for a Period (Week, Month, Year)
exports.getHealthStatsByPeriod = async (req, res) => {
  const { period } = req.params; // "week", "month", or "year"
  const userId = req.user.id;
  let startDate, endDate;

  const currentDate = new Date();

  try {
    if (period === "week") {
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // 7 days ago
    } else if (period === "month") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1)); // 1 month ago
    } else if (period === "year") {
      startDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() - 1)
      ); // 1 year ago
    } else {
      return res
        .status(400)
        .json({ msg: 'Invalid period. Use "week", "month", or "year".' });
    }

    const healthData = await HealthData.find({
      userId,
      createdAt: { $gte: startDate },
    });

    res.json(healthData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
