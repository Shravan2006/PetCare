function AppointmentList({ appointments, deleteAppointment, updateStatus }) {
  return (
    <div className="list-container">
      <h2>Appointment List</h2>

      {appointments.length === 0 ? (
        <p className="empty">No appointments available.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <div className="appointment-card" key={appointment.id}>
              <h3>🐾 {appointment.pet}</h3>

              <p><strong>Owner:</strong> {appointment.owner}</p>
              <p><strong>Service:</strong> {appointment.service}</p>
              <p><strong>Date:</strong> {appointment.date}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status">{appointment.status}</span>
              </p>

              <button
                onClick={() => updateStatus(appointment.id)}
              >
                Confirm
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteAppointment(appointment.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentList;