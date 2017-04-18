var middlewareObj = {};
var Thriftstore = require("../models/thriftstore");
var Comment = require ("../models/comment");

middlewareObj.checkThriftstoreOwnership = function (req, res, next) {
  if(req.isAuthenticated()){
    Thriftstore.findById(req.params.id, function(err, foundThriftstore){
        if(err){
            req.flash("error", "Thriftstore not found");
            res.redirect("back");
        } else {
                  //does the user own the thriftstore?
            if(foundThriftstore.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
      if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                      //does the user own the thriftstore?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};



middlewareObj.isLoggedIn = function (req, res, next){
    req.session.returnTo = req.originalUrl || '/'; 
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.saveReferal = function (req, res, next){
    req.session.returnTo = req.originalUrl || '/';
    return next();
};


module.exports = middlewareObj;