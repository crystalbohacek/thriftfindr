var express           = require("express"),
    app               = express(),
    User              = require("./models/user"),
    flash             = require("connect-flash"),
    seedDB            = require("./seeds"),
    LocalStrategy     = require("passport-local"),
    methodOverride    = require("method-override"),
    FacebookStrategy  = require('passport-facebook').Strategy,
    Comment           = require("./models/comment"),
    mongoose          = require("mongoose"),
    passport          = require("passport"),
    bodyParser        = require("body-parser"),
    Thriftstore       = require("./models/thriftstore"),
    moment            = require("moment"),
    config            = require("./config.js"),
    fileUpload        = require('express-fileupload');


//requiring routes    
var commentRoutes = require("./routes/comments"),
    thriftRoutes  = require("./routes/thriftstores"),
    indexRoutes   = require("./routes/index"),
    uploadRoutes  = require("./routes/upload"),
    authenticationRoutes = require("./routes/authentication");


// seedDB(); //seed the database
mongoose.connect("mongodb://localhost/thrift_finder");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());



//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: config.express.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//facebook
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: "https://thriftfindr.com/auth/facebook/callback",
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName'],
  },
  function(accessToken, refreshToken, profile, cb) {

    User.findOrCreate(profile, function (err, user) {
      console.log('###user###', user);
      return cb(err, user);
    });
  }
));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

//flash
app.use(function(req, res, next){
    res.locals.currentUser = req.User;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//shortened routes
app.use("/", indexRoutes);
app.use("/thriftstores/:id/comments", commentRoutes);
app.use("/thriftstores", thriftRoutes);
app.use("/auth", authenticationRoutes);
app.use("/upload", uploadRoutes)


app.listen(7000, function(){
    console.log("The ThriftFindr server has started!");
});