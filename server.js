const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.send(result.rows);
});

app.listen(3000, () => {
  console.log('Server running');
});

// SEND MESSAGE
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

// GET MESSAGES
app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages ORDER BY id DESC", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// START
app.listen(3000, () => {
  console.log("Server running http://localhost:3000 🚀");
});