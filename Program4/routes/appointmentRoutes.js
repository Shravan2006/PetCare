const express = require("express");
const fs = require("fs");
const path = require("path");

const authenticateToken = require("../middleware/auth");
const validateAppointment = require("../middleware/validation");

const router = express.Router();

const appointmentsPath = path.join(
  __dirname, "..", "data", "appointments.json"
);

// All appointment routes require JWT authentication
router.use(authenticateToken);

// Read appointments
router.get("/", (req, res, next) => {
  try {
    const appointments = JSON.parse(
      fs.readFileSync(appointmentsPath, "utf8")
    );

    res.json(appointments);

  } catch (error) {
    next(error);
  }
});

// Add appointment
router.post("/", validateAppointment, (req, res, next) => {
  try {
    const appointments = JSON.parse(
      fs.readFileSync(appointmentsPath, "utf8")
    );

    const appointment = {
      id: Date.now(),
      owner: req.body.owner,
      pet: req.body.pet,
      service: req.body.service,
      date: req.body.date,
      status: "Pending"
    };

    appointments.push(appointment);

    fs.writeFileSync(
      appointmentsPath,
      JSON.stringify(appointments, null, 2)
    );

    res.status(201).json({
      message: "Appointment added successfully",
      appointment
    });

  } catch (error) {
    next(error);
  }
});

// Update appointment
router.put("/:id", validateAppointment, (req, res, next) => {
  try {
    const appointments = JSON.parse(
      fs.readFileSync(appointmentsPath, "utf8")
    );

    const appointment = appointments.find(
      item => item.id === Number(req.params.id)
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    const { owner, pet, service, date, status } = req.body;

    if (owner !== undefined) appointment.owner = owner;
    if (pet !== undefined) appointment.pet = pet;
    if (service !== undefined) appointment.service = service;
    if (date !== undefined) appointment.date = date;
    if (status !== undefined) appointment.status = status;

    fs.writeFileSync(
      appointmentsPath,
      JSON.stringify(appointments, null, 2)
    );

    res.json({
      message: "Appointment updated successfully",
      appointment
    });

  } catch (error) {
    next(error);
  }
});

// Delete appointment
router.delete("/:id", (req, res, next) => {
  try {
    const appointments = JSON.parse(
      fs.readFileSync(appointmentsPath, "utf8")
    );

    const updatedAppointments = appointments.filter(
      item => item.id !== Number(req.params.id)
    );

    if (appointments.length === updatedAppointments.length) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    fs.writeFileSync(
      appointmentsPath,
      JSON.stringify(updatedAppointments, null, 2)
    );

    res.json({
      message: "Appointment deleted successfully"
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;