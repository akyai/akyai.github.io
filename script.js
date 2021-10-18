var express = require("express")
var bodyParser = require("body-parser")
const fs = require("fs")
const Discord = require("discord.js")
const mongoose = require('mongoose');
const { Schema } = mongoose;
const client = new Discord.Client();
var platform = require('platform');
var path = require('path');
var PORT = process.env.PORT || 3000
const app = express()
const axios = require('axios').default;




var token = "";
var response = "";
var data = "";
var ip = "";
var connected = false;





app.use(bodyParser.json())
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
    extended:true
}))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');





const db = require("./views/app/models");
var User = db.user
var Role = db.role;
var Logs = db.logs;
var LogsConnect = db.connect;


mongoose.connect("mongodb+srv://akyai:akylebg@root-self.slmxg.mongodb.net/User", {useNewUrlParser: true, useUnifiedTopology: true} ).then(() => {
  console.log("Successfully connect to MongoDB.");
  initial();
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});

//startup
app.post("/login-home",(req,res)=>{
    var name = req.body.loginusername;
    var password = req.body.loginpassword;
    User.exists({ name: name }, function(err, ress) {
        if (err) {

        }

        if(ress == true){
          User.exists({ name: name, password: password}, function(err, resss) {
              if (err) {

              }

              if(resss == true){
                function userconnect() {
                User.findOne({name : name}, function(err,doc){
                    if(err) throw err;
                    if(doc)
                      data = doc
                      res.redirect("/home")
                });
              }
              userconnect()
                   connected = true;
                 }
                 })
        }
        else {
    res.redirect("/register")
        }

      });


    })
app.post("/register-home",(req,res)=>{

    var name = req.body.registerusername;
    var password = req.body.registerpassword;

    User.exists({ name: name }, function(err, ress) {
        if (err) {
          console.log(err);
        }
        if(ress == false){
          const user = new User({
           name: name,
           password: password,
           ip: false,
           grade: "member",
           premium: false
           });
           async function getIpClient() {
           try {
             response = await axios.get('https://api.ipify.org?format=json');
             user.ip = response.data.ip;
             data = user
             res.redirect("/home")
             user.save((err, user) => {
               if (err) {
                 res.status(500).send({ message: err });
                 return;
               }
             })
           } catch (error) {
             console.error(error);
           }
         }
         getIpClient()
           user.save((err, user) => {
             if (err) {
               res.status(500).send({ message: err });
               return;
             }
                   })
                   connected = true;

        }
        else {
res.redirect("/login")
        }

      });


})
app.get("/login",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
  return res.sendFile(__dirname +"/views/root-login.html")

})
app.get("/register",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
  return res.sendFile(__dirname +"/views/root-register.html")
})


//Home

app.get("/home",(req,res)=>{
  if(connected == false){
  res.redirect("/")
  }
  async function start() {
  try {

    response = await axios.get('https://api.ipify.org?format=json');
    Logs.exists({ ip: response.data.ip }, function(err, ress) {
        if (err) {
          console.log(err);
        }

        if(ress == true){
          if(connected == true){
            function userconnect() {
               User.findOne({name : data.name}, function(err,doc){
                  if(err) throw err;
                  if(doc)

                   res.render('root-home', {username: doc.name})

              });
            }

            userconnect()
        }


        Logs.findOne({ip : response.data.ip}, function(err,doc){
            if(err) throw err;

            if(doc)
            if(doc.blacklist == true){
              res.redirect('/blacklist')
            }

        });

        }

      })
    }catch (error) {
             console.error(error);
           }
  }
  start()
})
app.get("/direct",(req,res)=>{
                   res.render({token: "NzQzMjg2NDk4MDMxNTY2ODk4.XzSdfg.uLlz7PuF61E_9DPaDE5_Z6o0ij8"})
})



//root logs
app.get("/",(req,res)=>{


  async function start() {
  try {

    response = await axios.get('https://api.ipify.org?format=json');
var date1 = new Date()
       var date = date1.getHours() + "h :"+date1.getMinutes() +"m :"+ date1.getSeconds() + "s ;" +date1.getDate() + ":"+ date1.getMonth()
    const connect = new LogsConnect({
      ip: response.data.ip,
      platforme: platform.os.family,
      time: date
     }).save(err => {
       if (err) {
         console.log("error", err);
       }

     });

    Logs.exists({ ip: response.data.ip }, function(err, ress) {
        if (err) {
          console.log(err);
        }

        if(ress == false){

          const logs = new Logs({
           ip: response.data.ip,
           blacklist: false
           }).save(err => {
             if (err) {
               console.log("error", err);
             }
             console.log("added new ip to logs");
           });





             if(connected == true){
               res.redirect('/home')
             }
             if(connected == false){
              res.sendFile(__dirname +"/views/root-login.html")
             }


  }//res false
  if(ress == true){

    Logs.findOne({ip : response.data.ip}, function(err,doc){
        if(err) throw err;

        if(doc.blacklist == false){
          if(connected == true){
            res.redirect('/home')
          }
          if(connected == false){
           res.sendFile(__dirname +"/views/root-login.html")
          }
        }
        if(doc.blacklist == true){
          res.redirect('/blacklist')
        }
    });

  }

})
} catch (error) {
  console.error(error);
}
}
start()
}).listen(PORT, function() {
  console.log("Listening on PORT "+ PORT);
});


