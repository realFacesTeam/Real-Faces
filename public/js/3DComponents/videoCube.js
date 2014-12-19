var createVideoCube = function(pos1, pos2, pos3, videoTexture, scene, clientID){
  var materialArray = [];
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
  var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
  var MovingCubeGeom = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1, materialArray );
  MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
  MovingCube.position.set(0, 25.1, 0);
  MovingCube.name = 'videoCube' + clientID;
  scene.add( MovingCube );
  return MovingCube;
}
