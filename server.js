const express = require("express");
const { Pool } = require("pg");   // ✅ changed
const app = express();

app.use(express.json());
app.use(express.static("public"));

// ✅ RENDER DATABASE CONNECTION
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// TEST CONNECTION
db.connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch(err => console.log("DB ERROR ❌", err));


// SEND MESSAGE
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)";

  try {
    await db.query(sql, [name, email, message]);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});


// GET MESSAGES
app.get("/messages", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM contacts ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.json([]);
  }
});


// START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running 🚀");
});