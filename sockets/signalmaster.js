var stunServers = require('config.json')('./config/stunservers.json');
var turnServers = require('config.json')('./config/turnservers.json');

module.exports = function(io){
  //create socket.io client signalmaster namespacing
  var signal = io.of('/signalmaster');

  /*global console*/
  var uuid = require('node-uuid'),
      crypto = require('crypto');

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


      console.log(JSON.stringify(stunServers.servers));
      console.log('=========================================')
      var servers = {
        "stunservers" : stunServers.servers,
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

      //load pre-generated credentials
      var credentials = turnServers.servers;

      //here you can generate credentials from secret
      //e.g.
      //credentials.push(generateCredentialObj());

      // tell client about stun and turn servers and generate nonces
      client.emit('stunservers', servers.stunservers || []);
      client.emit('turnservers', credentials);
  });
};