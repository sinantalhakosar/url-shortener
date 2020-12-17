var express = require('express');
var router = express.Router();

/* GET users login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET users register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

module.exports = router;
