const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const router = express.Router();

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



router.get('/', (req, res) => {
  res.render('form'); 
});

router.post('/', (req, res) => {
  const { name, nim, fakultas, semester, waktu, dosenPembimbing1, dosenPembimbing2, judulSkripsi, deskripsi } = req.body;

  const query = 'INSERT INTO form (name, nim, fakultas, semester, waktu, dosenPembimbing1, dosenPembimbing2, judulSkripsi, deskripsi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [name, nim, fakultas, semester, waktu, dosenPembimbing1, dosenPembimbing2, judulSkripsi, deskripsi];

  console.log('Executing SQL query:', query);
  console.log('Parameters:', params);

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
