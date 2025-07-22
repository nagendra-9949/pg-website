const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Connect to SQLite database (creates file if not exists)
const db = new sqlite3.Database('bookings.db', (err) => {
  if (err) {
    console.error('Database Connection Error:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Create bookings table if it doesn't exist (add docPath column)
const createTableQuery = `
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  aadhar TEXT,
  roomType TEXT,
  message TEXT,
  date TEXT,
  docPath TEXT
)`;
db.run(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating bookings table:', err.message);
  } else {
    console.log('Bookings table ready.');
  }
});

// POST - save booking to SQLite (with file upload)
app.post('/api/book', upload.single('aadharDoc'), (req, res) => {
  const { name, email, phone, aadhar, roomType, message, date } = req.body;
  const docPath = req.file ? `/uploads/${req.file.filename}` : null;
  const insertQuery = `INSERT INTO bookings (name, email, phone, aadhar, roomType, message, date, docPath) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(insertQuery, [name, email, phone, aadhar, roomType, message, date, docPath], function(err) {
    if (err) {
      console.error('Error inserting booking:', err.message);
      return res.status(500).send({ error: 'Database error' });
    }
    res.status(200).json({ id: this.lastID });
  });
});

// GET - view bookings from SQLite
app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching bookings:', err.message);
      return res.status(500).send({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
