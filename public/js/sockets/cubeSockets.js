io = io.connect('127.0.0.1:3000');

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    console.log("successfulLogin", data);

    var clientPositions = data.clientPositions;
    console.log(clientPositions);
    for(var clientID in clientPositions){
      if(clientPositions.hasOwnProperty(clientID) && clientPositions[clientID]){
        console.log('current clientID', clientPositions[clientID])
          console.log("creating a cube", clientID);
          var debugCube = true;
          createVideoCube(data.clientPositions[clientID], videoTexture, scene, clientID, debugCube);
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
  createVideoCube(data.globalPosition, videoTexture, scene, data.clientID, debugCube);
});

io.on('clientUpdatePosition', function(data){
  var mover = scene.getObjectByName("videoCube" + data.clientID);
  if(data.type === "absoluteTranslate"){
    mover.position[data.axis] += data.offset;
  }else if(data.type === "rotate"){
    mover.rotateOnAxis( new THREE.Vector3(data.axes[0],data.axes[1],data.axes[2]), data.angle);
  }else if(data.type === "relativeTranslate"){
    if(data.axis === 'z'){
      mover.translateZ( data.offset );

    } else if (data.axis === 'x'){
      mover.translateX( data.offset);
    }
  }
})

var sendPositionToServer = function(options){
  io.emit('clientUpdatePosition', options);
};

