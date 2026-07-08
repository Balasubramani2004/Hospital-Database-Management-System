const express = require("express");
const db = require("./db");
const router = express.Router();

/* REGISTER */
router.post("/register", (req, res) => {
  const { first_name, last_name, email, password, gender, phone_number, address } = req.body;

  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'patient')",
    [email, password],
    (err, userResult) => {
      if (err) return res.status(500).json(err);

      db.query(
        `INSERT INTO patients (user_id, first_name, last_name, gender, phone_number, address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userResult.insertId, first_name, last_name, gender, phone_number, address],
        err => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Registered successfully" });
        }
      );
    }
  );
});
router.get("/medical-images/:patientId", (req, res) => {
  const sql = `
    SELECT mi.file_path, mi.image_type, mi.description, mi.upload_date
    FROM medical_images mi
    JOIN medical_records mr ON mi.record_id = mr.record_id
    WHERE mr.patient_id = ?
  `;

  db.query(sql, [req.params.patientId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* PROFILE */
router.get("/profile/:userId", (req, res) => {
  db.query(
    "SELECT * FROM patients WHERE user_id=?",
    [req.params.userId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data[0]);
    }
  );
});

// Update patient profile
router.put("/profile/:userId", (req, res) => {
  const { phone_number, address } = req.body;

  if (!phone_number || !address) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "UPDATE patients SET phone_number = ?, address = ? WHERE user_id = ?",
    [phone_number, address, req.params.userId],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Profile updated successfully" });
    }
  );
});

// Get patient medical history
router.get("/history/:userId", (req, res) => {
  db.query(
    `SELECT * FROM v_patient_full_history 
     WHERE patient_id = (SELECT patient_id FROM patients WHERE user_id = ?)`,
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});
// Get medical images for patient
router.get("/medical-images/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `
    SELECT mi.file_path, mi.description
    FROM medical_images mi
    JOIN medical_records mr ON mi.record_id = mr.record_id
    JOIN patients p ON mr.patient_id = p.patient_id
    WHERE p.user_id = ?
    `,
    [userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json(result);
    }
  );
});


/* DOCTORS LIST */
router.get("/doctors", (req, res) => {
  db.query("SELECT doctor_id, first_name, last_name, specialization FROM doctors",
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
});
// Get patient's appointments
router.get("/appointments/:userId", (req, res) => {
  const sql = `
    SELECT 
      a.appointment_id,
      a.appointment_date,
      a.appointment_time,
      a.reason_for_visit,
      a.status,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name,
      d.specialization
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id
    WHERE p.user_id = ?
    ORDER BY a.appointment_date DESC
  `;

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

/* BOOK APPOINTMENT */
router.post("/appointment", (req, res) => {
  const { user_id, doctor_id, appointment_date, appointment_time, reason } = req.body;

  const sql = `
    INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit)
    VALUES ((SELECT patient_id FROM patients WHERE user_id=?), ?, ?, ?, ?)
  `;

  db.query(sql,
    [user_id, doctor_id, appointment_date, appointment_time, reason],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Appointment booked" });
    });
});
router.post("/book-appointment", (req, res) => {
  const {
    patient_id,   // this is user_id from frontend
    doctor_id,
    appointment_date,
    appointment_time,
    reason_for_visit
  } = req.body;

  // STEP 1: get real patient_id using user_id
  const getPatientSql = `
    SELECT patient_id FROM patients WHERE user_id = ?
  `;

  db.query(getPatientSql, [patient_id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ message: "Patient not found" });
    }

    const realPatientId = result[0].patient_id;

    // STEP 2: insert appointment
    const insertSql = `
      INSERT INTO appointments
      (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    db.query(
      insertSql,
      [
        realPatientId,
        doctor_id,
        appointment_date,
        appointment_time,
        reason_for_visit
      ],
      err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Insert failed" });
        }
        res.json({ message: "Appointment booked successfully" });
      }
    );
  });
});

module.exports = router;
