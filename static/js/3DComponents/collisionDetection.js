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

RealTHREE.prototype.isWallCollision = function(x,z){

  var walls = realFaces.THREE.wallList;

  for (var i = 0, len = walls.length; i < len; i++){

    var wall = walls[i];

    if(!wall.rotated){
      if (wall.position.x - (wall.length/2) -1 < x && x < wall.position.x + (wall.length/2) + 1){
        if (wall.position.z - 5 < z && z <= wall.position.z){

          return [x, wall.position.z - 5.01];
        }else if(wall.position.z <= z && z < wall.position.z + 5){
          return [x, wall.position.z + 5.01];
        }
      }
    }else{
      if (wall.position.z - (wall.length/2) - 1 < z && z < wall.position.z + (wall.length/2) + 1){
        if (wall.position.x - 5 < x && x <= wall.position.x){
          return [wall.position.x - 5.01, z];
        }else if(wall.position.x <= x && x < wall.position.x + 5){
          return [wall.position.x + 5.01, z];
        }
      }
    }
  }

  return false;

};

RealTHREE.prototype.isOutsideBoundary = function(x,z){
  var outsideBoundary = false, newX = x, newZ = z;

  if (x > 99){
    outsideBoundary = true;
    newX = 98;
  }else if (x < -149){
    outsideBoundary = true;
    newX = -148;
  }

  if (z > 49){
    outsideBoundary = true;
    newZ = 48;
  }else if (z < -99){
    outsideBoundary = true;
    newZ = -98;
  }

  if (!outsideBoundary){
    return false;
  }else{
    return [newX, newZ];
  }

};
