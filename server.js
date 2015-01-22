var express = require("express"),
   server = express(),
   http = require("http").createServer(server),
   bodyParser = require("body-parser"),
   io = require("socket.io").listen(http),
   _ = require("underscore"),

   port = (process.env.PORT || 8081);



/* Server config */

//Server's IP address
server.set("ipaddr", "0.0.0.0");

//Server's port number
server.set("port", port);

//Specify the views folder
server.set("views", __dirname + "/views");

//View engine is Jade
server.set("view engine", "jade");

//Specify where the static content is
server.use(express.static("static", __dirname + "/static"));

//Tells server to support JSON requests
server.use(bodyParser.json());

//server.listen( port);

///////////////////////////////////////////
//              Socket.io                //
///////////////////////////////////////////

//// ADD ALL YOUR SOCKET EVENTS HERE  /////

//Setup Socket.IO
// var httpServer = require('http').createServer(server);
// var io = require('socket.io')(httpServer);

// httpServer.listen(port);


//translations middleware file: create event listeners at /translations namespace
require('./sockets/translations.js')(io);

//rtc signalmaster middleware file: create event listeners at /signalmaster namespace
require('./sockets/signalmaster.js')(io);

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

server.get('/About', function(req,res){
  res.render('pages/About.jade', {
    locals : {
              title : 'About'
             ,description: 'About Real Faces'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});

server.get('/Problems', function(req,res){
  res.render('pages/Problems.jade', {
    locals : {
              title : 'Problems'
             ,description: 'About Real Faces'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});

server.get('/Contact', function(req,res){
  res.render('pages/Contact.jade', {
    locals : {
              title : 'Contact'
             ,description: 'About Real Faces'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});


server.get('/Outdoors', function(req,res){
  res.render('pages/Outdoors.jade', {
    locals : {
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});

server.get('/UnionSquare', function(req,res){
  res.render('pages/UnionSquare.jade', {
    locals : {
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });
});

server.get('/ArtGallery', function(req,res){
  res.render('pages/ArtGallery.jade', {
    locals : {
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX'
            }
  });

  // server.get('/Outdoors/:id', function(req,res){
  //   res.render('pages/Outdoors.jade', {
  //     locals : {
  //               title : 'Your Page Title'
  //              ,description: 'Your Page Description'
  //              ,author: 'Your Name'
  //              ,analyticssiteid: 'XXXXXXX'
  //             }
  //   });
  // });

  // server.get('/UnionSquare*', function(req,res){
  //   res.render('pages/UnionSquare.jade', {
  //     locals : {
  //               title : 'Your Page Title'
  //              ,description: 'Your Page Description'
  //              ,author: 'Your Name'
  //              ,analyticssiteid: 'XXXXXXX'
  //             }
  //   });
  // });

  // server.get('/ArtGallery*', function(req,res){
  //   res.render('pages/ArtGallery.jade', {
  //     locals : {
  //               title : 'Your Page Title'
  //              ,description: 'Your Page Description'
  //              ,author: 'Your Name'
  //              ,analyticssiteid: 'XXXXXXX'
  //             }
  //   });
  // });

});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
// server.get('/*', function(req, res){
//     throw new NotFound();
// });

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

http.listen(server.get("port"), server.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + server.get("ipaddr") + ":" + server.get("port"));
});

//console.log('Listening on http://0.0.0.0:' + port );
