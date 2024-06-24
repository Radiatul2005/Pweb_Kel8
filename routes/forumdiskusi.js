const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const data = {
      
    };
    res.render('forumdiskusi', data);
});

module.exports = router;