RealTHREE.prototype.findOtherPlayerCollision = function(positionX, positionZ, buffer){
  var buffer = buffer || 1;
  var playerSpacing = 9 * buffer;

  for (var ID in realFaces.socket.socketio.lastRecordedPlayerTranslations){
    if (realFaces.socket.socketio.lastRecordedPlayerTranslations.hasOwnProperty(ID) && ID !== realFaces.socket.socketio.yourID){
      var otherPlayerPosition = realFaces.socket.socketio.lastRecordedPlayerTranslations[ID].position;

      var distanceX = Math.abs(positionX - otherPlayerPosition.x);
      var distanceZ = Math.abs(positionZ - otherPlayerPosition.z);

      //calculate if other player is within spacing
      if (Math.sqrt((distanceX * distanceX) + (distanceZ * distanceZ)) < playerSpacing){
        return {x : otherPlayerPosition.x, z:otherPlayerPosition.z};
      }
    }
  }

  return false;
};

RealTHREE.prototype.findCollisionZoneEdge = function(otherPlayer, yourPlayer, playerSpacing){
  var buffer = 1.01;
  var playerSpacing = playerSpacing || 9;
  var radius = playerSpacing * buffer;

  //if you are exactly on top of the other player, get a bump in a random direction
  //so collision detection doesnt divide by zero (the diff in coords)
  //else, do normal collision bouncing
  if(otherPlayer.x === yourPlayer.x && otherPlayer.z === yourPlayer.z){
    //basically flip a coin with 0 or 1
      //and then add a flat value to a random axis
    if( Math.floor(Math.random()*2) === 0){
      yourPlayer.x += 1;
    }else{
      yourPlayer.z += 1;
    }
  }

  var denominator = Math.sqrt(Math.pow((yourPlayer.x - otherPlayer.x), 2) + Math.pow((yourPlayer.z - otherPlayer.z), 2));

  var edgeX = otherPlayer.x + (radius * ((yourPlayer.x - otherPlayer.x)/denominator));
  var edgeZ = otherPlayer.z + (radius * ((yourPlayer.z - otherPlayer.z)/denominator));

  return [edgeX, edgeZ];
};