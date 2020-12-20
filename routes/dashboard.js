var express = require('express');
var router = express.Router();
const { authJwt } = require("../middleware");
const { validationResult } = require('express-validator');
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
    res.render('dashboard',{projects : urlsArray,   message: req.flash('message') })
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
            let shortUrlExist = await UrlService.findUrlsOfUserByShortUrl(req.body.short_url);
            if(shortUrlExist !== null){
               // res.render('dashboard',{message:"This url exist, please write another.",messageClass: 'alert-warning'});
                req.flash('message', 'This short url already exists');
                res.redirect('/dashboard/shortener');
                return;
            }
            await UrlService.createURL({
                long_url: req.body.long_url,
                short_url: req.body.short_url,
                last_accessed:0,
                access_count: 0,
              }, req.userId);
              req.flash('message', 'Short Url added successfully');
              if(process.env.NODE_ENV === 'test'){
                /*
                  HTTP uses a cycle that requires one response per request. 
                  When the client sends a request (e.g. POST or GET) the server should only send one response back to it.
                  So only for testing, following works with res.send()
                */
                res.send(req.body.short_url);
              }
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
                req.flash('message', 'Short Url deleted successfully');
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

  /* GET statistics page. */
router.get('/stats/:short_url', authJwt.verifyToken,async function(req, res, next) {
  try{
  let urls = await UrlService.findUrlsOfUserByShortUrl(req.params.short_url);
  if(urls.dataValues.last_accessed.getTime() === 0){urls.dataValues.last_accessed = "-"}
  //res.render('dashboard',{projects : urlsArray,   message: req.flash('message') })
  res.render('stats',{urlstat : urls.dataValues,   message: req.flash('message') });
  }catch(error){
      console.log(error)
      res.render('500')
  }
});

module.exports = router;
