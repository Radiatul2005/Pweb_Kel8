const express = require('express');
const router = express.Router();

// Tambahkan middleware untuk memeriksa sesi pengguna (jika diperlukan)
router.get('/', (req, res) => {
  // Render halaman profil
  res.render('profile'); // Pastikan Anda memiliki file profile.ejs di folder views
});

module.exports = router;
