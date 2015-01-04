function detectCollision(moveDirection, globalDirection) 
{
  //collision distance
  var distance = 15;
  //detect local coordinate system vector
  var matrix = new THREE.Matrix4();
  matrix.extractRotation( controls.getObject().matrix );
  //generate local vector from direction cube is sliding
  //get a vector3 of where cube is facing globally
  if(moveDirection === "forward"){
    var direction = new THREE.Vector3( 0, 0, -1 );
  }else if(moveDirection === "left"){
    var direction = new THREE.Vector3( -1, 0, 0 );
  }else if(moveDirection === "backward"){
    var direction = new THREE.Vector3( 0, 0, 1 );
  }else if(moveDirection === "right"){
    var direction = new THREE.Vector3( 1, 0, 0 );
  }
  //if we need local to global conversion, convert
    //don't expect this to be used, but the functionality is preserved
  if(!globalDirection){
    direction = direction.applyProjection(matrix);
  }
  //create raycaster and link it in cube's direction
  var caster = new THREE.Raycaster(), collisions;
  caster.set(controls.getObject().position, direction);
  //get objects cube can run into
  collisions = caster.intersectObjects(collidableMeshList);
  //if possible collision is within distance, return true
  if (collisions.length > 0 && collisions[0].distance <= distance) {
    return true;
  }else{
    return false;
  }
}
