var express = require("express")
var bodyParser = require("body-parser")
const fs = require("fs")
var path = require('path');
var PORT = process.env.PORT || 3000
const app = express()

app.use(bodyParser.json())
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
    extended:true
}))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//root logs
app.get("/",(req,res)=>{

}).listen(PORT, function() {
  console.log("Listening on PORT "+ PORT);
});
