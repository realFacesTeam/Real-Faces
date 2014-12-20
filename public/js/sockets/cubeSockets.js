io = io.connect();

// Emit ready event.
io.emit('login');

io.on('successfulLogin', function(data){
    clientID           = data.clientID;
    var otherPositions = data.globalPositions;//[x,z]
    //create cube for yourself
    

    //youre the first into the room- only create for yourself
    if(data.userCount === 1){
      createVideoCube(5, 25.1, 0, videoTexture, scene, clientID);
      console.log('just 1')
        
    }
    else{
      //you're not the first into the room. create everybody along with yourself
      for(var i = 1; (i < data.userCount + 1); i++){
        userX = otherPositions[i][0];
        userZ = otherPositions[i][1];
        console.log(otherPositions)
        console.log(userX)
        console.log(userZ);
        createVideoCube(userX, 25.1, userZ, videoTexture, scene, i);
      }
    }

    init();
    animate();
});

io.on('newClient', function(data){
  //this is if you're already logged in with a cube
  //and already have people in... this is for more subsequent people
  //joining one at a time

  //get client data id,
  //create cube for him
  //add him to list of current cubes pos?
  console.log('new client');
  console.log(data);
  createVideoCube(0, 25.1, 0, videoTexture, scene, data.clientID);
});

io.on('clientUpdatePosition', function(data){

  console.log('client update position sent to console');
  console.log(data);

  var mover = scene.getObjectByName("videoCube" + data.clientID);
  console.log(mover)
  mover.position[data.axis.toLowerCase()] += data.offset;

})

var sendPositionToServer = function(axis, offset, ownCube){
  console.log('own cube position')
  console.log(ownCube.position)
  io.emit('clientUpdatePosition', {
    axis: axis,
    offset: offset,
    globalPosition:[ownCube.position.x, ownCube.position.z],
    clientID:clientID
  });
};

