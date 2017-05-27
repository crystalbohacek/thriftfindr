var express     = require("express");
var router      = express.Router();
var middleware  = require("../middleware");
var config      = require("../config.js");
var path        = require('path');
var fs          = require("fs");
var fileUpload  = require('express-fileupload');

// router.post("/", middleware.isLoggedIn, function(req, res){
router.post("/", function(req, res){
  console.log("upload started...");
  // console.log(req.files);

  var uploadDir = path.join(__dirname, "/../public/images/uploads/");
  var newPath = path.join(uploadDir, (Math.round((new Date()).getTime() / 1000)) + '_' + req.files.image.name) ;

  fs.writeFile(newPath, req.files.image.data, function (err) {
    if (err){
      console.log('err', err);
      return res.status(500).send(err);
    }
    else{
      console.log('upload complete', newPath);      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'imagePath': newPath }));
    }
  });



  // uploadImage.mv(path.join(uploadDir, req.files.image.name), function(err) {
  //   if (err){
  //     console.log('err', err);
  //     return res.status(500).send(err);
  //   }
  //   else{
  //     console.log('uploaded!');
  //     res.send('File uploaded!');
  //   }
  // });



});

module.exports = router;