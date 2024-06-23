const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the destination for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
    }
});

const upload = multer({ storage: storage });

// Fetch and render data
router.get('/', (req, res) => {
    const query = 'SELECT * FROM hasilkelulusan';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data: ', error);
            return res.status(500).send('Internal Server Error');
        }
        res.render('hasilkelulusan_evaluasi', { data: results });
    });
});

// Handle form submission to update table
router.post('/upload', upload.single('fileInput'), (req, res) => {
    const { id, nama, programStudi, tanggalSidang } = req.body;

    // Make sure id is valid and exists in the database
    const checkQuery = 'SELECT * FROM hasilkelulusan WHERE id = ?';
    connection.query(checkQuery, [id], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking ID in database:', checkError);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (checkResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid ID' });
        }

        const updateQuery = 'UPDATE hasilkelulusan SET nama = ?, programStudi = ?, tanggalSidang = ?, pathFile = ? WHERE id = ?';

        // Assuming req.file.filename gives the uploaded file name
        const filePath = 'uploads/' + req.file.filename;
        
        connection.query(updateQuery, [nama, programStudi, tanggalSidang, filePath, id], (error, results) => {
            if (error) {
                console.error('Error updating data in database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ 
                success: true,
                filePath: filePath // Return file path to frontend
            });
        });
    });
});

// Fetch detail by ID
router.get('/detail/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM hasilkelulusan WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching detail:', error);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Data not found');
        }
        res.json(results[0]);
    });
});

module.exports = router;
