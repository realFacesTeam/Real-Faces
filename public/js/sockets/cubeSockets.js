io = io.connect();

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    clientID = data.clientID;

    init();
    animate();

})

// Listen for the talk event.
io.on('talk', function(data) {
    alert(data.message);
})

io.on('newClient', function(data){
  createVideoCube(5, 25.1, 0, videoTexture, scene);
});

io.on('clientUpdatePosition', function(data){

  var mover = scene.getObjectByName("videoCube" + data.clientID);

  mover.position[data.axis] += data.offset;

})

var sendPositionToServer = function(axis, offset){
  io.emit('clientUpdatePosition', {
    axis: axis, offset: offset,
    globalPosition:[ownCube.position.x, ownCube.position.z],
    clientID:clientID
  });
};

io.emit('clientUpdatePosition', {
  axis:'X', offset:moveDistance,
  globalPosition:[ownCube.position.x, ownCube.position.z],
  clientID:clientID
});
io.emit('clientUpdatePosition', {
  axis:'Z', offset:-moveDistance,
  globalPosition:[ownCube.position.x, ownCube.position.z],
  clientID:clientID
});
io.emit('clientUpdatePosition', {
  axis:'Z', offset:+moveDistance,
  globalPosition:[ownCube.position.x, ownCube.position.z],
  clientID:clientID
});
