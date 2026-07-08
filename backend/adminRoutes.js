const express = require("express");
const db = require("./db");
const router = express.Router();

// Get all active patients
router.get("/patients", (req, res) => {
  db.query(
    "SELECT patient_id, first_name, last_name, gender, phone_number FROM patients WHERE is_active = 1",
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});
// Update patient
router.put("/patients/:id", (req, res) => {
  const { first_name, last_name, gender, phone_number } = req.body;
  const patientId = req.params.id;

  if (!first_name || !last_name || !gender || !phone_number) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    `UPDATE patients 
     SET first_name = ?, last_name = ?, gender = ?, phone_number = ?
     WHERE patient_id = ?`,
    [first_name, last_name, gender, phone_number, patientId],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Patient updated successfully" });
    }
  );
});
// Add new doctor
router.post("/doctors", (req, res) => {
  const {
    first_name,
    last_name,
    specialization,
    phone_number,
    email,
    password
  } = req.body;

  if (!first_name || !last_name || !specialization || !phone_number || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 1. Create login account
  db.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'doctor')",
    [email, password],
    (err, userResult) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).send(err);
      }

      // 2. Create doctor profile
      db.query(
        `INSERT INTO doctors 
         (user_id, first_name, last_name, specialization, phone_number, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [
          userResult.insertId,
          first_name,
          last_name,
          specialization,
          phone_number
        ],
        (err) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Doctor added successfully" });
        }
      );
    }
  );
});

// Soft delete patient
router.delete("/patients/:id", (req, res) => {
  const patientId = req.params.id;

  db.query(
    "UPDATE patients SET is_active = 0 WHERE patient_id = ?",
    [patientId],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Patient deleted successfully" });
    }
  );
});
// Update doctor
router.put("/doctors/:id", (req, res) => {
  const { first_name, last_name, specialization, phone_number } = req.body;
  const doctorId = req.params.id;

  if (!first_name || !last_name || !specialization || !phone_number) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    `UPDATE doctors
     SET first_name = ?, last_name = ?, specialization = ?, phone_number = ?
     WHERE doctor_id = ?`,
    [first_name, last_name, specialization, phone_number, doctorId],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Doctor updated successfully" });
    }
  );
});

// Soft delete doctor
router.delete("/doctors/:id", (req, res) => {
  const doctorId = req.params.id;

  db.query(
    "UPDATE doctors SET is_active = 0 WHERE doctor_id = ?",
    [doctorId],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Doctor deleted successfully" });
    }
  );
});

// Get all active doctors
router.get("/doctors", (req, res) => {
  db.query(
    "SELECT doctor_id, first_name, last_name, specialization, phone_number FROM doctors WHERE is_active = 1",
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

/* ADD DOCTOR */
router.post("/add-doctor", (req, res) => {
  const { first_name, last_name, specialization, phone_number, email, password } = req.body;

  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'doctor')",
    [email, password],
    (err, userResult) => {
      if (err) return res.status(500).json(err);

      db.query(
        `INSERT INTO doctors (user_id, first_name, last_name, specialization, phone_number)
         VALUES (?, ?, ?, ?, ?)`,
        [userResult.insertId, first_name, last_name, specialization, phone_number],
        err => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Doctor added" });
        }
      );
    }
  );
});

/* DELETE DOCTOR */
router.delete("/doctor/:id", (req, res) => {
  db.query("DELETE FROM doctors WHERE doctor_id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Doctor deleted" });
  });
});

/* DELETE PATIENT */
router.delete("/patient/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE patient_id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Patient deleted" });
  });
});

module.exports = router;
