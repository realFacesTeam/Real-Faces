//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                },status: 404 });
    } else {
        res.render('500.jade', { locals: {
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err
                },status: 500 });
    }
});
server.listen( port);


//Setup Socket.IO
var clientTranslations = {};

var io = io.listen(server);

var translations = io.of('/translations');
translations.on('connection', function(client){
  client.on('player_join', function(){
    console.log('Client Connected', client.id);

    clientTranslations[client.id] = {
      position: {x:0, y:10, z:0},
      rotation: {x:0, y:0}
    };

    //tells new clients about pre-existing clients
    client.emit('preexisting_clients', clientTranslations, client.id);

    //tells all pre-existing clients about new client
    client.broadcast.emit('new_client', client.id);

    // client.on('message', function(data){
    //   client.broadcast.emit('server_message',data);
    //   client.emit('server_message',data);
    // });

    //sets event listener for new client
    client.on('translate', function(translation){
      client.broadcast.emit('move_other_player', {clientID:client.id, translation:translation});
      clientTranslations[client.id] = translation;
    });

    //sets disconnect listener for new client
    client.on('disconnect', function(){
      console.log('Client Disconnected.', client.id);

      delete clientTranslations[client.id];

      client.broadcast.emit('client_disconnected', client.id);
    });
  });
});

var signal;

/*global console*/
var uuid = require('node-uuid'),
    crypto = require('crypto');

//====================SIGNALMASTER CODE=====================

function describeRoom(name) {
  //var clients = io.of('/chat').clients('room');
    var clients = signal.clients(name);
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

signal = io.of('/signalmaster');
signal.on('connection', function(client){
    client.resources = {
        screen: false,
        video: true,
        audio: false
    };

    // pass a message to another id
    client.on('message', function (details) {
        if (!details) return;

        var otherClient = signal.sockets[details.to];
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
        if (signal.sockets.clients(name).length) {
            safeCb(cb)('taken');
        } else {
            join(name);
            safeCb(cb)(null, name);
        }
    });


    var servers = {
      "stunservers" :
        [
            {url: "stun:stun.l.google.com:19302"},
            {url:'stun:stun1.l.google.com:19302'},
            {url:'stun:stun2.l.google.com:19302'},
            {url:'stun:stun3.l.google.com:19302'},
            {url:'stun:stun4.l.google.com:19302'},
            {url:'stun:stun01.sipphone.com'},
            {url:'stun:stun.ekiga.net'},
            {url:'stun:stun.fwdnet.net'},
            {url:'stun:stun.ideasip.com'},
            {url:'stun:stun.iptel.org'},
            {url:'stun:stun.rixtelecom.se'},
            {url:'stun:stun.schlund.de'},
            {url:'stun:stunserver.org'},
            {url:'stun:stun.softjoys.com'},
            {url:'stun:stun.voiparound.com'},
            {url:'stun:stun.voipbuster.com'},
            {url:'stun:stun.voipstunt.com'},
            {url:'stun:stun.voxgratia.org'},
            {url:'stun:stun.xten.com'}
        ],
      "turnservers" :
        [
          /*
          this is an example of how you can generate credentials. generally we dont need to.
          {
            "url": "turn:192.158.29.39:3478?transport=udp",
            "secret": "turnserversharedsecret"
            "expiry": 86400
          }
          */
        ]
    };

    var credentials = [
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        username: '28224511:1379330808',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA='
      },
      {
        url: 'turn:numb.viagenie.ca',
        username: 'webrtc@live.com', 
        credential: 'muazkh'
      }
    ];



      //here you can push in generated credentials
    //here we push in public access pre-generated TURN server credentials
    //e.g.
    //credentials.push(generateCredentialObj());

    // tell client about stun and turn servers and generate nonces
    client.emit('stunservers', servers.stunservers || []);
    client.emit('turnservers', credentials);
});
  //====================SIGNALMASTER CODE=====================

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.jade', {
    locals : {
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + port );
