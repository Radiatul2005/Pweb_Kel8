const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth')

// Route untuk halaman dashboard
router.get('/', middleware.verifyToken,(req, res) => {
  try {
    if (req.session.loggedin) {
      res.render('dashboard', { username: req.session.username });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error in dashboard route:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
