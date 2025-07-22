npm init -y
npm install express sqlite3 cors 

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // or your mysql username
  password: 'password', // your mysql password
  database: 'my_pg_db' // the database you created
});

// Create bookings table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  room TEXT,
  date TEXT
)`);

// API endpoint to handle bookings
app.post('/api/book', (req, res) => {
  const { name, room, date } = req.body;
  if (!name || !room || !date) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  db.run(
    `INSERT INTO bookings (name, room, date) VALUES (?, ?, ?)`,
    [name, room, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, bookingId: this.lastID });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 