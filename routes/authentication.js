// var TwitterStrategy   = require('passport-twitter');
var FacebookStrategy  = require('passport-facebook');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");

//facebook login

router.get('/facebook',
  passport.authenticate('facebook'), function(){
      console.log("Starting facebook authentication");
  });

router.get('/facebook/callback',
  passport.authenticate('facebook', { /* session: false, */ failureRedirect: '/login' }),
  function(req, res) {
    console.log("Successful authentication");

    // Successful authentication, redirect home.
    res.redirect('/');
  });


//twitter login

module.exports = router;
