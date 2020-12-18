var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator');
const UserService = require("../services/user.services");
const UrlService = require("../services/url.services");
var jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const config = require("../config/auth.config");
var http = require('http');
  
  /* GET login page. */
  router.get('/login', function(req, res, next) {
    res.render('login');
  });
  
  /* GET register page. */
  router.get('/register', function(req, res, next) {
    res.render('register',{result:"Register"});
  });
  
  /* POST users register. */
  router.post('/register', async function(req, res, next) {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          // Error messages can be returned in an array using `errors.array()`.
          console.log("ERROR")
      }else {
          // Data from form is valid.
          try {
              const username = req.body.username;
              let password = req.body.pass;
              let email = req.body.email;
              if (!username || !password) {
                res.status(400).send({ message: "Username or Password can not be empty" });
              } else {
                if(UserService.isUserExists(username)){
                  res.render('register', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                });
                  return;
                }
                  await UserService.createUser({
                    username: username,
                    password: password,
                    email: email,
                  });
                  res.render('register',{result:"User created Successfully"})
              }
            } catch (error) {
              console.log(error);
              res.status(400).send({ message: "Authentication failed." });
            }
      }
  });
  
  /* POST users login. */
  router.post('/login', async function(req, res, next) {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          // Error messages can be returned in an array using `errors.array()`.
          console.log("ERROR")
      }else {
          // Data from form is valid.
          try {
              const username = req.body.username;
              let password = req.body.pass;
              if (!username || !password) {
                res.status(400).send({ message: "Username or Password can not be empty" });
              } else {
                  console.log(username);
                  console.log(password);
                  let findUser = await UserService.loginUser(username,password);
                  if(findUser instanceof Object){
                    var token = jwt.sign({ id: findUser.user_id }, config.secret, {
                      expiresIn: 86400 // 24 hours
                    });
                    // res.status(200).redirect("/dashboard").send({
                    //   id: findUser.user_id,
                    //   username: findUser.username,
                    //   email: findUser.email,
                    //   accessToken: token
                    // });
                    res.cookie('token', token, {
                      maxAge: 3600000, httpOnly:true
                  });
                  res.redirect('/dashboard/shortener')
                    }else{
                      res.render('login', {
                        message: 'User not found.',
                        messageClass: 'alert-danger'
                    });
                    return;
                    }
              }
            } catch (error) {
              console.log(error);
            }
      }
  });

/* GET logout page. */
router.get('/logout', function(req, res, next) {
    res.clearCookie("token");
    res.render('index');
});

module.exports = router;