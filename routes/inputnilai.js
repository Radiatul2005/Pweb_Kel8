const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Konfigurasi database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

// Hubungkan ke database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// Rute untuk halaman input nilai
router.get('/', (req, res) => {
    const sql = 'SELECT name FROM form';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('inputnilai', { names: results });
    });
});

module.exports = router;
