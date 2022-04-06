const mongoose = require("mongoose"),
Category = require("./models/categories"),
Bookmark = require("./models/bookmarks");
 
const data = [
    {
        name: "Cloud's Rest", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all Categorys
   Category.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Categorys!");
        Bookmark.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed Bookmarks!");
             //add a few Categorys
            data.forEach(function(seed){
                Category.create(seed, function(err, category){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a Category");
                        //create a Bookmark
                        Bookmark.create(
                            {
                                description: "This place is great, but I wish there was internet",
                                author: "Homer",
                                url: "skldfjslfj",
                                name: "ajsdflskdfskjdfhh"
                            }, function(err, bookmark){
                                if(err){
                                    console.log(err);
                                } else {
                                    category.bookmarks.push(bookmark);
                                    category.save();
                                    console.log("Created new bookmark");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB