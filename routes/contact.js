const express = require("express");
const router = express.Router();
const db = require("../db");

// GET messages
router.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// SEND message
router.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO messages (name,email,message) VALUES (?,?,?)";

  db.query(sql, [name, email, message], (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;