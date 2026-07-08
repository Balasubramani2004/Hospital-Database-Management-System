const express = require("express");
const db = require("./db");
const router = express.Router();

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, users) => {
      if (err) return res.status(500).json(err);
      if (users.length === 0)
        return res.status(401).json({ message: "Invalid login" });

      if (users[0].password_hash !== password)
        return res.status(401).json({ message: "Invalid login" });

      res.json({
        user_id: users[0].user_id,
        role: users[0].role
      });
    }
  );
});

module.exports = router;
