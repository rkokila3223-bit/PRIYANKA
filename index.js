const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express(); // ✅ initialize FIRST

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves your frontend

// ✅ Railway MySQL connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// ✅ Connect + create table
db.connect((err) => {
  if (err) {
    console.log("DB Connection Error:", err);
    return;
  }
  console.log("Connected to Railway MySQL");

  db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      message TEXT
    )
  `);
});

// ✅ POST - save message
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.send("All fields required");
  }

  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err) => {
    if (err) {
      console.log("Insert Error:", err);
      return res.send("Error saving message");
    }
    res.send("Message Saved ✅");
  });
});

// ✅ GET - fetch messages
app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log("Fetch Error:", err);
      return res.json([]);
    }
    res.json(result);
  });
});

// ✅ Test route (optional)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Railway PORT (IMPORTANT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});