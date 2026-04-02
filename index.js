const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// DB CONNECTION

const cors = require("cors");


app.use(cors());


// ✅ Railway DB connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// ✅ Create table
db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
    return;
  }
  console.log("Connected to DB");

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

  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error");
    }
    res.send("Success");
  });
});

// ✅ GET - fetch messages
app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages", (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
});

// ✅ IMPORTANT (Railway port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));