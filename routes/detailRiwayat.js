var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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

router.get('/', function(req, res, next) {
  var username = req.session.username || req.query.username;

  if (!username) {
    res.status(400).send('Username is required');
    return;
  }

  var query = `
    SELECT r.*, p.dosen_penguji_1, p.dosen_penguji_2, p.dosen_penguji_3 
    FROM riwayat r
    LEFT JOIN penilaian p ON r.username = p.username
    WHERE r.username = ?
  `;

  connection.query(query, [username], function (error, results, fields) {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Error executing query');
      return;
    }

    res.render('detailRiwayat', { title: 'Riwayat Sidang', data: results });
  });
});

module.exports = router;
