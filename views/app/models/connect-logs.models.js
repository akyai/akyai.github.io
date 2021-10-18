const mongoose = require("mongoose");

const Connect = mongoose.model(
  "Connect-logs",
  new mongoose.Schema({
    ip: String,
    platforme: String,
    time: String
  })
);

module.exports = Connect;
