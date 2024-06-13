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
  res.render('login');
});

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Please provide username and password');
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Error in database query:', err);
      return res.status(500).send('An error occurred. Please try again later.');
    }

    if (results.length === 0) {
      return res.status(401).send('Incorrect Username and/or Password');
    }

    const match = await bcrypt.compare(password, results[0].password);
    if (match) {

      const token = jwt.sign(
        { 
          id: results[0].id,
          username: results[0].username,
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          email: results[0].email,
          no_hp: results[0].no_hp,
          alamat: results[0].alamat,
        },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: 86400 } 
      );

      res.cookie("token", token, { httpOnly: true });

      req.session.loggedin = true;
      req.session.username = results[0].username;
      req.session.first_name = results[0].first_name;
      req.session.last_name = results[0].last_name;
      req.session.email = results[0].email;
      req.session.no_hp = results[0].no_hp;
      req.session.alamat = results[0].alamat;

      return res.redirect('/dashboard');

    } else {
      return res.status(401).send('Incorrect Username and/or Password');
    }
  });
});

module.exports = router;
