const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: String,
  hash: String,
  salt: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "moulimoulimoulimoulimouli!"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);