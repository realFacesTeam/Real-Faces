var createVideoCube = function(globalPosition, videoTexture, scene, clientID, debugCube){
  var materialArray = [];
  scene = scene || window.scene;
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
  if(debugCube){
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));
  }else{
    materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
  }
  var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
  var MovingCubeGeom = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1, materialArray );
  MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
  MovingCube.position.set(globalPosition.xPosition, globalPosition.yPosition, globalPosition.zPosition);
  MovingCube.rotation.set(globalPosition.xRotation, globalPosition.yRotation, globalPosition.zRotation)
  MovingCube.name = 'videoCube' + clientID;
  scene.add( MovingCube );
  console.log('created a videoCube with name:', MovingCube.name);
}
