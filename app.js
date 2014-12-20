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
db.count = 0;
db.clientList = {};


//object of keys, keys are the clientId, and it's value is the global position
db.clientPositions = {};

// Setup the ready route, and emit talk event.
app.io.route('login', function(req) {
    //generate new client ID

    var newClientID = ++db.count;
    console.log('newClientID', newClientID)
    //tell all pre-existing clients to render new client
    req.io.broadcast('newClient', {
        message: 'Client #'+newClientID+'has logged into the server!',
        clientID: newClientID
    });

    //store new client
      //deprecated?
    db.clientList[newClientID] = {req:req, keepAliveTimer:10000});
    //store default position
    db.clientPositions[newClientID] = [0, 0];

    console.log('posiotns',db.clientPositions);

    //tell new client its clientID, then positions of all other clients
    req.io.emit('successfulLogin', {
      clientID: newClientID,
      clientPositions: db.clientPositions
    });
});

app.io.route('keepAlive', function(req) {
  var clientID = req.data.clientID;
  var time = req.data.time;
  db.clientList.clientID.keepAliveTimer += time;
})

//disconnect old clients
setInterval(clientCleanUp, 10000);
//every 10 seconds
var clientCleanUp = function(){
  Object.keys(db.clientList).forEach(function(clientID){
    db.clientList[clientID].keepAliveTimer = Math.max(clientObj.keepAliveTimer - 10000, 0);
    if(clientObj.keepAliveTimer === 0){
      clientDisconnect(clientID);
    }
  });
}
var clientDisconnect = function(clientID){
  var req = db.clientList.clientID.req;
  req.io.broadcast('clientDisconnect', {
    clientID: clientID
  })
}

app.io.route('clientUpdatePosition', function(req){
  //console.log("req data", req.data);
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
