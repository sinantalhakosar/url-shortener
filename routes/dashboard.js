var express = require('express');
var router = express.Router();
const { authJwt } = require("../middleware");
const { body,validationResult } = require('express-validator');
const UrlService = require("../services/url.services");

/* GET dashboard page. */
router.get('/shortener', authJwt.verifyToken,async function(req, res, next) {
    try{
    let urls = await UrlService.findAllUrlsOfUser(req.userId);
    let urlsArray = []
    urls.forEach((url)=>{
        //url.dataValues.short_url = req.headers.host + "/" + url.dataValues.short_url
        urlsArray.push(url.dataValues)
    })
    res.render('dashboard',{projects : urlsArray})
    }catch(error){
        console.log(error)
        res.render('500')
    }
  });

/* POST dashboard page. */
router.post('/shortener', authJwt.verifyToken, async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        console.log("ERROR")
        res.render('400')
    }else {
        // Data from form is valid.
        try {
            const url1 = await UrlService.createURL({
                long_url: req.body.long_url,
              }, req.userId);
            res.redirect('/dashboard/shortener');
          } catch (error) {
            console.log(error);
            res.render('500')
          }
    }
  });

  /* POST dashboard page url remove. */
router.post('/remove', authJwt.verifyToken, async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        console.log("ERROR")
        res.render('400')
    }else {
        // Data from form is valid.
        try {
            let short_url = req.body.short_url.split('/')[1];
            let delete_response = await UrlService.deleteUrlByShortUrl(short_url);
            if(delete_response){
                res.redirect('/dashboard/shortener');
            }else{
                res.render('500')
            }
          } catch (error) {
            console.log(error);
            res.render('500')
          }
    }
  });


module.exports = router;
