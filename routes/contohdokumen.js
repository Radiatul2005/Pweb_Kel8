const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

router.use(express.urlencoded({ extended: true }));

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

router.post('/view', (req, res) => {
    const dokumen = req.body.dokumen;
    res.redirect(`/contohdokumen/view/${encodeURIComponent(dokumen)}`);
});

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
        res.contentType('application/pdf'); 
        res.send(document.filedata);
    });
});

module.exports = router;
