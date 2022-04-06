const
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Category = require("./models/categories"),
    Bookmark = require("./models/bookmarks"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requring routes
const
    indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users");

mongoose.connect("mongodb://localhost/book_stash"); //{ useUnifiedTopology: true }
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.use(flash());

//seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "moulimoulimoulimoulimouli!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/users", userRoutes);
app.use("/", indexRoutes);


app.listen(3000 || process.env.PORT, process.env.IP, function () {
    console.log("server started");
})