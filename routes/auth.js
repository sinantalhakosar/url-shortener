var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator');
const UserService = require("../services/user.services");
var jwt = require('jsonwebtoken');
const config = require("../config/auth.config");
  
  /* GET login page. */
  router.get('/login', function(req, res, next) {
    try{
      res.render('login');
    }catch(error){
      console.log(error)
      res.render('500')
    }
  });
  
  /* GET register page. */
  router.get('/register', function(req, res, next) {
    try{
      res.render('register',{result:"Register"});
    }catch(error){
      console.log(error)
      res.render('500')
    }
  });
  
  /* POST register. */
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
                if(await UserService.isUserExists(username)){
                  req.flash('statusMsg', 'User already registered!');
                  res.render('register', { "statusMsg": req.flash("statusMsg")});
                  return;
                }
                  await UserService.createUser({
                    username: username,
                    password: password,
                    email: email,
                  });
                  req.flash('statusMsg', 'User created successfully!');
                  res.render('register', { "statusMsg": req.flash("statusMsg")});
              }
            } catch (error) {
              console.log(error);
              res.render('500')
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
          res.render('400')
      }else {
          // Data from form is valid.
          try {
              const username = req.body.username;
              let password = req.body.pass;
              if (!username || !password) {
                res.status(400).send({ message: "Username or Password can not be empty" });
              } else {
                  let findUser = await UserService.loginUser(username,password);
                  if(findUser instanceof Object){
                    var token = jwt.sign({ id: findUser.user_id }, config.secret, {
                      expiresIn: 86400 // 24 hours
                    });
                    res.cookie('token', token, {
                      maxAge: 3600000, httpOnly:true
                  });
                  res.redirect('/dashboard/shortener')
                    }else{
                    //   res.render('login', {
                    //     message: 'User not found.',
                    //     messageClass: 'alert-warning'
                    // });
                    req.flash('errorMsg', 'User not found!');
                    res.render('login', { "errorMsg": req.flash("errorMsg")});
                    return;
                    }
              }
            } catch (error) {
              console.log(error);
              res.render('500')
            }
      }
  });

/* GET logout page. */
router.get('/logout', function(req, res, next) {
  try{
    res.clearCookie("token");
    res.render('index');
  }catch(error){
    console.log(error)
    res.render('500')
  }
    
});

module.exports = router;