
const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

// File paths
const dataPath = path.join(__dirname, "data", "appointments.json");
const logPath = path.join(__dirname, "data", "updates.log");

// EventEmitter
const appointmentEvents = new EventEmitter();

// Stream for storing update logs
const logStream = fs.createWriteStream(logPath, { flags: "a" });

// Read appointments from JSON file
function getAppointments() {
  const data = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(data);
}

// Save appointments to JSON file
function saveAppointments(appointments) {
  fs.writeFileSync(dataPath, JSON.stringify(appointments, null, 2));
}

// Listen for appointment events
appointmentEvents.on("appointmentAdded", (appointment) => {
  console.log("New appointment added:", appointment.pet);
  logStream.write(`Appointment added: ${appointment.pet}\n`);
});

appointmentEvents.on("appointmentUpdated", (appointment) => {
  console.log("Appointment updated:", appointment.pet);
  logStream.write(`Appointment updated: ${appointment.pet}\n`);
});

appointmentEvents.on("appointmentDeleted", (id) => {
  console.log("Appointment deleted:", id);
  logStream.write(`Appointment deleted: ${id}\n`);
});

// Send JSON response
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON.stringify(data));
}

// Read request body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON data"));
      }
    });

    req.on("error", reject);
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Handle browser preflight requests
    if (req.method === "OPTIONS") {
      return sendResponse(res, 200, { message: "OK" });
    }

    // GET - Retrieve all appointments
    if (req.method === "GET" && url.pathname === "/appointments") {
      return sendResponse(res, 200, getAppointments());
    }

    // POST - Add new appointment
    if (req.method === "POST" && url.pathname === "/appointments") {
      const { owner, pet, service, date } = await readBody(req);

      if (!owner || !pet || !service || !date) {
        return sendResponse(res, 400, {
          message: "All fields are required"
        });
      }

      const appointments = getAppointments();

      const appointment = {
        id: Date.now(),
        owner,
        pet,
        service,
        date,
        status: "Pending"
      };

      appointments.push(appointment);
      saveAppointments(appointments);

      appointmentEvents.emit("appointmentAdded", appointment);

      return sendResponse(res, 201, {
        message: "Appointment added successfully",
        appointment
      });
    }

    // PUT - Update appointment status
    if (req.method === "PUT" && url.pathname.startsWith("/appointments/")) {
      const id = Number(url.pathname.split("/")[2]);
      const appointments = getAppointments();

      const appointment = appointments.find((item) => item.id === id);

      if (!appointment) {
        return sendResponse(res, 404, {
          message: "Appointment not found"
        });
      }

      const body = await readBody(req);

      appointment.status = body.status || "Confirmed";

      saveAppointments(appointments);
      appointmentEvents.emit("appointmentUpdated", appointment);

      return sendResponse(res, 200, {
        message: "Appointment updated successfully",
        appointment
      });
    }

    // DELETE - Delete appointment
    if (req.method === "DELETE" && url.pathname.startsWith("/appointments/")) {
      const id = Number(url.pathname.split("/")[2]);
      const appointments = getAppointments();

      const updatedAppointments = appointments.filter(
        (item) => item.id !== id
      );

      if (appointments.length === updatedAppointments.length) {
        return sendResponse(res, 404, {
          message: "Appointment not found"
        });
      }

      saveAppointments(updatedAppointments);
      appointmentEvents.emit("appointmentDeleted", id);

      return sendResponse(res, 200, {
        message: "Appointment deleted successfully"
      });
    }

    sendResponse(res, 404, { message: "Route not found" });

  } catch (error) {
    sendResponse(res, 400, { message: error.message });
  }
});

// Start server
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`PetCare Node.js server running at http://localhost:${PORT}`);
});
