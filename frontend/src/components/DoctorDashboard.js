import { useEffect, useState } from "react";
import axios from "axios";

function DoctorDashboard() {
  const userId = localStorage.getItem("user_id");

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState([]);
const [showRecordForm, setShowRecordForm] = useState(false);
const [recordData, setRecordData] = useState({
  patient_id: "",
  diagnosis: "",
  prescription: ""
});
const addMedicalRecord = async () => {
  const user_id = localStorage.getItem("user_id");

  await axios.post("http://localhost:5000/api/doctor/medical-records", {
    ...recordData,
    user_id
  });

  alert("Medical record added");
  setShowRecordForm(false);
  setRecordData({ patient_id: "", diagnosis: "", prescription: "" });
};

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, []);
const updateStatus = async (appointmentId, status) => {
  await axios.put(
    `http://localhost:5000/api/doctor/appointments/${appointmentId}/status`,
    { status }
  );
  fetchAppointments();
};

  const fetchDoctorProfile = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/doctor/profile/${userId}`
    );
    setDoctor(res.data);
  };

  const fetchAppointments = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/doctor/appointments/${userId}`
    );
    setAppointments(res.data);
  };

  const viewHistory = async (patientId) => {
    const res = await axios.get(
      `http://localhost:5000/api/doctor/patient-history/${patientId}`
    );
    setSelectedPatient(patientId);
    setHistory(res.data);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Doctor Dashboard</h1>

      {/* DOCTOR PROFILE */}
      {doctor && (
        <div style={{ marginBottom: "20px" }}>
          <h2>My Profile</h2>
          <p><b>Name:</b> {doctor.first_name} {doctor.last_name}</p>
          <p><b>Specialization:</b> {doctor.specialization}</p>
          <p><b>Phone:</b> {doctor.phone_number}</p>
        </div>
      )}

      {/* APPOINTMENTS */}
      <h2>Appointments</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.appointment_id}>
              <td>{a.first_name} {a.last_name}</td>
              <td>{new Date(a.appointment_date).toLocaleDateString()}</td>
              <td>{a.appointment_time}</td>
              <td>{a.reason_for_visit}</td>
              <td>{a.status || "booked"}</td>
             <td>
                <button onClick={() => setSelectedPatient(a.patient_id)}>
  Add Medical Record
</button>
<button onClick={() => {
  setShowRecordForm(true);
  setRecordData({ ...recordData, patient_id: a.patient_id });
}}>
  Add Record
</button>
{showRecordForm && (
  <div style={{ marginTop: "20px" }}>
    <h3>Add Medical Record</h3>

    <textarea
      placeholder="Diagnosis"
      onChange={e =>
        setRecordData({ ...recordData, diagnosis: e.target.value })
      }
    />
    <br />

    <textarea
      placeholder="Prescription"
      onChange={e =>
        setRecordData({ ...recordData, prescription: e.target.value })
      }
    />
    <br />

    <button onClick={addMedicalRecord}>Save Record</button>{" "}
    <button onClick={() => setShowRecordForm(false)}>Cancel</button>
  </div>
)}


  <button onClick={() => viewHistory(a.patient_id)}>
    History
  </button>{" "}
  <button
    disabled={a.status === "completed"}
    onClick={() => updateStatus(a.appointment_id, "completed")}
  >
    Complete
  </button>{" "}
  <button
    disabled={a.status === "cancelled"}
    onClick={() => updateStatus(a.appointment_id, "cancelled")}
  >
    Cancel
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* PATIENT HISTORY */}
      {selectedPatient && (
        <div style={{ marginTop: "30px" }}>
          <h2>Patient Medical History</h2>

          {history.length === 0 ? (
            <p>No records found</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0">
              <thead>
                <tr>
                  <th>Visit Date</th>
                  <th>Diagnosis</th>
                  <th>Prescription</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.record_id}>
                    <td>{new Date(h.visit_date).toLocaleDateString()}</td>
                    <td>{h.diagnosis}</td>
                    <td>{h.prescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
