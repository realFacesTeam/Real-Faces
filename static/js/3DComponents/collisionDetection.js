// function detectCollision(moveDirection, globalDirection)
// {
//   //collision distance
//   var distance = 15;
//   //detect local coordinate system vector
//   var matrix = new THREE.Matrix4();
//   matrix.extractRotation( controls.getObject().matrix );
//   //generate local vector from direction cube is sliding
//   //get a vector3 of where cube is facing globally
//   if(moveDirection === "forward"){
//     var direction = new THREE.Vector3( 0, 0, -1 );
//   }else if(moveDirection === "left"){
//     var direction = new THREE.Vector3( -1, 0, 0 );
//   }else if(moveDirection === "backward"){
//     var direction = new THREE.Vector3( 0, 0, 1 );
//   }else if(moveDirection === "right"){
//     var direction = new THREE.Vector3( 1, 0, 0 );
//   }
//   //if we need local to global conversion, convert
//     //don't expect this to be used, but the functionality is preserved
//   if(!globalDirection){
//     direction = direction.applyProjection(matrix);
//   }
//   //create raycaster and link it in cube's direction
//   var caster = new THREE.Raycaster(), collisions;
//   caster.set(controls.getObject().position, direction);
//   //get objects cube can run into
//   collisions = caster.intersectObjects(collidableMeshList);
//   //if possible collision is within distance, return true
//   if (collisions.length > 0 && collisions[0].distance <= distance) {
//     return true;
//   }else{
//     return false;
//   }
// }

RealTHREE.prototype.findOtherPlayerCollision = function(positionX, positionZ){
  var playerSpacing = 9;

  for (var ID in realFaces.socket.socketio.lastRecordedPlayerTranslations){
    if (realFaces.socket.socketio.lastRecordedPlayerTranslations.hasOwnProperty(ID) && ID !== realFaces.webrtc.yourID){
      var otherPlayerPosition = realFaces.socket.socketio.lastRecordedPlayerTranslations[ID].position;
      // console.log(lastRecordedPlayerTranslations)
      // console.log(lastRecordedPlayerTranslations[ID], ID);
      // console.log(otherPlayerPosition)

      var distanceX = Math.abs(positionX - otherPlayerPosition.x);
      var distanceZ = Math.abs(positionZ - otherPlayerPosition.z);

      //console.log('distances', distanceX, distanceZ);

      //calculate if other player is within spacing
      if (Math.sqrt((distanceX * distanceX) + (distanceZ * distanceZ)) < playerSpacing){

        return {x : otherPlayerPosition.x, z:otherPlayerPosition.z};

      }

    }
  }

  return false;
};

RealTHREE.prototype.findCollisionZoneEdge = function(otherPlayer, yourPlayer, playerSpacing){

  var playerSpacing = playerSpacing || 9;
  var radius = playerSpacing * 1.05;
  
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
}
