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

// Route untuk menampilkan halaman penilaian
router.get('/', (req, res) => {
    const query = 'SELECT * FROM nilai_sidang';
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

        res.render('penilaian', { 
            jadwalsidang: results, 
            success_msg: req.flash('success_msg'), 
            error_msg: req.flash('error_msg') 
        });
    });
});

// Route untuk menyimpan data penilaian
router.post('/simpan', (req, res) => {
    const { NIM, Nilai, WaktuSidang } = req.body;
    let Predikat, HasilAkhir;

    if (Nilai >= 85) {
        Predikat = 'A';
    } else if (Nilai >= 80) {
        Predikat = 'A-';
    } else if (Nilai >= 75) {
        Predikat = 'B+';
    } else if (Nilai >= 70) {
        Predikat = 'B';
    } else if (Nilai >= 65) {
        Predikat = 'B-';
    } else if (Nilai >= 60) {
        Predikat = 'C+';
    } else if (Nilai >= 55) {
        Predikat = 'C';
    } else if (Nilai >= 50) {
        Predikat = 'D';
    } else {
        Predikat = 'E';
    }

    HasilAkhir = Nilai >= 50 ? 'Lulus' : 'Tidak Lulus';

    const insertQuery = 'INSERT INTO nilai_sidang (NIM, Nilai, Predikat, HasilAkhir, WaktuSidang) VALUES (?, ?, ?, ?, ?)';

    db.query(insertQuery, [NIM, Nilai, Predikat, HasilAkhir, WaktuSidang], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            req.flash('error_msg', 'Terjadi kesalahan saat menyimpan data.');
            res.redirect('/penilaian');
            return;
        }
        req.flash('success_msg', 'Data berhasil disimpan.');
        res.redirect('/penilaian');
    });
});

// Route untuk menghapus data penilaian
router.post('/hapus/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = 'DELETE FROM nilai_sidang WHERE NilaiID = ?';

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            req.flash('error_msg', 'Terjadi kesalahan saat menghapus data.');
            res.redirect('/penilaian');
            return;
        }
        req.flash('success_msg', 'Data berhasil dihapus.');
        res.redirect('/penilaian');
    });
});

module.exports = router;
