const mongoose = require("mongoose");

const Logs = mongoose.model(
  "Logs",
  new mongoose.Schema({
    ip: String,
    blacklist: false
  })
);

module.exports = Logs;
