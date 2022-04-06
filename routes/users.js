const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Category = require("../models/categories");
const Bookmark = require("../models/bookmarks")
const middleware = require("../middleware");
const ObjectID = require('mongodb').ObjectID;


router.get("/", (req, res) => {

    User.findById(req.user._id, (err, foundUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/")
        }
        res.render("users/profile", {
            user: foundUser
        });
    })

})


router.get("/:id/category", middleware.isLoggedIn, (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.findById(req.user._id, (err, foundUser) => {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/")
            }
            // console.log(foundUser);
            Category.find({
                name: regex
            }).where('author.id').equals(foundUser._id).exec(function (err, categories) {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    return res.redirect("/");
                } else {
                    if (categories.length < 1) {
                        noMatch = "No bookmarks match that query, please try again.";
                    }
                    res.render("users/userindex", {
                        user: foundUser,
                        categories: categories,
                        noMatch: noMatch
                    });
                }

            })
        })
    } else {
        User.findById(req.user._id, (err, foundUser) => {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/")
            }
            // console.log(foundUser);
            Category.find().where('author.id').equals(foundUser._id).exec(function (err, categories) {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    return res.redirect("/");
                }
                res.render("users/userindex", {
                    user: foundUser,
                    categories: categories
                });
            })
        })
    }
})



router.post("/:id/category", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }

    const name = req.body.name;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }

    const newCategory = {
        name: name,
        description: description,
        author: author
    }

    Category.create(newCategory, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Successfully added category");
            res.redirect("/users/" + req.user._id + "/category");
        }
    })


})

router.get("/:id/category/new", function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }

    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/")
        }
        Category.find().where('author.id').equals(foundUser._id).exec(function (err, categories) {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/");
            }
            res.render("users/newuser", {
                user: foundUser,
                categories: categories
            });
        })
    })
});

//show route ----------------------------------------------------------------------------------------------------------
router.get("/:id/category/:categoryid", function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }

    User.findById(req.user._id, (err, foundUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/")
        }
        // console.log(foundUser);
        Category.find().where('author.id').equals(foundUser._id).exec(function (err, categories) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("/");
            }
            Category.findById(req.params.categoryid).populate("bookmarks").exec(function (err, foundCategory) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(foundCategory);
                    res.render("users/showuser", {
                        user: foundUser,
                        categories: categories,
                        category: foundCategory
                    });
                }
            })

        })
    })
})
router.post("/:id/category/:categoryid", function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    Category.findById(req.params.categoryid, function (err, category) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            Bookmark.create(req.body.bookmark, function (err, bookmark) {
                if (err) {
                    console.log(err)
                } else {
                    category.bookmarks.push(bookmark);
                    category.save();
                    res.redirect("/users/" + req.user._id + "/category/" + req.params.categoryid);
                }
            })
        }
    });
})

router.get("/:id/category/:categoryid/:bookmarkid/edit", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    User.findById(req.user._id, (err, foundUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/")
        }
        // console.log(foundUser);
        Category.find().where('author.id').equals(foundUser._id).exec(function (err, categories) {
            if (err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("/");
            }
            Category.findById(req.params.categoryid).populate("bookmarks").exec(function (err, foundCategory) {
                if (err) {
                    console.log(err);
                } else {
                    Bookmark.findById(req.params.bookmarkid, (err, bookmark) => {
                        console.log(bookmark);
                        res.render("users/showusercopy", {
                            user: foundUser,
                            bookmark: bookmark,
                            categories: categories,
                            category: foundCategory
                        });
                    })

                }
            })

        })
    })
})

router.put("/:id/category/:categoryid/bookmark/:bookmarkid", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    Bookmark.findByIdAndUpdate(req.params.bookmarkid, req.body.bookmark, (err, updatedBookmark) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/users/" + req.user._id + "/category/" + req.params.categoryid);
        }
    })
});

router.delete("/:id/category/:categoryid/bookmark/:bookmarkid", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    Bookmark.findByIdAndRemove(req.params.bookmarkid, (err) => {
        if (err) {
            res.redirect("back")
        } else {
            req.flash("success", "Bookmark deleted");
            res.redirect("/users/" + req.user._id + "/category/" + req.params.categoryid);
        }
    })
});

//---------------------------------------------------------------------------------------------------------------------------
router.get("/:id/category/:categoryid/edit", function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }

    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/")
        }
        Category.find().where('author.id').equals(foundUser._id).exec(function (err, categories) {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/");
            }
            Category.findById(req.params.categoryid).populate("bookmarks").exec(function (err, foundCategory) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("users/edituser", {
                        user: foundUser,
                        category: foundCategory,
                        categories: categories
                    });
                }
            })
        })
    })
});


//update
router.put("/:id/category/:categoryid", function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    Category.findByIdAndUpdate(req.params.categoryid, req.body.category, (err, updatedCampground) => {
        (err) ? res.redirect("/"): res.redirect("/users/" + req.user._id + "/category");
    })
});

//delete
router.delete("/:id/category/:categoryid", function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    Category.findByIdAndRemove(req.params.categoryid, req.body.category, (err) => {
        if (err) {
            res.redirect("/")
        } else {
            req.flash("success", "Category Deleted");
            res.redirect("/users/" + req.user._id + "/category");
        }

    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;