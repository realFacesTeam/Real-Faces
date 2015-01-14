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

var findOtherPlayerCollision = function(positionX, positionZ, buffer){
  var buffer = buffer || 1;
  var playerSpacing = 9 * buffer;

  for (var ID in lastRecordedPlayerTranslations){
    if (lastRecordedPlayerTranslations.hasOwnProperty(ID) && ID !== yourID){
      var otherPlayerPosition = lastRecordedPlayerTranslations[ID].position;

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

var findCollisionZoneEdge = function(otherPlayer, yourPlayer, playerSpacing){
  var buffer = 1.01;
  var playerSpacing = playerSpacing || 9;
  var radius = playerSpacing * buffer;
  var denominator = Math.sqrt(Math.pow((yourPlayer.x - otherPlayer.x), 2) + Math.pow((yourPlayer.z - otherPlayer.z), 2));

  var edgeX = otherPlayer.x + (radius * ((yourPlayer.x - otherPlayer.x)/denominator));
  var edgeZ = otherPlayer.z + (radius * ((yourPlayer.z - otherPlayer.z)/denominator));

  return [edgeX, edgeZ];
};

// var isFuturePositionCloser = function(currentX, currentZ, futureX, futureZ, otherX, otherZ){

//   var currentDistanceX = Math.abs(currentX - otherX);
//   var currentDistanceZ = Math.abs(currentZ - otherZ);

//   var currentDistance = Math.sqrt((currentDistanceX * currentDistanceX) + (currentDistanceZ * currentDistanceZ));

//   var futureDistanceX = Math.abs(futureX - otherX);
//   var futureDistanceZ = Math.abs(futureZ - otherZ);

//   var futureDistance = Math.sqrt((futureDistanceX * futureDistanceX) + (futureDistanceZ * futureDistanceZ));

//   console.log('current distances', currentDistanceX, currentDistanceZ);
//   console.log('all coords', currentX, currentZ, futureX, futureZ, otherX, otherZ);
//   if (futureDistance < currentDistance){
//     console.log('smaller future distance', currentDistance, futureDistance);
//     return true;
//   }
//   console.log('larger future distance', currentDistance, futureDistance);
//   return false;
// }
