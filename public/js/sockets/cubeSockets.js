io = io.connect();

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    init();
    console.log("successfulLogin");

    clientID = data.clientID;

    var clientPositions = data.clientPositions;

    for(var otherClientID in clientPositions){
      if(clientPositions.hasOwnProperty(otherClientID)){
        if(parseInt(otherClientID) !== parseInt(clientID)){
          var coords = clientPositions[clientID];
          var x = coords[0];
          var z = coords[1];
          console.log("creating other cube")
          var debugCube = true;
          createVideoCube(x, 25.1, z, videoTexture, scene, clientID, debugCube);
        }
      }
    }

    animate();
});

io.on('newClient', function(data){
  createVideoCube(5, 25.1, 0, videoTexture, scene, data.clientID);
});

io.on('clientUpdatePosition', function(data){

  console.log('client update position sent to console');
  console.log(data);

  var mover = scene.getObjectByName("videoCube" + data.clientID);
  mover.position[data.axis.toLowerCase()] += data.offset;

})

var sendPositionToServer = function(axis, offset, ownCube){
  io.emit('clientUpdatePosition', {
    axis: axis,
    offset: offset,
    globalPosition:[ownCube.position.x, ownCube.position.z],
    clientID:clientID
  });
};

