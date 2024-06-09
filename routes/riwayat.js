var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Buat koneksi ke database
var connection = mysql.createConnection({
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

// Mengambil data dari tabel riwayat
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM riwayat', function (error, results, fields) {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return;
    }
    // Rendering halaman riwayat.ejs dan mengirimkan data jika diperlukan
    res.render('riwayat', { title: 'Riwayat Sidang', data: results });
  });
});

module.exports = router;
