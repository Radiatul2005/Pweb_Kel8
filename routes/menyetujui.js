const express = require('express');
const router = express.Router();
const mysql = require('mysql');


router.get('/', (req, res) => {
    res.render('menyetujui');
});

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

module.exports = router;