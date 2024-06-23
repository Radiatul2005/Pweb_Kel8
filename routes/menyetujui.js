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

// Route untuk menampilkan halaman menyetujui jadwal
router.get('/', (req, res) => {
    const query = 'SELECT * FROM jadwalsidang WHERE Status = "Menunggu Persetujuan"';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Format waktu sidang menggunakan moment.js
        results.forEach((jadwal) => {
            jadwal.WaktuSidang = moment(jadwal.WaktuSidang).format('YYYY-MM-DD HH:mm:ss');
        });

        res.render('menyetujui', { 
            jadwalsidang: results, 
            success_msg: req.flash('success_msg'), 
            error_msg: req.flash('error_msg') 
        });
    });
});

// Route untuk menyetujui jadwal
router.post('/setujui_jadwal/:jadwalID', (req, res) => {
    const jadwalID = req.params.jadwalID;
    const updateQuery = 'UPDATE jadwalsidang SET Status = "Disetujui" WHERE JadwalID = ?';
    
    console.log(`Menyetujui jadwal dengan ID ${jadwalID}`); // Debugging log

    db.query(updateQuery, [jadwalID], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            req.flash('error_msg', 'Terjadi kesalahan saat menyetujui jadwal.');
            res.redirect('/menyetujui');
            return;
        }

        console.log(`Jadwal sidang dengan ID ${jadwalID} telah disetujui.`);
        req.flash('success_msg', 'Jadwal berhasil disetujui.');
        res.redirect('/menyetujui');
    });
});


module.exports = router;
