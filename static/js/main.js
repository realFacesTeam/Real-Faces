//construct main app object
//can load its own webRTC dependency
var RealFaces = function(sceneName){
  //will load webRTC deps on event, set to be called when THREE.js scene is done rendering
  this.roomName = location.pathname;


  document.getElementById('roomURL').innerHTML = "realfaces.org" + location.pathname + " <br> Share this URL with your friends so they can join your room!"


  playerEvents.addListener('start_webRTC', this.initWebRTC);

  //construct THREE.js renderer
  if(sceneName === 'ArtGallery'){
    this.THREE = new RealTHREE(-150, 100, -100, 50, true);
  }else{
    this.THREE = new RealTHREE();
  }

  //activate pointer lock
  this.THREE.pointerLock();

  //construct scene based on url
  this.THREE.createScene(sceneName);
  //e.g.
  //realFaces.THREE.createSceneOutdoor();
  //realFaces.THREE.createSceneUnionSquare();

  //start animations
  this.THREE.animate(this.THREE);

  this.socket = new RealSocket(this);

  playerEvents.addListener('new_player', this.socket.createPlayerScreen);

  playerEvents.addListener('remove_player', this.socket.removePlayer);

  playerEvents.addListener('teleport_other_player', this.socket.teleportPlayer);

  playerEvents.addListener('move_other_player', this.socket.movePlayer);

  playerEvents.addListener('player_movement', this.socket.storePlayerTranslation);

  //after event listeners are set, tell server to send back self data
  this.socket.socketio.emit('player_join');
};

RealFaces.prototype.initWebRTC = function(clientID, context){
  context.webrtc = new RealWebRTC(clientID);
};

// var realFaces = {
//   'initWebRTC': function(clientID) {
//     realFaces.webrtc = new RealWebRTC(clientID)
//   }
// };

// //will load webRTC deps on event, set to be called when THREE.js scene is done rendering
// playerEvents.addListener('start_webRTC', realFaces.initWebRTC);

// //construct THREE.js renderer
// realFaces.THREE = new RealTHREE();

// //activate pointer lock
// realFaces.THREE.pointerLock();

// //construct scene based on url
// //eg
// realFaces.THREE.createSceneArtGallery();
// //realFaces.THREE.createSceneOutdoor();
// //realFaces.THREE.createSceneUnionSquare();

// //start animations
// realFaces.THREE.animate();

//on document ready, start listening for socket events
// $(document).ready(function() {
//   realFaces.socket = new RealSocket();

//   playerEvents.addListener('new_player', realFaces.socket.createPlayerScreen);

//   playerEvents.addListener('remove_player', realFaces.socket.removePlayer);

//   playerEvents.addListener('teleport_other_player', realFaces.socket.teleportPlayer);

//   playerEvents.addListener('move_other_player', realFaces.socket.movePlayer);

//   playerEvents.addListener('player_movement', realFaces.socket.storePlayerTranslation);

//   //after event listeners are set, tell server to send back self data
//   realFaces.socket.socketio.emit('player_join');
// });

