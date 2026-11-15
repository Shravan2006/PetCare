
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  pet: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
