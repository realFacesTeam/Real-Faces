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
db.clientList = db.clientList || [];
db.clientPositions = {};

// Setup the ready route, and emit talk event.
app.io.route('login', function(req) {
    //generate new client ID

    var newClientID = ++db.count;
    //tell all pre-existing clients to render new client
    db.clientList.forEach(function(clientObj){
      var req = clientObj.req;
      req.io.emit('newClient', {
        message: 'Client #'+newClientID+'has logged into the server!',
        clientID: newClientID
      });
    })

    //store new client 
    db.clientList.push({clientID:newClientID, req:req});
    
    //tell new client its clientID, then positions of all other clients
    req.io.emit('successfulLogin', {
      clientID: newClientID,
      clientPositions: db.clientPositions
    });
});

app.io.route('clientUpdatePosition', function(req){
  //req should emit event to everybody that this user just moved

  //the reason we aren't just sending the entire req.data object is 
  
  req.io.emit('clientUpdatePosition', {
    axis:    req.data.axis,
    offset:  req.data.axis,
    clientId:req.data.axis
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
