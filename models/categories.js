const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
    bookmarks: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Bookmark"
        }
     ]
})

module.exports = mongoose.model("Category", categorySchema);