const { Pool } = require("pg");

// ✅ Create connection pool for Render PostgreSQL
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Test connection
db.connect((err, client, release) => {
  if (err) {
    console.error("DB ERROR ❌", err);
  } else {
    console.log("PostgreSQL Connected ✅");
    release();
  }
});

module.exports = db;