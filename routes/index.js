const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
})

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        email: req.body.email,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to BookStash " + user.username);
            res.redirect("/users");
        });
    });
});

router.get("/login", (req, res) => {

    res.render("login");

});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login"
}), function (req, res) {

});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

//user profile


module.exports = router;