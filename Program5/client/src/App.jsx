
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    owner: "",
    pet: "",
    service: "",
    date: ""
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      setMessage("Unable to fetch appointments. Check the backend.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or update appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/appointments/${editId}`, form);
        setMessage("Appointment updated successfully!");
      } else {
        await axios.post(`${API_URL}/appointments`, form);
        setMessage("Appointment added successfully!");
      }

      setForm({
        owner: "",
        pet: "",
        service: "",
        date: ""
      });

      setEditId(null);
      fetchAppointments();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Load appointment into form for editing
  const handleEdit = (appointment) => {
    setForm({
      owner: appointment.owner,
      pet: appointment.pet,
      service: appointment.service,
      date: appointment.date
    });

    setEditId(appointment._id);
    setMessage("");
  };

  // Update appointment status
  const handleConfirm = async (id) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, {
        status: "Confirmed"
      });

      setMessage("Appointment confirmed!");
      fetchAppointments();
    } catch (error) {
      setMessage("Unable to update appointment.");
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/appointments/${id}`);
      setMessage("Appointment deleted successfully!");
      fetchAppointments();
    } catch (error) {
      setMessage("Unable to delete appointment.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      owner: "",
      pet: "",
      service: "",
      date: ""
    });
  };

  return (
    <div className="container">
      <header>
        <h1>🐾 PetCare Appointment System</h1>
        <p>Manage your pet's healthcare appointments</p>
      </header>

      <section className="form-section">
        <h2>{editId ? "Update Appointment" : "Book an Appointment"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="owner"
            placeholder="Owner Name"
            value={form.owner}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pet"
            placeholder="Pet Name"
            value={form.pet}
            onChange={handleChange}
            required
          />

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
          >
            <option value="">Select Service</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Grooming">Grooming</option>
            <option value="General Checkup">General Checkup</option>
            <option value="Dental Care">Dental Care</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />

          <button type="submit">
            {editId ? "Update Appointment" : "Add Appointment"}
          </button>

          {editId && (
            <button type="button" className="cancel" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="appointments-section">
        <h2>Appointment Records</h2>

        {appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          appointments.map((appointment) => (
            <div className="appointment-card" key={appointment._id}>
              <h3>{appointment.pet}</h3>
              <p><strong>Owner:</strong> {appointment.owner}</p>
              <p><strong>Service:</strong> {appointment.service}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="status">{appointment.status}</span>
              </p>

              <div className="actions">
                <button onClick={() => handleEdit(appointment)}>
                  Edit
                </button>

                {appointment.status !== "Confirmed" && (
                  <button onClick={() => handleConfirm(appointment._id)}>
                    Confirm
                  </button>
                )}

                <button
                  className="delete"
                  onClick={() => handleDelete(appointment._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
