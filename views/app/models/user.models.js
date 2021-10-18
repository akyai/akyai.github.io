const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
new mongoose.Schema({
name: String,
password: String,
ip: String,
grade: String,
premium: String,
})
);

module.exports = User;
