const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Membuat instance router dari express
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
      return res.status(401).send('Incorrect Username and/or Password');
    }

    const validPassword = (value1, value2) => {
      return value1 === value2;
    };
    
    // Fungsi untuk memvalidasi password
    if (validPassword(password, results[0].password)) {
     
      // Buat token JWT
  const token = jwt.sign(
    { 
      id: results[0].id,
      username :  results[0].username,
      first_name :  results[0].first_name,
      last_name :  results[0].last_name,
      email :  results[0].email,
      no_hp :  results[0].no_hp,
      alamat :  results[0].alamat,
    },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: 86400 } // Masa berlaku token (24 jam)
  );

  // Set cookie dengan token
  res.cookie("token", token, { httpOnly: true });
      // Menyimpan variabel session
      req.session.loggedin = true;
      req.session.username = results[0].username;
      req.session.password = results[0].password;
      req.session.first_name = results[0].first_name;
      req.session.last_name = results[0].last_name;
      req.session.email = results[0].email;
      req.session.no_hp = results[0].no_hp;
      req.session.alamat = results[0].alamat;
      console.log(req.session); // Logging session after successful login
      // Redirect to dashboard after successful login
      res.redirect('/dashboard');
      // res.status(200).json({ message: "Berhasil login!" })
    } else {
      res.status(401).send('Incorrect Username and/or Password!');
    }
  });
});

module.exports = router;
