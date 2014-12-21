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
var db = {};
db.count = db.count || 0;
db.clientList = {};


//object of keys, keys are the clientId, and it's value is the global position
db.clientPositions = {};

// Setup the ready route, and emit talk event.
app.io.route('login', function(req) {
    //generate new client ID

    var newClientID = ++db.count;
    console.log('newClientID', newClientID)
    
    //store new client
      //deprecated?
    db.clientList[newClientID] = {req:req, keepAliveTimer:10000};
    //store default position
    db.clientPositions[newClientID] = {
      xPosition: 0,
      yPosition: 25.1,
      zPosition: 0,
      xRotation: 0,
      yRotation: 0,
      zRotation: 0
    };

    //tell all pre-existing clients to render new client
    req.io.broadcast('newClient', {
        message: 'Client #'+newClientID+'has logged into the server!',
        clientID: newClientID,
        globalPosition: db.clientPositions[newClientID]
    });

    console.log('positions',db.clientPositions);

    //tell new client its clientID, then positions of all other clients
    req.io.emit('successfulLogin', {
      clientID: newClientID,
      clientPositions: db.clientPositions
    });
});

app.io.route('keepAlive', function(req) {
  var clientID = req.data.clientID;
  var time = req.data.time;
  try{
    db.clientList[clientID].keepAliveTimer = time;
  }catch(e){
    console.log('clientID'+clientID+'send invalid keepalive');
  }
})

//every 10 seconds
var clientCleanUp = function(){
  Object.keys(db.clientList).forEach(function(clientID){
    db.clientList[clientID].keepAliveTimer -= 1000;
    if(db.clientList[clientID].keepAliveTimer < 0){
      clientDisconnect(clientID);
    }
  });
}
//disconnect old clients
setInterval(clientCleanUp, 1000);

var clientDisconnect = function(clientID){
  var req = db.clientList[clientID].req;
  req.io.broadcast('clientDisconnect', {
    clientID: clientID
  })
  delete db.clientPositions[clientID];
  delete db.clientList[clientID];
}

app.io.route('clientUpdatePosition', function(req){
  //console.log("req data", req.data);
  //update our globalPosition list
  db.clientPositions[req.data.clientID] = req.data.globalPosition;

  //let other clients know a specific client has moved by some offset amount
  req.io.broadcast('clientUpdatePosition', req.data);
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
