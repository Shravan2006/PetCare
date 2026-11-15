
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// GET - Fetch all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Add appointment
router.post("/", async (req, res) => {
  try {
    const { owner, pet, service, date } = req.body;

    if (!owner || !pet || !service || !date) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const appointment = new Appointment({
      owner,
      pet,
      service,
      date
    });

    const savedAppointment = await appointment.save();

    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update appointment
router.put("/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete appointment
router.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
