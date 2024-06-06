const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Membuat instance router dari express
const router = express.Router();

// Konfigurasi koneksi ke MySQL
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

// Endpoint untuk halaman form
router.get('/', (req, res) => {
  res.render('form'); // Pastikan ini merender file form.ejs
});

router.post('/', (req, res) => {
  // Extract form data from request body
  const { name, nim, fakultas, semester, waktu, dosenPembimbing1, dosenPembimbing2, judulSkripsi, deskripsi } = req.body;

  // Construct SQL query
  const query = 'INSERT INTO form (name, nim, fakultas, semester, waktu, dosenPembimbing1, dosenPembimbing2, judulSkripsi, deskripsi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [name, nim, fakultas, semester,  waktu, dosenPembimbing1, dosenPembimbing2, judulSkripsi, deskripsi];

  // Log the SQL query and parameters
  console.log('Executing SQL query:', query);
  console.log('Parameters:', params);

  // Execute the query
  db.query(query, params, (error, results, fields) => {
    if (error) {
      console.error('Error inserting form data:', error);
      res.status(500).send('Error submitting form data');
    } else {
      console.log('Form data inserted successfully:', results);
      res.send('Form submitted successfully');
    }
  });
});

module.exports = router;
