const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const jwt = require('jsonwebtoken');
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
  res.render('inputnilai'); 
});

router.post('/', (req, res) => {

  const {username, dosen_penguji_1, dosen_penguji_2, dosen_penguji_3  } = req.body;

  const query = 'INSERT INTO penilaian (username, dosen_penguji_1, dosen_penguji_2, dosen_penguji_3 ) VALUES (?, ?, ?, ?)';
  const params = [username, dosen_penguji_1, dosen_penguji_2, dosen_penguji_3 ];

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