var express = require("express");
var router = express.Router();
var Thriftstore = require("../models/thriftstore");
var middleware = require("../middleware");
var moment = require('moment');
var config = require('../config.js');
var request = require('request');
var util = require('util');


//new route - show form to create new thriftstore
router.get("/query-db", function(req, res){
  var perPage = parseInt(req.query.perPage) || 10,
      page = parseInt(req.query.page) || 1;

  res.setHeader('Content-Type', 'application/json');
  
  Thriftstore
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, thriftstores) {
//      console.log(err);
//      console.log(thriftstores);

      Thriftstore.count().exec(function(err, count) {
        if(err){
            console.log(err);
            res.send(JSON.stringify({
              error: err
            }));

        } else {
          res.send(JSON.stringify({
            error: null,
            thriftstores: thriftstores,
            current: page,
            pages: Math.ceil(count / perPage)
          }));
        }
      });
    });
});

module.exports = router;
