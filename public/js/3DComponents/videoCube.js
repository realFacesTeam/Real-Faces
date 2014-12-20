var createVideoCube = function(pos1, pos2, pos3, videoTexture, scene, clientID, debugCube){
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
  MovingCube.position.set(pos1, pos2, pos3);
  MovingCube.name = 'videoCube' + clientID;
  scene.add( MovingCube );
}
