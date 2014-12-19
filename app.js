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
db.storage = db.storage || [];

// Setup the ready route, and emit talk event.
app.io.route('login', function(req) {
    //push client ID and client io Obj to storage
    var newClientID = ++db.count;
    db.storage.forEach(function(clientObj){
      var req = clientObj.req;
      req.io.emit('newClient', {
        message: 'Client #'+newClientID+'has logged into the server!',
        clientID: newClientID
      });
    })
    db.storage.push({clientID:newClientID, req:req});
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
