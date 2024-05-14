const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// GET login page
router.get('/', (req, res) => {
  res.render('login', { title: 'Login' });
});

// POST login
router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
      if (error) {
        console.error('Error in database query:', error);
        res.render('login', { title: 'Login', errorMessage: 'An error occurred. Please try again later.' });
        return;
      }

      if (results.length > 0) {
        // Jika login berhasil, atur sesi dan arahkan ke halaman dashboard
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        // Jika login gagal, tampilkan pesan kesalahan di halaman login yang sama
        res.render('login', { title: 'Login', errorMessage: 'Incorrect Username and/or Password!', username: username });
      }
    });
  } else {
    // Jika username atau password kosong, tampilkan pesan kesalahan di halaman login yang sama
    res.render('login', { title: 'Login', errorMessage: 'Please enter Username and Password!' });
  }
});

module.exports = router;
