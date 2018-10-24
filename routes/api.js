var express = require("express");
var router = express.Router();
var Thriftstore = require("../models/thriftstore");
var middleware = require("../middleware");
var moment = require('moment');
var config = require('../config.js');
var request = require('request');
var util = require('util');

// api endpoint to query the database 

router.get("/query-db", function(req, res){
  var perPage = parseInt(req.query.perPage) || 10,
      page = parseInt(req.query.page) || 1,
      isFeatured = (req.query.getFeatured === "true") ? true : false

  res.setHeader('Content-Type', 'application/json');
  
  Thriftstore
    .find({ isFeatured: isFeatured })
    .sort({ _id: -1 })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, thriftstores) {

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
