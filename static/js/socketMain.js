var RealSocket = function () {
  this.socketInterval = 200;
  // this.lastRecordedPlayerTranslations;
  this.yourPlayerTranslation;

  //YOUR PLAYER UPDATES TO SERVER
  this.yourPlayerTranslation = {
    position: {x:0, y:10, z:0},
    rotation: {x:0, y:0}
  }

  this.translated = false;

  //connect to server namespace
  this.socketio = io.connect('/translations');

  //set up event listeners from socket
  //OTHER PLAYER UPDATES FROM SERVER
  this.socketio.on('preexisting_clients', function(clientTranslations, yourID){
    //save your socketio ID
    this.yourID = yourID;
    //draw pre-existing clients when you login
    this.lastRecordedPlayerTranslations = clientTranslations;
    for (var id in clientTranslations){
      if (clientTranslations.hasOwnProperty(id) && clientTranslations[id] && id !== yourID){
        console.log('drawing new client: '+id);
        console.log('your client id is: '+yourID);
        playerEvents.emit('new_player', id, clientTranslations[id]);
        playerEvents.emit('teleport_other_player', id, clientTranslations[id]);
      }
    }
    //initialize webRTC connection after drawing other clients
    playerEvents.emit('start_webRTC', yourID);
  });

  this.socketio.on('new_client', function(clientID){
    this.lastRecordedPlayerTranslations[clientID] = {position:{x:0, y:10, z:10}, rotation:{x:0,y:0}};
    //otherPlayerUpdates will hear this and create a new player
    playerEvents.emit('new_player', [clientID]);
  });

  this.socketio.on('client_disconnected', function(clientID){
    delete this.lastRecordedPlayerTranslations[clientID]
    console.log('server removing player: '+clientID);
    playerEvents.emit('remove_player', [clientID]);
  });

  this.socketio.on('move_other_player', function(data){
    this.lastRecordedPlayerTranslations[data.clientID] = data.translation;
    //otherPlayerUpdates will hear this and move the respective player
    playerEvents.emit('move_other_player', data.clientID, data.translation);
  });

  //check for movement to broadcast to server at regular intervals
  var thisPointer = this;
  setInterval(function(){
    if (realFaces.socket.translated){
      realFaces.socket.socketio.emit('translate', realFaces.socket.yourPlayerTranslation);
      realFaces.socket.translated = false;
    }
  }, realFaces.socket.socketInterval);
};

RealSocket.prototype.storePlayerTranslation = function(translation){
  this.yourPlayerTranslation = translation;
  this.translated = true;
};