// home/
app.post("/home/discord/selfbot",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
    if(connected == true){

  async function start() {
  try {

    response = await axios.get('https://api.ipify.org?format=json');
    Logs.exists({ ip: response.data.ip }, function(err, ress) {
        if (err) {
          console.log(err);
        }

        if(ress == true){
          if(connected == true){
            function userconnect() {
               User.findOne({name : data.name}, function(err,doc){
                  if(err) throw err;
                  if(doc)

                   res.render('root-selfbot', {username: doc.name})
                  res.sendFile(__dirname +"/views/root-selfbot.html")
              });
            }

            userconnect()
        }


        Logs.findOne({ip : response.data.ip}, function(err,doc){
            if(err) throw err;

            if(doc)
            if(doc.blacklist == true){
              res.redirect('/blacklist')
            }

        });

        }

      })
    }catch (error) {
             console.error(error);
           }
  }
  start()
}
  if(connected == false){
    res.redirect("/login")
  }
})

app.post("/home/settings",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
    if(connected == true){

  async function start() {
  try {

    response = await axios.get('https://api.ipify.org?format=json');
    Logs.exists({ ip: response.data.ip }, function(err, ress) {
        if (err) {
          console.log(err);
        }

        if(ress == true){
          if(connected == true){
            function userconnect() {
               User.findOne({name : data.name}, function(err,doc){
                  if(err) throw err;
                  if(doc)
                   res.render('root-settings', {username: doc.name})
                   res.sendFile(__dirname +"/views/root-settings.html")
              });
            }

            userconnect()
        }


        Logs.findOne({ip : response.data.ip}, function(err,doc){
            if(err) throw err;

            if(doc)
            if(doc.blacklist == true){
              res.redirect('/blacklist')
            }

        });

        }

      })
    }catch (error) {
             console.error(error);
           }
  }
  start()
}
  if(connected == false){
    res.redirect("/login")
  }
})

app.post("/home/shop",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
    if(connected == true){
  async function start() {
  try {

    response = await axios.get('https://api.ipify.org?format=json');
    Logs.exists({ ip: response.data.ip }, function(err, ress) {
        if (err) {
          console.log(err);
        }

        if(ress == true){
          if(connected == true){
            function userconnect() {
               User.findOne({name : data.name}, function(err,doc){
                  if(err) throw err;
                  if(doc)

                   res.render('root-shop', {username: doc.name})
                   res.sendFile(__dirname +"/views/root-shop.html")

              });
            }

            userconnect()
        }


        Logs.findOne({ip : response.data.ip}, function(err,doc){
            if(err) throw err;

            if(doc)
            if(doc.blacklist == true){
              res.redirect('/blacklist')
            }

        });

        }

      })
    }catch (error) {
             console.error(error);
           }
  }
  start()
}
  if(connected == false){
    res.redirect("/login")
  }
})

app.post("/home/tools",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
    if(connected == true){
  async function start() {
  try {

    response = await axios.get('https://api.ipify.org?format=json');
    Logs.exists({ ip: response.data.ip }, function(err, ress) {
        if (err) {
          console.log(err);
        }

        if(ress == true){
          if(connected == true){
            function userconnect() {
               User.findOne({name : data.name}, function(err,doc){
                  if(err) throw err;
                  if(doc)

                   res.render('root-tools', {username: doc.name})
                   res.sendFile(__dirname +"/views/root-tools.html")

              });
            }

            userconnect()
        }


        Logs.findOne({ip : response.data.ip}, function(err,doc){
            if(err) throw err;

            if(doc)
            if(doc.blacklist == true){
              res.redirect('/blacklist')
            }

        });

        }

      })
    }catch (error) {
             console.error(error);
           }
  }
  start()
}
if(connected == false){
  res.redirect("/login")
}
})

app.post("/home",(req,res)=>{

  res.set({
        "Allow-access-Allow-Origin": '*'
    })

    res.redirect("/home")
})


app.get("blacklist",(req,res)=>{
  res.set({
        "Allow-access-Allow-Origin": '*'
    })
  return res.sendFile(__dirname +"/views/root-banip.html")

})


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });
    }
  });
}
