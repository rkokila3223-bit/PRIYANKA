const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// DB CONNECTION
// ✅ create connection using Railway env variables
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// ✅ connect to DB
db.connect((err) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");

    // ✅ create table if not exists
    db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT
      )
    `);
  }
});

// SEND MESSAGE
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields required");
  }

  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.log("❌ DB Insert Error:", err);
      return res.status(500).send("Database Error");
    }

    console.log("✅ Inserted:", result);
    res.send("Message saved successfully ✅");
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