var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator');
const UserService = require("../services/user.services");
const UrlService = require("../services/url.services");
var jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const config = require("../config/auth.config");
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET favicon.ico prevent falling /:short_url route since browsers first request /favicon.ico */
router.get('/favicon.ico', function(req, res) { 
  res.status(204);
  res.end();    
});

  /* GET short_url's match. */
  router.get('/:short_url', async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        console.log("ERROR")
    }else {
        // Data from form is valid.
        try {
            var short_url = req.params.short_url;
            let foundUrl = await UrlService.findUrlsOfUserById(short_url)
            res.redirect("https://" + foundUrl.dataValues.long_url)
          } catch (error) {
            console.log(error);
            res.status(400).send({ message: "URL adding failed." });
          }
    }
  });

module.exports = router;
