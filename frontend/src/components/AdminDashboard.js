import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
const [editingPatient, setEditingPatient] = useState(null);
const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  gender: "",
  phone_number: ""
});
const addDoctor = async () => {
  const { first_name, last_name, specialization, phone_number, email, password } = newDoctor;

  if (!first_name || !last_name || !specialization || !phone_number || !email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/admin/doctors", newDoctor);
    alert("Doctor added successfully");
    setNewDoctor({
      first_name: "",
      last_name: "",
      specialization: "",
      phone_number: "",
      email: "",
      password: ""
    });
    setShowAddDoctor(false);
    fetchDoctors();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to add doctor");
  }
};

const [showAddDoctor, setShowAddDoctor] = useState(false);

const [newDoctor, setNewDoctor] = useState({
  first_name: "",
  last_name: "",
  specialization: "",
  phone_number: "",
  email: "",
  password: ""
});

const [editingDoctor, setEditingDoctor] = useState(null);
const [doctorForm, setDoctorForm] = useState({
  first_name: "",
  last_name: "",
  specialization: "",
  phone_number: ""
});
const startEditDoctor = (doctor) => {
  setEditingDoctor(doctor.doctor_id);
  setDoctorForm({
    first_name: doctor.first_name,
    last_name: doctor.last_name,
    specialization: doctor.specialization,
    phone_number: doctor.phone_number
  });
};

const saveDoctor = async (id) => {
  await axios.put(
    `http://localhost:5000/api/admin/doctors/${id}`,
    doctorForm
  );
  setEditingDoctor(null);
  fetchDoctors();
};

const deleteDoctor = async (id) => {
  if (!window.confirm("Are you sure you want to delete this doctor?")) return;

  await axios.delete(`http://localhost:5000/api/admin/doctors/${id}`);
  fetchDoctors();
};


const startEditPatient = (patient) => {
  setEditingPatient(patient.patient_id);
  setFormData({
    first_name: patient.first_name,
    last_name: patient.last_name,
    gender: patient.gender,
    phone_number: patient.phone_number
  });
};
const deletePatient = async (id) => {
  if (!window.confirm("Are you sure you want to delete this patient?")) return;

  await axios.delete(`http://localhost:5000/api/admin/patients/${id}`);
  fetchPatients();
};


const savePatient = async (id) => {
  await axios.put(
    `http://localhost:5000/api/admin/patients/${id}`,
    formData
  );
  setEditingPatient(null);
  fetchPatients();
};

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/patients");
    setPatients(res.data);
  };

  const fetchDoctors = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/doctors");
    setDoctors(res.data);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      {/* PATIENTS TABLE */}
      <h2>Patients</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
             <td>
  {editingPatient === p.patient_id ? (
    <>
      <input
        value={formData.first_name}
        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
      />
      <input
        value={formData.last_name}
        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
      />
    </>
  ) : (
    `${p.first_name} ${p.last_name}`
  )}
</td>

<td>
  {editingPatient === p.patient_id ? (
    <input
      value={formData.gender}
      onChange={e => setFormData({ ...formData, gender: e.target.value })}
    />
  ) : (
    p.gender
  )}
</td>

<td>
  {editingPatient === p.patient_id ? (
    <input
      value={formData.phone_number}
      onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
    />
  ) : (
    p.phone_number
  )}
</td>

<td>
  {editingPatient === p.patient_id ? (
    <button onClick={() => savePatient(p.patient_id)}>Save</button>
  ) : (
    <>
      <button onClick={() => startEditPatient(p)}>Edit</button>{" "}
      <button onClick={() => deletePatient(p.patient_id)}>Delete</button>
    </>
  )}
</td>


            </tr>
          ))}
        </tbody>
      </table>

      <br /><br />

<button onClick={() => setShowAddDoctor(!showAddDoctor)}>
  {showAddDoctor ? "Cancel" : "Add New Doctor"}
</button>

{showAddDoctor && (
  <div style={{ marginTop: "20px", marginBottom: "20px" }}>
    <h3>Add Doctor</h3>

    <input
      placeholder="First Name"
      value={newDoctor.first_name}
      onChange={e => setNewDoctor({ ...newDoctor, first_name: e.target.value })}
    />
    <input
      placeholder="Last Name"
      value={newDoctor.last_name}
      onChange={e => setNewDoctor({ ...newDoctor, last_name: e.target.value })}
    />
    <input
      placeholder="Specialization"
      value={newDoctor.specialization}
      onChange={e => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
    />
    <input
      placeholder="Phone Number"
      value={newDoctor.phone_number}
      onChange={e => setNewDoctor({ ...newDoctor, phone_number: e.target.value })}
    />
    <input
      placeholder="Email"
      value={newDoctor.email}
      onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })}
    />
    <input
      type="password"
      placeholder="Password"
      value={newDoctor.password}
      onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })}
    />

    <br /><br />
    <button onClick={addDoctor}>Save Doctor</button>
  </div>
)}

      {/* DOCTORS TABLE */}
      <h2>Doctors</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.doctor_id}>
              <td>{d.doctor_id}</td>
              <td>
  {editingDoctor === d.doctor_id ? (
    <>
      <input
        value={doctorForm.first_name}
        onChange={e => setDoctorForm({ ...doctorForm, first_name: e.target.value })}
      />
      <input
        value={doctorForm.last_name}
        onChange={e => setDoctorForm({ ...doctorForm, last_name: e.target.value })}
      />
    </>
  ) : (
    `${d.first_name} ${d.last_name}`
  )}
</td>

<td>
  {editingDoctor === d.doctor_id ? (
    <input
      value={doctorForm.specialization}
      onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
    />
  ) : (
    d.specialization
  )}
</td>

<td>
  {editingDoctor === d.doctor_id ? (
    <input
      value={doctorForm.phone_number}
      onChange={e => setDoctorForm({ ...doctorForm, phone_number: e.target.value })}
    />
  ) : (
    d.phone_number
  )}
</td>

<td>
  {editingDoctor === d.doctor_id ? (
    <button onClick={() => saveDoctor(d.doctor_id)}>Save</button>
  ) : (
    <>
      <button onClick={() => startEditDoctor(d)}>Edit</button>{" "}
      <button onClick={() => deleteDoctor(d.doctor_id)}>Delete</button>
    </>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
