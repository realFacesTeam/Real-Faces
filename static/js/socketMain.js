var socketInterval = 200;

$(document).ready(function() {

  var socket = io.connect('/translations');

  //PLAYER CONNECTED TO SERVER, TELL SERVER TO SEND BACK SELF DATA
  socket.emit('player_join');


  //YOUR PLAYER UPDATES TO SERVER
  var playerTranslation = {
    position: {x:0, y:10, z:0},
    rotation: {x:0, y:0}
  };

  var translated = false;

  var storePlayerTranslation = function(translation){
    console.log('translation', translation);
    playerTranslation = translation;
    translated = true;
  };

  playerEvents.addListener('player_movement', storePlayerTranslation);

  setInterval(function(){
    if (translated){
      socket.emit('translate', playerTranslation);
      translated = false;
    }
    //socket.emit('heartbeat')
  }, socketInterval);


  //OTHER PLAYER UPDATES FROM SERVER
  socket.on('preexisting_clients', function(clientTranslations, yourID){
    //draw pre-existing clients when you login
    for (var id in clientTranslations){
      if (clientTranslations.hasOwnProperty(id) && clientTranslations[id] && id !== yourID){
        console.log('drawing new client: '+id);
        console.log('your client id is: '+yourID);
        playerEvents.emit('new_player', id, clientTranslations[id]);
        playerEvents.emit('teleport_other_player', id, clientTranslations[id]);
      }
    }
    //initialize webRTC connection after drawing other clients
    console.log('starting webrtc from socketMain.js');
    playerEvents.emit('start_webRTC', yourID);
  });

  socket.on('new_client', function(clientID){
    //otherPlayerUpdates will hear this and create a new player
    playerEvents.emit('new_player', [clientID]);
  });

  socket.on('client_disconnected', function(clientID){
    console.log('server removing player: '+clientID);
    playerEvents.emit('remove_player', [clientID]);
  });

  socket.on('move_other_player', function(data){
    //otherPlayerUpdates will hear this and move the respective player
    playerEvents.emit('move_other_player', data.clientID, data.translation);
  });

});
