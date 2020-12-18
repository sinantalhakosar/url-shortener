var express = require('express');
var router = express.Router();
const { authJwt } = require("../middleware");

const { body,validationResult } = require('express-validator');
const UserService = require("../services/user.services");
var jwt = require('jsonwebtoken');
const { db } = require('../models');
const fetch = require("node-fetch");

/* GET dashboard page. */
router.get('/', authJwt.verifyToken,function(req, res, next) {
    console.log(req)
    
  });


module.exports = router;
