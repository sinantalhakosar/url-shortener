var express = require('express');
var router = express.Router();
const { authJwt } = require("../middleware");

const { body,validationResult } = require('express-validator');
const UserService = require("../services/user.services");
const UrlService = require("../services/url.services");
var jwt = require('jsonwebtoken');
const { db } = require('../models');
const fetch = require("node-fetch");

/* GET dashboard page. */
router.get('/shortener', authJwt.verifyToken,async function(req, res, next) {
    let urls = await UrlService.findAllUrlsOfUser(req.userId);
    let urlsArray = []
    urls.forEach((url)=>{
        //url.dataValues.short_url = req.headers.host + "/" + url.dataValues.short_url
        urlsArray.push(url.dataValues)
    })
    res.render('dashboard',{projects : urlsArray})
  });

/* POST dashboard page. */
router.post('/shortener', authJwt.verifyToken, async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
        console.log("ERROR")
    }else {
        // Data from form is valid.
        try {
            const url1 = await UrlService.createURL({
                long_url: req.body.long_url,
              }, req.userId);
            res.redirect('/dashboard/shortener');
          } catch (error) {
            console.log(error);
            res.status(400).send({ message: "URL adding failed." });
          }
    }
  });


module.exports = router;
