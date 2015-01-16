//construct main app object
//can load its own webRTC dependency
var realFaces = { 
  'initWebRTC': function(clientID) {
    realFaces.webrtc = new RealWebRTC(clientID)
  } 
};

//will load webRTC deps on event, set to be called when THREE.js scene is done rendering
playerEvents.addListener('start_webRTC', realFaces.initWebRTC);

//construct THREE.js renderer
realFaces.THREE = new RealTHREE();

//activate pointer lock
realFaces.THREE.pointerLock();

//construct scene based on url
//eg
realFaces.THREE.createSceneOutdoor();

//start animations
realFaces.THREE.animate();

//on document ready, start listening for socket events
$(document).ready(function() {
  realFaces.socket = new RealSocket();

  playerEvents.addListener('new_player', realFaces.socket.createPlayerScreen);

  playerEvents.addListener('remove_player', realFaces.socket.removePlayer);

  playerEvents.addListener('teleport_other_player', realFaces.socket.teleportPlayer);

  playerEvents.addListener('move_other_player', realFaces.socket.movePlayer);

  playerEvents.addListener('player_movement', realFaces.socket.storePlayerTranslation);

  //after event listeners are set, tell server to send back self data
  realFaces.socket.socketio.emit('player_join');
});

