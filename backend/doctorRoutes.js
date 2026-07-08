const express = require("express");
const db = require("./db");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// Upload medical image
router.post(
  "/medical-images",
  upload.single("image"),
  (req, res) => {
    const { record_id, description } = req.body;

    if (!req.file || !record_id) {
      return res.status(400).json({ message: "Image and record ID required" });
    }

    db.query(
      `INSERT INTO medical_images
       (record_id, file_path, upload_date, description)
       VALUES (?, ?, NOW(), ?)`,
      [record_id, req.file.path, description],
      (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Image uploaded successfully" });
      }
    );
  }
);

/* DOCTOR PROFILE */
router.get("/profile/:userId", (req, res) => {
  db.query(
    "SELECT * FROM doctors WHERE user_id=?",
    [req.params.userId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data[0]);
    }
  );
});
// View patient medical history (doctor-only)
router.get("/patient-history/:patientId", (req, res) => {
  db.query(
    "SELECT * FROM v_patient_full_history WHERE patient_id = ?",
    [req.params.patientId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});
// Add medical record
router.post("/medical-records", (req, res) => {
  const { patient_id, diagnosis, prescription, visit_date } = req.body;
  const doctorUserId = req.body.user_id;

  if (!patient_id || !diagnosis || !prescription) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "SELECT doctor_id FROM doctors WHERE user_id = ?",
    [doctorUserId],
    (err, result) => {
      if (err || result.length === 0) return res.status(400).send("Doctor not found");

      db.query(
        `INSERT INTO medical_records 
         (patient_id, diagnosis, prescription, visit_date, doctor_id)
         VALUES (?, ?, ?, CURDATE(), ?)`,
        [patient_id, diagnosis, prescription, result[0].doctor_id],
        () => res.json({ message: "Medical record added" })
      );
    }
  );
});
router.post("/medical-images", (req, res) => {
  const { record_id, file_path, description } = req.body;

  db.query(
    `INSERT INTO medical_images 
     (record_id, file_path, upload_date, description)
     VALUES (?, ?, NOW(), ?)`,
    [record_id, file_path, description],
    () => res.json({ message: "Image added" })
  );
});
// Add medical record
router.post("/medical-records", (req, res) => {
  const { user_id, patient_id, diagnosis, prescription } = req.body;

  if (!patient_id || !diagnosis || !prescription) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "SELECT doctor_id FROM doctors WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).json({ message: "Doctor not found" });
      }

      db.query(
        `INSERT INTO medical_records 
         (patient_id, diagnosis, prescription, visit_date, doctor_id)
         VALUES (?, ?, ?, CURDATE(), ?)`,
        [patient_id, diagnosis, prescription, result[0].doctor_id],
        (err) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Medical record added successfully" });
        }
      );
    }
  );
});
// Add medical image (simple version)
router.post("/medical-images", (req, res) => {
  const { record_id, file_path, description } = req.body;

  db.query(
    `INSERT INTO medical_images 
     (record_id, file_path, upload_date, description)
     VALUES (?, ?, NOW(), ?)`,
    [record_id, file_path, description],
    () => res.json({ message: "Image saved" })
  );
});

// Update appointment status
router.put("/appointments/:id/status", (req, res) => {
  const { status } = req.body;
  const appointmentId = req.params.id;

  if (!["completed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE appointments SET status = ? WHERE appointment_id = ?",
    [status, appointmentId],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Status updated successfully" });
    }
  );
});

/* DOCTOR APPOINTMENTS */
router.get("/appointments/:userId", (req, res) => {
  const sql = `
    SELECT a.*, p.first_name, p.last_name
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.doctor_id
    JOIN patients p ON a.patient_id = p.patient_id
    WHERE d.user_id = ?
  `;
  db.query(sql, [req.params.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

module.exports = router;
