const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('evaluasi_nilai');
});

module.exports = router;