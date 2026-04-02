const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// DB CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "flower", // 👉 put your mysql password if you have
  database: "portfolio_db"
});

db.connect(err => {
  if (err) console.log("DB ERROR ❌", err);
  else console.log("MySQL Connected ✅");
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