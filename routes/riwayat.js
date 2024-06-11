const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Buat koneksi ke database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Mengambil data dari tabel riwayat berdasarkan username
router.get('/', isAuthenticated, function(req, res, next) {
  const username = req.session.username;  // Ambil username dari sesi
  connection.query('SELECT * FROM riwayat WHERE username = ?', [username], function (error, results, fields) {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Error executing query');
      return;
    }
    // Rendering halaman riwayat.ejs dan mengirimkan data jika diperlukan
    res.render('riwayat', { title: 'Riwayat Sidang', data: results });
  });
});

module.exports = router;
