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
      clientPositions: db.clientPositions,
      signalPort: port
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


// ======SIGNALING SERVER FOR WEBRTC====================

/*global console*/
var yetify = require('yetify'),
    config = require('getconfig'),
    uuid = require('node-uuid'),
    crypto = require('crypto'),
    port = parseInt(process.env.PORT || config.server.port, 10),
    io = require('socket.io').listen(port);

if (config.logLevel) {
    // https://github.com/Automattic/socket.io/wiki/Configuring-Socket.IO
    io.set('log level', config.logLevel);
}

function describeRoom(name) {
    var clients = io.sockets.clients(name);
    var result = {
        clients: {}
    };
    clients.forEach(function (client) {
        result.clients[client.id] = client.resources;
    });
    return result;
}

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}

io.sockets.on('connection', function (client) {
    client.resources = {
        screen: false,
        video: true,
        audio: false
    };

    // pass a message to another id
    client.on('message', function (details) {
        if (!details) return;

        var otherClient = io.sockets.sockets[details.to];
        if (!otherClient) return;

        details.from = client.id;
        otherClient.emit('message', details);
    });

    client.on('shareScreen', function () {
        client.resources.screen = true;
    });

    client.on('unshareScreen', function (type) {
        client.resources.screen = false;
        removeFeed('screen');
    });

    client.on('join', join);

    function removeFeed(type) {
        if (client.room) {
            io.sockets.in(client.room).emit('remove', {
                id: client.id,
                type: type
            });
            if (!type) {
                client.leave(client.room);
                client.room = undefined;
            }
        }
    }

    function join(name, cb) {
        // sanity check
        if (typeof name !== 'string') return;
        // leave any existing rooms
        removeFeed();
        safeCb(cb)(null, describeRoom(name));
        client.join(name);
        client.room = name;
    }

    // we don't want to pass "leave" directly because the
    // event type string of "socket end" gets passed too.
    client.on('disconnect', function () {
        removeFeed();
    });
    client.on('leave', function () {
        removeFeed();
    });

    client.on('create', function (name, cb) {
        if (arguments.length == 2) {
            cb = (typeof cb == 'function') ? cb : function () {};
            name = name || uuid();
        } else {
            cb = name;
            name = uuid();
        }
        // check if exists
        if (io.sockets.clients(name).length) {
            safeCb(cb)('taken');
        } else {
            join(name);
            safeCb(cb)(null, name);
        }
    });

    // tell client about stun and turn servers and generate nonces
    client.emit('stunservers', config.stunservers || []);

    // create shared secret nonces for TURN authentication
    // the process is described in draft-uberti-behave-turn-rest
    var credentials = [];
    config.turnservers.forEach(function (server) {
        var hmac = crypto.createHmac('sha1', server.secret);
        // default to 86400 seconds timeout unless specified
        var username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
        hmac.update(username);
        credentials.push({
            username: username,
            credential: hmac.digest('base64'),
            url: server.url
        });
    });
    client.emit('turnservers', credentials);
});

if (config.uid) process.setuid(config.uid);
console.log(yetify.logo() + ' -- signal master is running at: http://localhost:' + port);
// ======SIGNALING SERVER FOR WEBRTC====================

