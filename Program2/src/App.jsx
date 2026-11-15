import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";

function App() {
  const [appointments, setAppointments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appointments")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
  };

  const updateStatus = (id) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Confirmed" }
          : appointment
      )
    );
  };

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/appointments"
          element={
            <Appointments
              appointments={appointments}
              addAppointment={addAppointment}
              deleteAppointment={deleteAppointment}
              updateStatus={updateStatus}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;