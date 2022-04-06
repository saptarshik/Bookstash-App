var mongoose = require("mongoose");

var bookmarkSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);