io = io.connect();

// Emit ready event.
io.emit('login');

// Listen for the talk event.
io.on('talk', function(data) {
    alert(data.message);
})

io.on('newClient', function(data){
  createVideoCube(5, 25.1, 0, videoTexture, scene);
});