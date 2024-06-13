const express = require('express');
const router = express.Router();
const mysql = require('mysql');


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

router.get('/', (req, res) => {
    const query = 'SELECT * FROM jadwalsidang';
    db.query(query, (err, results) => {
        if (err) throw err;
    res.render('manajemen_jadwal');
    })
});



module.exports = router;