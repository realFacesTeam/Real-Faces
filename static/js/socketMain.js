

var socketInterval = 200;

$(document).ready(function() {

  var socket = io.connect();

  //YOUR PLAYER UPDATES TO SERVER

  var playerTranslation = {
    position: {x:0, y:10, z:0},
    rotation: {x:0, y:0}
  };

  var translated = false;

  var storePlayerTranslation = function(translation){
    playerTranslation = translation;
    translated = true;
  }

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
    for (var id in clientTranslations){
      if (clientTranslations.hasOwnProperty(id) && clientTranslations[id] && id !== yourID){
        playerEvents.emit('new_player', id, clientTranslations[id]);
        playerEvents.emit('teleport_other_player', id, clientTranslations[id]);
      }

    }
  });

  socket.on('new_client', function(clientID){
    //otherPlayerUpdates will hear this and create a new player
    playerEvents.emit('new_player', [clientID]);
  });

  socket.on('client_disconnected', function(clientID){
    playerEvents.emit('remove_player', [clientID]);
  });

  socket.on('move_other_player', function(data){
    //otherPlayerUpdates will hear this and move the respective player
    playerEvents.emit('move_other_player', data.clientID, data.translation);
  });

});
