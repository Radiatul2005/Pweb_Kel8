const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const moment = require('moment');

// Membuat koneksi ke MySQL
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

// Route untuk menampilkan halaman laporan analisis
router.get('/', (req, res) => {
    const query = 'SELECT * FROM nilai_sidang';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Format waktu sidang menggunakan moment.js
        const formattedResults = results.map(nilai =>   ({
            ...nilai,
            WaktuSidang: moment(nilai.WaktuSidang).format('YYYY-MM-DD HH:mm:ss')
        }));

        res.render('evaluasi_nilai', { 
            nilaiSidang: formattedResults, 
            success_msg: req.flash('success_msg'), 
            error_msg: req.flash('error_msg') 
        });
    });
});

module.exports = router;
