const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Konfigurasi koneksi ke MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

// Menghubungkan ke database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Mendefinisikan skema tabel pengguna
const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`;

// Membuat tabel jika belum ada
// connection.query(usersTable, (err) => {
//     if (err) {
//         console.error('Error creating users table:', err);
//         return;
//     }
//     console.log('Users table created or already exists');
// });

// Route to handle password change
router.post('/', (req, res) => {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    // Memeriksa apakah password baru dan konfirmasi password cocok
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Mengambil pengguna dari database
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error selecting user from database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Memastikan pengguna ditemukan
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        // Membandingkan password lama dengan password yang tersimpan
        if (oldPassword !== user.password) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Menyimpan password baru ke database
        connection.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, user.id], (err) => {
            if (err) {
                console.error('Error updating user password:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Password changed successfully' });
        });
    });
});

module.exports = router;
