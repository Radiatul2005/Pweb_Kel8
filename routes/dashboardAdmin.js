const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth')


router.get('/', middleware.verifyToken,(req, res) => {
  try {
    if (req.session.loggedin) {
      res.render('dashboardAdmin', { username: req.session.username });
    } else {
      res.redirect('/loginAdmin');
    }
  } catch (error) {
    console.error('Error in dashboard route:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
