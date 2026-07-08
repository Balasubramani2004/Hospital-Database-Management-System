import { useEffect, useState } from "react";
import axios from "axios";

function PatientDashboard() {
  const userId = localStorage.getItem("user_id");

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    address: ""
  });

  const [appointmentData, setAppointmentData] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    reason_for_visit: ""
  });

  /* ---------------- FETCH FUNCTIONS ---------------- */

  const fetchProfile = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/patient/profile/${userId}`
    );
    setProfile(res.data);
    setFormData({
      phone_number: res.data.phone_number || "",
      address: res.data.address || ""
    });
  };

  const fetchAppointments = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/patient/appointments/${userId}`
    );
    setAppointments(Array.isArray(res.data) ? res.data : []);
  };

  const fetchHistory = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/patient/history/${userId}`
    );
    setHistory(Array.isArray(res.data) ? res.data : []);
  };

  const fetchDoctors = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/patient/doctors"
    );
    setDoctors(Array.isArray(res.data) ? res.data : []);
  };

  /* ---------------- ACTION FUNCTIONS ---------------- */

  const updateProfile = async () => {
    await axios.put(
      `http://localhost:5000/api/patient/profile/${userId}`,
      formData
    );
    alert("Profile updated");
    setEditMode(false);
    fetchProfile();
  };

  const bookAppointment = async () => {
    if (
      !appointmentData.doctor_id ||
      !appointmentData.appointment_date ||
      !appointmentData.appointment_time
    ) {
      alert("Please fill all fields");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/patient/book-appointment",
      {
        patient_id: userId,
        ...appointmentData
      }
    );

    alert("Appointment booked");
    setAppointmentData({
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
      reason_for_visit: ""
    });
    fetchAppointments();
  };

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    fetchHistory();
    fetchDoctors();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: "30px" }}>
      <h1>Patient Dashboard</h1>

      {/* PROFILE */}
      {profile && (
        <>
          <h2>My Profile</h2>
          <p><b>Name:</b> {profile.first_name} {profile.last_name}</p>
          <p><b>Gender:</b> {profile.gender}</p>

          {editMode ? (
            <>
              <input
                value={formData.phone_number}
                placeholder="Phone"
                onChange={e =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
              <br /><br />
              <textarea
                value={formData.address}
                placeholder="Address"
                onChange={e =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <br /><br />
              <button onClick={updateProfile}>Save</button>{" "}
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p><b>Phone:</b> {profile.phone_number}</p>
              <p><b>Address:</b> {profile.address}</p>
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </>
          )}
        </>
      )}

      <hr />

      {/* BOOK APPOINTMENT */}
      <h2>Book Appointment</h2>

      <select
        value={appointmentData.doctor_id}
        onChange={e =>
          setAppointmentData({ ...appointmentData, doctor_id: e.target.value })
        }
      >
        <option value="">Select Doctor</option>
        {doctors.map(d => (
          <option key={d.doctor_id} value={d.doctor_id}>
            {d.first_name} {d.last_name} – {d.specialization}
          </option>
        ))}
      </select>
      <br /><br />

      <input
        type="date"
        onChange={e =>
          setAppointmentData({ ...appointmentData, appointment_date: e.target.value })
        }
      />
      <br /><br />

      <input
        type="time"
        onChange={e =>
          setAppointmentData({ ...appointmentData, appointment_time: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Reason for visit"
        onChange={e =>
          setAppointmentData({ ...appointmentData, reason_for_visit: e.target.value })
        }
      />
      <br /><br />

      <button onClick={bookAppointment}>Book Appointment</button>

      <hr />

      {/* APPOINTMENTS */}
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.appointment_id}>
                <td>{a.doctor_first_name} {a.doctor_last_name}</td>
                <td>{a.appointment_date}</td>
                <td>{a.appointment_time}</td>
                <td>{a.reason_for_visit}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      {/* MEDICAL HISTORY */}
      <h2>Medical History</h2>
      {history.length === 0 ? (
        <p>No records</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {history.map(r => (
              <tr key={r.record_id}>
                <td>{r.visit_date}</td>
                <td>{r.diagnosis}</td>
                <td>{r.prescription}</td>
                <td>{r.doctor_first_name} {r.doctor_last_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientDashboard;
