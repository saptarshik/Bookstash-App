const Category = require("../models/categories");
const Bookmark = require("../models/bookmarks");

var middlewareObj = {};

middlewareObj.checkCategoryOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Category.findById(req.params.id, (err, foundCategory) => {
            if (err) {
                req.flash("error", "Category not found");
                res.redirect("back")
            } else {
                if(foundCategory.author.id.equals(req.user._id)){
                   next()
                }else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
                
            }
        });
    } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
    }
}

middlewareObj.checkBookmarkOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Bookmark.findById(req.params.bookmark_id, (err, foundBookmark) => {
            if (err) {
                req.flash("error", "Bookmark not found");
                res.redirect("back");
            } else {
                //does user own the bookmark?
                if(foundBookmark.author.id.equals(req.user._id)){
                   next()
                }else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
}else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;