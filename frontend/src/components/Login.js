import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const login = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    localStorage.setItem("user_id", res.data.user_id);
    localStorage.setItem("role", res.data.role);

    if (res.data.role === "admin") navigate("/admin");
    if (res.data.role === "doctor") navigate("/doctor");
    if (res.data.role === "patient") navigate("/patient");

  } catch (err) {
    alert("Invalid email or password");
  }
};

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
}

export default Login;
