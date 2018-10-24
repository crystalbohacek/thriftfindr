var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Thriftstore = require("../models/thriftstore");
var middleware = require("../middleware");
var assert = require('assert');  
var util = require('util');
var config = require('../config');
var nodemailer = require('nodemailer');

//root route

router.get("/", middleware.saveReferal, function(req, res){

  var perPage = 8,
      page = 1;
  
  Thriftstore
    .find({ isFeatured: false })
    .sort({ _id: -1 })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, thriftstores) {
      Thriftstore.count().exec(function(err, count) {
        if(err){
          console.log(err);
          res.render("thriftstores/index", {
            error: err,
            config: config,
            thriftstores: [],
            currentUser: req.user
          });          
        } else {
          Thriftstore
            .find({ isFeatured: true })
            .sort({ _id: -1 })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, featuredThriftstores) {
              Thriftstore.count().exec(function(err, count) {
                if(err){
                    console.log(err);
                    res.render("thriftstores/index", {
                      error: err,
                      config: config,
                      thriftstores: [],
                      currentUser: req.user
                    });          
                } else {

                  res.render("thriftstores/index", {
                    config: config,
                    thriftstores: thriftstores,
                    featuredThriftstores: featuredThriftstores,
                    currentUser: req.user,
                    current: page,
                    pages: Math.ceil(count / perPage)
                  });          
                }
              });
            });
        }
      });
    });  
});

router.get("/", middleware.saveReferal ,function(req, res){

    Thriftstore.find({}, function(err, allThriftstores){
        if(err){
            console.log(err);
        } else {
            res.render("thriftstores/index", {config: config, thriftstores: allThriftstores, currentUser: req.user});
        }
    });
});



// router.get("/", function(req, res){
//     res.redirect("/thriftstores");
// });


//about us page
router.get("/about", middleware.saveReferal, function(req, res){
  res.render("about");
});

// //contact page
// router.get("/contact", middleware.saveReferal, function(req, res){
//   res.render('contact');
// });

// //contact form logic
// router.post("/contact", function(req, res){
//   let mailOpts, smtpTrans;
//   smtpTrans = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: config.smtp_access.user,
//       pass: config.smtp_access.password
//     }
//   });
//   mailOpts = {
//     from: req.body.name + ' &lt;' + req.body.email + '&gt;',
//     to: config.smtp_access.user,
//     subject: 'New message from contact form',
//     text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
//   };
//   smtpTrans.sendMail(mailOpts, function (error, response) {
//     if (error) {
//       res.render('contact-failure');
//     }
//     else {
//       res.render('contact-success');
//     }
//   });
// })

//show register form
router.get("/register", middleware.saveReferal, function(req, res){
    if (req.user){
        res.redirect('/');
    } else {
        res.render("register");
    }
});

//handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, isAdmin: false, picture: "http://i.imgur.com/uisLofX.png"});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        req.flash("success", "Welcome to ThriftFindr, " + user.username + "!");
        passport.authenticate("local")(req, res, function(){
            res.redirect("/thriftstores");
        });
    })
    
});

//show login form
router.get("/login", function(req, res){
    if (req.user){
        res.redirect('/');
    } else {
        res.render("login");
    }
});

//handling login logic
//app.post(login, middleware, callback)


router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res) {
    console.log('/login', req.session.returnTo);
    req.session.returnTo = req.session.returnTo || '/';
    res.redirect(req.session.returnTo);
    delete req.session.returnTo;
}); 

// router.post("/login", passport.authenticate("local", 
//     {
//         successRedirect: "/",
//         failureRedirect: "/login"
        
//     }), function(req, res){
// });

//logout route

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You successfully logged out");
    // res.redirect("/thriftstores");
    res.redirect(req.session.returnTo);
});


//search route
// router.get("/search/:type/:term", middleware.saveReferal, function(req, res){
router.get("/search", middleware.saveReferal, function(req, res){
    //find the thriftstore with provided ID

    // Thriftstore.find({ "name": new RegExp(req.query.term, 'i')}, function(err, data) {
    //   if(err) {
    //      console.log("err:");
    //      console.log(err);
    // }
    // else{
    //      //console.log('found: ', data.length);
    //     res.render("thriftstores/search", {term: req.query.term, thriftstores: data, currentUser: req.user});
    // }});


    var searchQuery = new RegExp(req.query.term, 'i');

    Thriftstore.find().or([
        { 'name': { $regex: searchQuery }},
        { 'description': { $regex: searchQuery }},
        { 'address': { $regex: searchQuery }},
        { 'city': { $regex: searchQuery }},
        { 'state': { $regex: searchQuery }},
        { 'phone': { $regex: searchQuery }}
    ]).sort('title').exec(function(err, data) {
        res.render("thriftstores/search", {config: config, term: req.query.term, thriftstores: data, currentUser: req.user});
    });



    
    // switch (req.query.type) {
    //     case 'name':
    //         Thriftstore.find({ "name": new RegExp(req.query.term, 'i')}, function(err, data) {
    //           if(err) {
    //              console.log("err:");
    //              console.log(err);
    //         }
    //         else{
    //              //console.log('found: ', data.length);
    //             res.render("thriftstores/search", {term: req.query.term, thriftstores: data, currentUser: req.user});
    //         }});
    //         break;
    //     case 'location':
    //         //implement search by location
    //         break;
    //     default:
    //         res.render("thriftstores/search", {currentUser: req.user});
            
    // }
    

      
    });


module.exports = router;