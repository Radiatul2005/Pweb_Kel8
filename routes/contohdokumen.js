const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Konfigurasi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

// Koneksi ke MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware untuk mengatur body-parser
router.use(express.urlencoded({ extended: true }));

// Route untuk menampilkan halaman contoh dokumen
router.get('/', (req, res) => {
    const query = 'SELECT filename FROM documents';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching documents:', err);
            return res.status(500).send('Server error');
        }
        res.render('contohdokumen', { documents: results });
    });
});

// Route untuk menangani permintaan view dokumen
router.post('/view', (req, res) => {
    const dokumen = req.body.dokumen;
    res.redirect(`/contohdokumen/view/${encodeURIComponent(dokumen)}`);
});

// Route untuk menampilkan dokumen berdasarkan filename (PDF)
router.get('/view/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);

    const query = 'SELECT filename, filedata FROM documents WHERE filename = ?';
    db.query(query, [filename], (err, result) => {
        if (err) {
            console.error('Error fetching document:', err);
            return res.status(500).send('Server error');
        }

        if (result.length === 0) {
            console.log('Document not found in database for filename:', filename);
            return res.status(404).send('Document not found');
        }

        const document = result[0];
        res.contentType('application/pdf'); // Set content type to PDF
        res.send(document.filedata);
    });
});

module.exports = router;
