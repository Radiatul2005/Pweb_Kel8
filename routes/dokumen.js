const express = require('express');
const router = express.Router();

// Route untuk menampilkan halaman dokumen
router.get('/', (req, res) => {
    res.render('dokumen'); // Render halaman dokumen.ejs
});

module.exports = router;
