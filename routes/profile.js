const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const router = express.Router();

// Membuat koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

// Menghubungkan ke database dan tampilkan pesan/ menangani kesalahhan
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});




// route halaman profile
router.get('/', (req, res) => {
  // mengambil data dari sesi pengguna
  const data = {
      username : req.session.username,
      first_name : req.session.first_name,
      last_name : req.session.last_name,
      email : req.session.email,
      no_hp : req.session.no_hp,
      alamat : req.session.alamat,
  }
  res.render('profile', data); // merender halaman profile menggunakan ejs dan mengirim data ke template tersebut
});

module.exports = router;
