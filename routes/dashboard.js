const express = require('express');
const router = express.Router();

// Route untuk halaman dashboard
router.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.render('dashboard', { username: req.session.username });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
