var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' }); // rendering login.ejs
});

module.exports = router;
