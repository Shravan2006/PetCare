import { useState } from "react";

function AppointmentForm({ addAppointment }) {
  const [owner, setOwner] = useState("");
  const [pet, setPet] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!owner || !pet || !service || !date) {
      alert("Please fill all fields!");
      return;
    }

    if (date < today) {
      alert("Please select a future date!");
      return;
    }

    const appointment = {
      id: Date.now(),
      owner,
      pet,
      service,
      date,
      status: "Pending"
    };

    addAppointment(appointment);

    setOwner("");
    setPet("");
    setService("");
    setDate("");

    alert("Appointment booked successfully!");
  };

  return (
    <div className="form-container">
      <h2>Book an Appointment</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Owner Name"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pet Name"
          value={pet}
          onChange={(e) => setPet(e.target.value)}
        />

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">Select Service</option>
          <option value="Vaccination">Vaccination</option>
          <option value="Grooming">Grooming</option>
          <option value="General Checkup">General Checkup</option>
          <option value="Dental Care">Dental Care</option>
        </select>

        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default AppointmentForm;