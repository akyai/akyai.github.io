const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.models");
db.role = require("./role.models");
db.logs = require("./logs.models");
db.connect = require("./connect-logs.models");


module.exports = db;
