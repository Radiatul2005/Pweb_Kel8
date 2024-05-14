// Import modul yang diperlukan
const express = require('express');
const app = express();

// Atur template engine EJS
app.set('view engine', 'ejs');

// Route untuk halaman dashboard
app.get('/dashboard', (req, res) => {
    // Ambil nama pengguna dari session atau database, disini kita asumsikan nama pengguna tersedia di session
    const username = req.session.username;

    // Render halaman dashboard dan kirimkan nilai username ke dalam view
    res.render('dashboard', { username: username });
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
