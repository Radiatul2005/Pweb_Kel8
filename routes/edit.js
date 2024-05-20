var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('editprofile');
});

router.put('/editprofile', function(req, res, next) {
  const { first_name, last_name, email, phone, password, verify_password } = req.body;
  if (!first_name || !last_name || !email || !phone || !password || !verify_password) {
      return res.status(400).send('Input Invalid');
  }

  if (password !== verify_password) {
      return res.status(400).send('Password dan konfirmasi password tidak cocok');
  }

  res.redirect('/profile');
});

module.exports = router;