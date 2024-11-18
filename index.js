const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todo")
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection failed", err));

// Mongoose model
const Activity = mongoose.model("Activity", { name: String }, "Activity");

// Get all activities
app.get("/activitylist", function (req, res) {
  Activity.find()
    .then((retdata) => {
      console.log("Fetched activities:", retdata); // Log activities for debugging
      res.send(retdata);
    })
    .catch((err) => {
      console.error("Error fetching activities:", err);
      res.status(500).send({ error: "Failed to fetch activities" });
    });
});

// Add a new activity
app.post("/addactivity", function (req, res) {
  const newactivity = req.body.newactivity;

  const newActivity = new Activity({
    name: newactivity,
  });

  newActivity
    .save()
    .then((savedActivity) => {
      console.log("Activity saved successfully:", savedActivity);
      res.status(201).send(savedActivity); // Send the saved activity
    })
    .catch((err) => {
      console.error("Error saving activity:", err);
      res.status(500).send({ error: "Failed to add activity" });
    });
});

// Delete an activity by name
app.delete("/deleteactivity/:name", function (req, res) {
  const activityName = req.params.name;

  if (!activityName.trim()) {
    return res.status(400).send({ error: "Activity name cannot be empty" });
  }

  Activity.deleteOne({ name: activityName })
    .then((result) => {
      if (result.deletedCount > 0) {
        console.log("Activity deleted successfully");
        res.send({ message: "Activity deleted successfully" });
      } else {
        res.status(404).send({ error: "Activity not found" });
      }
    })
    .catch((err) => {
      console.error("Error deleting activity:", err);
      res.status(500).send({ error: "Failed to delete activity" });
    });
});

// Start the server
app.listen(5000, function () {
  console.log("Server started on port 5000");
});
