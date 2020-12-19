var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator');
const UrlService = require("../services/url.services");

/* GET home page. */
router.get('/', function(req, res, next) {
  try{
    res.render('index', { title: 'Express' });
  }catch(error){
    console.log(error)
    res.render('500')
  }
});

/* GET favicon.ico prevent falling /:short_url route since browsers first request /favicon.ico */
router.get('/favicon.ico', function(req, res) { 
  try{
    res.status(204);
    res.end();    
  }catch(error){
    console.log(error)
    res.render('500')
  }
});

  /* GET short_url's match. */
  router.get('/:short_url', async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        console.log("ERROR")
        res.render('400')
    }else {
        // Data from form is valid.
        try {
            var short_url = req.params.short_url;
            let foundUrl = await UrlService.findUrlsOfUserByShortUrl(short_url)
            if(foundUrl === null){
              res.render('428')
              return;
            }
            res.redirect(foundUrl.dataValues.long_url)
          } catch (error) {
            console.log(error);
            res.render('500')
          }
    }
  });

module.exports = router;
