function clog(v){console.log(v);}
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app = require('express.io')()
app.http().io()

// var routes = require('./routes/index');
// var users = require('./routes/users');

//Data storage
var db   = {};
db.count = db.count || 0;

//ex '1':{x:20, z:100},
//ex '2':{x:55, z:78}
db.globalPositions = {};


//object of keys, keys are the clientId, and it's value is the global position
db.clientPositions = {};
console.log(db);
// Setup the ready route, and emit talk event.
app.io.route('login', function(req) {
    //generate new client ID

    var newClientID = ++db.count;
    db.globalPositions[newClientID] = [0,0];
    // tell all pre-existing clients to render new client
    req.io.broadcast('newClient', {
        clientID:        newClientID,
        globalPositions: db.globalPositions
    });

    

    //tell new client its clientID, then positions of all other clients
    req.io.emit('successfulLogin', {
      clientID:        newClientID,
      globalPositions: db.globalPositions,
      userCount:       db.count
    });
});

app.io.route('clientUpdatePosition', function(req){
  console.log("req data", req.data);
  //update our globalPosition list
  db.clientPositions[req.data.clientID] = req.data.globalPosition;

  //let other clients know a specific client has moved by some offset amount
  req.io.broadcast('clientUpdatePosition', {
    axis:       req.data.axis,
    offset:     req.data.offset,
    clientID:   req.data.clientID
  })

})

// Send the client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html')
})

// Send the client resources.
    //Refactor into middleware.js
app.get('*', function(req, res) {
    console.log(path.join(__dirname + req.url))
    res.sendfile(__dirname + '/public/'+ req.url)
})


module.exports = app;
