io = io.connect();

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    console.log("successfulLogin", data);

    var clientPositions = data.clientPositions;
    console.log(clientPositions);
    for(var clientID in clientPositions){
      if(clientPositions.hasOwnProperty(clientID) && clientPositions[clientID]){
        console.log('current clientID', clientPositions[clientID])
          var coords = clientPositions[clientID];
          var x = coords[0];
          var z = coords[1];
          console.log("creating a cube", clientID);
          var debugCube = true;
          createVideoCube(x, 25.1, z, videoTexture, scene, clientID, debugCube);        
      }
    }

    init(data.clientID);
    animate();

  //send keepAlives to server
  setInterval(function(){
    io.emit('keepAlive', {clientID:clientID, time:3000});
  }, 1000);

});

io.on('clientDisconnect', function(data){
  var clientID = data.clientID;
  var disconnected = scene.getObjectByName('videoCube' + clientID);
  scene.remove(disconnected);
})

io.on('newClient', function(data){
  var debugCube = true;
  createVideoCube(5, 25.1, 0, videoTexture, scene, data.clientID, debugCube);
});

io.on('clientUpdatePosition', function(data){
  if(data.type === "absoluteTranslate"){
    var mover = scene.getObjectByName("videoCube" + data.clientID);
    mover.position[data.axis] += data.offset;
  }
})

var sendPositionToServer = function(options){
  io.emit('clientUpdatePosition', options);
};

