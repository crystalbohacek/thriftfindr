var express = require("express");
var router = express.Router({mergeParams: true});
var Thriftstore = require("../models/thriftstore");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New

router.get("/new", middleware.isLoggedIn, function(req, res){
    //find thriftstore by id
    Thriftstore.findById(req.params.id, function(err, thriftstore){
        if(err){
            console.log(err);
        } else {
            // res.render("comments/new", {thriftstore: thriftstore, currentUser: req.user});
            res.redirect('/thriftstores/' + req.params.id);
        }
    });
});

//Comments Create

router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup thriftstore using ID
   Thriftstore.findById(req.params.id, function(err, thriftstore){
       if(err){
            req.flash("error", "Error: Something went wrong!");
        //   console.log(err);
           res.redirect("/thriftstores");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.author.name = req.user.name;
                   comment.author.picture = req.user.picture;
                   comment.date = new Date();
                   console.log(comment)
                   //save comment
                   comment.save();
                   thriftstore.comments.push(comment);
                   thriftstore.save();
                //   console.log(comment);
                   res.redirect("/thriftstores/" + thriftstore._id);
               }
           });
       }
   });
});

//COMMENTS EDIT ROUTE

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {thriftstore_id: req.params.id, comment: foundComment, currentUser: req.user});
        }
    });
});

//COMMENTS UPDATE ROUTE

router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/thriftstores/" + req.params.id);
        }
    })
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log('ERR: Unable to delete thrift store.', err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/thriftstores/" + req.params.id);
        }
    })
});

//middleware



module.exports = router;