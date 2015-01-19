var createYourPlayerScreen = function(){

  var geometry = new THREE.BoxGeometry( 9, 9, 1 );

  var plainMaterial = new THREE.MeshBasicMaterial( {color: 'lightgrey'} );

  var materialArray = [];
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(new THREE.MeshBasicMaterial( { color:'white', map: THREE.ImageUtils.loadTexture( 'images/smiley.png' ) }));

  var material = new THREE.MeshFaceMaterial(materialArray);

  var playerScreen = new THREE.Mesh( geometry, material );
  //playerScreen.castShadow = true;

  playerScreen.name = 'your-screen';

  body = new Avatar(THREE);

  body.mesh.position.y = - 12;


  body.stopWalking();

  //realFaces.THREE.duckWalkers[ID] = body;

  playerScreen.add(body.mesh);
  //playerScreen.position.y += 10;
  playerScreen.startWalking = function(){
    body.startWalking();
  };

  playerScreen.stopWalking = function(){
    body.stopWalking();
  };

  playerScreen.update = function(){
    body.render();
  };


  playerScreen.addVideo = function(){

    var video = document.getElementById('localVideo');

    var videoTexture = new THREE.VideoTexture( video );
    videoTexture.generateMipmaps = false;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    var materialArray = [];
    realFaces.THREE.scene = realFaces.THREE.scene || window.scene;
    var plainMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey') } );
    materialArray.push(plainMaterial);
    materialArray.push(plainMaterial);
    materialArray.push(plainMaterial);
    materialArray.push(plainMaterial);
    materialArray.push(plainMaterial);
    materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
    var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);

    var cube = realFaces.THREE.scene.getObjectByName('your-screen');
    cube.material = MovingCubeMat;
    cube.material.needsUpdate = true;
  };

  playerEvents.addListener('joined_room', playerScreen.addVideo);

  return playerScreen;

  // realFaces.THREE.objects.push( playerScreen );
  // realFaces.THREE.scene.add( playerScreen );
  // realFaces.THREE.collidableMeshList.push(playerScreen);
}
