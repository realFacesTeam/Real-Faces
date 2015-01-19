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

  //playerScreen.name = 'player-' + ID;

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



  //playerEvents.addListener('new_player', this.socket.createPlayerScreen);

  return playerScreen;

  // realFaces.THREE.objects.push( playerScreen );
  // realFaces.THREE.scene.add( playerScreen );
  // realFaces.THREE.collidableMeshList.push(playerScreen);
}
