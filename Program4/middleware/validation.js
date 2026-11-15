function validateAppointment(req, res, next) {
  const { owner, pet, service, date, status } = req.body;

  if (req.method === "POST") {
    if (!owner || !pet || !service || !date) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
  }

  if (req.method === "PUT") {
    if (
      !owner && !pet && !service && !date && !status
    ) {
      return res.status(400).json({
        message: "Provide at least one field to update"
      });
    }

    if (status && !["Pending", "Confirmed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status"
      });
    }
  }

  next();
}

module.exports = validateAppointment;