io = io.connect();

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    clientID = data.clientID;

    videoTexture = init();

    createVideoCube(0, 25.1, 0, videoTexture, scene, clientID);
    animate();

    console.log("successfulLogin", data);

    var clientPositions = data.clientPositions;

    for(var otherClientID in clientPositions){
      if(clientPositions.hasOwnProperty(otherClientID)){
        console.log('ids other this', otherClientID, clientID)
        if(parseInt(otherClientID) !== parseInt(clientID)){
          var coords = clientPositions[clientID];
          var x = coords[0];
          var z = coords[1];
          console.log("creating other cube", clientID);
          var debugCube = true;
          createVideoCube(x, 25.1, z, videoTexture, scene, otherClientID, debugCube);
        }
      }
    }

  //send keepAlives to server
  setInterval(io.emit, 5000, keepAlive, {clientID:clientID, time:5000});
});

io.on('newClient', function(data){
  createVideoCube(5, 25.1, 0, videoTexture, scene, data.clientID);
});

io.on('clientUpdatePosition', function(data){

  // console.log('client update position sent to console');
  // console.log(data);

  var mover = scene.getObjectByName("videoCube" + data.clientID);
  mover.position[data.axis.toLowerCase()] += data.offset;

})

io.on('clientDisconnect', function(data){
  var clientID = data.clientID;
  var disconnected = scene.getObjectByName('videoCube' + clientID);
  scene.remove(disconnected);
})

var sendPositionToServer = function(axis, offset, ownCube){
  // console.log('socket cube position x',ownCube.position.x);
  // console.log('offset', offset);
  //
  io.emit('clientUpdatePosition', {
    axis: axis,
    offset: offset,
    globalPosition:[ownCube.position.x, ownCube.position.z],
    clientID:clientID
  });
};

