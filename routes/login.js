const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const router = express.Router();

// Konfigurasi koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint untuk halaman login
router.get('/', (req, res) => {
  res.render('login'); // Pastikan ini merender file login.ejs
});

// Endpoint untuk login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Memeriksa apakah username dan password telah disediakan
  if (!username || !password) {
    return res.status(400).send('Please provide username and password');
  }

  // Memeriksa kecocokan username di database
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error in database query:', err);
      return res.status(500).send('An error occurred. Please try again later.');
    }

    // Jika tidak ada hasil dari query
    if (results.length === 0) {
      return res.status(401).send('Incorrect Username and/or Password!');
    }

    // Memeriksa apakah password cocok
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('An error occurred. Please try again later.');
      }

      if (isMatch) {
        // Setting session variables
        req.session.loggedin = true;
        req.session.username = username;
        console.log(req.session); // Logging session after successful login
        // Redirect to dashboard after successful login
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect Username and/or Password!');
      }
    });
  });
});

module.exports = router;
