const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config(); 

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
        connection.release();
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


cron.schedule('0 * * * *', () => {
    const query = `
        SELECT reminders.*, users.email 
        FROM reminders 
        JOIN users ON reminders.user_id = users.id 
        WHERE reminders.end > NOW() AND reminders.end < DATE_ADD(NOW(), INTERVAL 1 DAY)
    `;
    
    pool.query(query, (err, results) => {
        if (err) {
            return console.error('Terjadi kesalahan saat memeriksa peringatan:', err);
        }

        results.forEach(reminder => {
            const subject = 'Peringatan Mendekati Deadline';
            const text = `Peringatan: ${reminder.reminder}\nBatas Waktu: ${reminder.end}`;
            sendEmail(reminder.email, subject, text);
        });
    });
});

// Definisikan rute untuk /peringatan
router.get('/', (req, res) => {
    res.render('peringatan'); // Render halaman peringatan menggunakan EJS
});

// Middleware untuk memproses data JSON
router.use(express.json());

// Rute untuk menyimpan peringatan (contoh rute POST)
router.post('/simpan-peringatan', (req, res) => {
    const { reminder, user_id, start, end } = req.body;

    console.log('Data received:', req.body); // Tambahkan log ini

    if (!reminder || typeof reminder !== 'string' || !user_id || !start || !end) {
        return res.status(400).send('Data tidak lengkap atau tidak valid.');
    }

    const query = 'INSERT INTO reminders (reminder, user_id, start, `end`) VALUES (?, ?, ?, ?)';
    const values = [reminder, user_id, start, end];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat menyimpan peringatan:', err);
            return res.status(500).send('Terjadi kesalahan saat menyimpan peringatan.');
        }
        console.log('Peringatan berhasil disimpan: ', results);
        res.send('Peringatan berhasil disimpan.');
    });
});

module.exports = router;
