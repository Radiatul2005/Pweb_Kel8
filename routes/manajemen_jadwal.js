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
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Route untuk menampilkan halaman manajemen jadwal
router.get('/', (req, res) => {
    const query = 'SELECT * FROM jadwalsidang';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const formattedResults = results.map(jadwal => ({
            ...jadwal,
            WaktuSidang: moment(jadwal.WaktuSidang).format('YYYY-MM-DD HH:mm:ss')
        }));
        res.render('manajemen_jadwal', { 
            jadwalsidang: formattedResults, 
            success_msg: req.flash('success_msg'), 
            error_msg: req.flash('error_msg') 
        });
    });
});

// Route untuk menangani pengambilan jadwal
router.post('/ambil_jadwal/:jadwalID', (req, res) => {
    const jadwalID = req.params.jadwalID;
    const updateQuery = 'UPDATE jadwalsidang SET Status = "Menunggu Persetujuan" WHERE JadwalID = ?';
    
    db.query(updateQuery, [jadwalID], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            req.flash('error_msg', 'Terjadi kesalahan saat mengambil jadwal.');
            res.redirect('/manajemen_jadwal');
            return;
        }
        console.log(`Jadwal sidang dengan ID ${jadwalID} telah diambil.`);
        req.flash('success_msg', 'Jadwal berhasil diambil.');
        res.redirect('/manajemen_jadwal');
    });
});

// Route untuk menangani undo pengambilan jadwal
router.post('/undo_ambil_jadwal/:jadwalID', (req, res) => {
    const jadwalID = req.params.jadwalID;
    const updateQuery = 'UPDATE jadwalsidang SET Status = "Menunggu Persetujuan" WHERE JadwalID = ?';
    
    db.query(updateQuery, [jadwalID], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            req.flash('error_msg', 'Terjadi kesalahan saat mengembalikan jadwal.');
            res.redirect('/manajemen_jadwal');
            return;
        }
        console.log(`Jadwal sidang dengan ID ${jadwalID} telah dikembalikan.`);
        req.flash('success_msg', 'Jadwal berhasil dikembalikan.');
        res.redirect('/manajemen_jadwal');
    });
});

module.exports = router;
