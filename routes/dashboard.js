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
router.get('/', authJwt.verifyToken,async function(req, res, next) {
    let urls = await UrlService.findAllUrlsOfUser(req.userId);
    let urlsArray = []
    urls.forEach((url)=>{
        urlsArray.push(url.dataValues)
    })
    res.render('dashboard',{projects : urlsArray})
  });


module.exports = router;
