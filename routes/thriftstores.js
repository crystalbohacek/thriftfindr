var express = require("express");
var router = express.Router();
var Thriftstore = require("../models/thriftstore");
var middleware = require("../middleware");
var moment = require('moment');
var config = require('../config.js');
var request = require('request');
var util = require('util');


// console.log(config);

//index route - show all thriftstores
router.get("/", middleware.saveReferal, function(req, res){

    Thriftstore.find({}, function(err, allThriftstores){
        if(err){
            console.log(err);
        } else {
            res.render("thriftstores/index", {config: config, thriftstores: allThriftstores, currentUser: req.user});
        }
    });
});

//create route - add thriftstore to database
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to thriftstore array
   request('https://maps.googleapis.com/maps/api/geocode/json?key='
           + config.api_keys.google_maps
           + '&address=' + encodeURIComponent(req.body.address), function (error, response, body) {
    if (error){
      console.log('error!', error);
    } else {
    var data = JSON.parse(body);
    console.log('data: ', util.inspect(data, {showHidden: false, depth: null}))

    if (data.results && data.results[0] && ["address_components"]){
        var addressComponents = data.results[0]["address_components"]
        for (var i = 0; i < addressComponents.length; i++){
            if(
                addressComponents[i]['types'].indexOf('sublocality_level_1') > -1 ||
                addressComponents[i]['types'].indexOf('locality') > -1){
                var city = addressComponents[i]['long_name'];
            }
            if(addressComponents[i]['types'].indexOf('administrative_area_level_1') > -1){
                var state = addressComponents[i]['short_name'];
            }
            if(addressComponents[i]['types'].indexOf('country') > -1){
                var country = addressComponents[i]['long_name'];
            }
        }
    }
    else{
        var city = null, state = null;
    }



     var newThriftstore = {
         name: req.body.name,
         image: req.body.image,
         description: req.body.description,
         address: req.body.address,
         city: city,
         state: state,
         country: country,
         phone: req.body.phone,
         pricegroup: req.body.pricegroup,
         author: {
             id: req.user._id,
             username: req.user.username,
             name: req.user.name,
             email: req.user.email
         }
     };
     //redirect back to thriftfinder page
     //create a new thrift store and save to database
     Thriftstore.create(newThriftstore, function(err, newlyCreated){
         if(err){
             console.log(err);
         } else {
             console.log(newlyCreated);
             res.redirect("/thriftstores");
         }
     });
      }

    });
   
});

//new route - show form to create new thriftstore
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("thriftstores/new", {config: config, currentUser: req.user});
});

//SHOW- shows more info about one thrift store
router.get("/:id", middleware.saveReferal, function(req, res){
    //find the thriftstore with provided ID
    Thriftstore.findById(req.params.id).populate("comments").exec(function(err, foundThriftstore){
        if(err){
            console.log("err:");
            console.log(err);
        } else {
            // console.log("foundThriftstore:");
            // console.log(foundThriftstore);
            res.render("thriftstores/show", {config: config, thriftstore: foundThriftstore, currentUser: req.user, moment: moment});
        }
    });
});

//EDIT THRIFTSTORE ROUTE

router.get("/:id/edit", middleware.checkThriftstoreOwnership, function(req, res){
    Thriftstore.findById(req.params.id, function(err, foundThriftstore){
        if(err){
            req.flash("error", "Thriftstore not found");
        } else {
            res.render("thriftstores/edit", {config: config, thriftstore: foundThriftstore, currentUser: req.user});
        }
    });
});


//UPDATE THRIFTSTORE ROUTE

router.put("/:id", middleware.checkThriftstoreOwnership, function(req, res){
    Thriftstore.findByIdAndUpdate(req.params.id, req.body.thriftstore, function(err, updateThriftstore){
        if(err){
            res.redirect("/thriftstores");
        } else {
            res.redirect("/thriftstores/" + req.params.id);
        }
    });
    
    //find and update the correct thriftstore and then redirect
})

//DESTROY ROUTE

router.delete("/:id", middleware.checkThriftstoreOwnership, function(req, res){
    Thriftstore.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/thriftstores");
        } else {
            req.flash("success", "Thriftstore successfully deleted");
            res.redirect("/thriftstores");
        }
    })
});


module.exports = router;