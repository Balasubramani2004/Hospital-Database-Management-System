import axios from "axios";
import { useState } from "react";

function PatientRegistration() {
  const [form, setForm] = useState({});

  const submit = () => {
    axios.post("http://localhost:5000/api/patient/register", form)
      .then(() => alert("Registered successfully"));
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="First Name" onChange={e => setForm({ ...form, first_name: e.target.value })} />
      <input placeholder="Last Name" onChange={e => setForm({ ...form, last_name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={submit}>Register</button>
    </div>
  );
}

export default PatientRegistration;
