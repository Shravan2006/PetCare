import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

function Appointments({
  appointments,
  addAppointment,
  deleteAppointment,
  updateStatus
}) {
  return (
    <div className="appointments-page">
      <AppointmentForm addAppointment={addAppointment} />

      <AppointmentList
        appointments={appointments}
        deleteAppointment={deleteAppointment}
        updateStatus={updateStatus}
      />
    </div>
  );
}

export default Appointments;