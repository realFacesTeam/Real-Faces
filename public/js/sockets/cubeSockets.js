io = io.connect();

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    clientID = data.clientID;

    init();
    animate();

});

io.on('newClient', function(data){
  createVideoCube(5, 25.1, 0, videoTexture, scene, data.clientID);
});

io.on('clientUpdatePosition', function(data){

  console.log('client update position sent to console');
  console.log(data);

  var mover = scene.getObjectByName("videoCube" + data.clientID);
  console.log(mover)
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

