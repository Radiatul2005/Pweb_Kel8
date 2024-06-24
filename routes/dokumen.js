const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('dokumen'); 
});

module.exports = router;
