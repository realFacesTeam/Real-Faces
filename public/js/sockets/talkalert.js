io = io.connect();

// Emit ready event.
io.emit('login', {name:'BMoney'});

io.on('successfulLogin', function(data){
    clientID = data.clientID})

// Listen for the talk event.
io.on('talk', function(data) {
    alert(data.message);
})

io.on('newClient', function(data){
  createVideoCube(5, 25.1, 0, videoTexture, scene);
});
