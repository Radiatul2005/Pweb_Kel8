const express = require('express');
const app = express();
const path = require('path');

// Menyajikan file statis dari folder yang sama dengan file app.js
app.use(express.static(__dirname));

// Menyajikan file Login.html saat klien melakukan permintaan ke URL '/login'
app.get('/login', (req, res) => {
  console.log('Akses ke rute /login berhasil');
  res.sendFile(path.join(__dirname, '..', 'tugasBesar', 'Login.html'));
});

// Route untuk path root ("/")
app.get('/', (req, res) => {
  // Kirimkan respons yang sesuai untuk halaman utama aplikasi Anda
  res.send('Welcome to my app!');
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
