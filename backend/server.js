require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const doctorRoutes = require("./doctorRoutes");
const patientRoutes = require("./patientRoutes");



const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
