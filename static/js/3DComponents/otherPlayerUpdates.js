
RealSocket.prototype.createPlayerScreen = function(ID, createTranslation){
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
  playerScreen.castShadow = true;

  playerScreen.name = 'player-' + ID;

  body = new Avatar(THREE);

  body.mesh.position.y = -realFaces.THREE.sceneVars.playerStartHeight;


  body.stopWalking();

  realFaces.THREE.duckWalkers[ID] = body;

  playerScreen.add(body.mesh);
  playerScreen.position.y += 10;


  realFaces.THREE.objects.push( playerScreen );
  realFaces.THREE.scene.add( playerScreen );
  realFaces.THREE.collidableMeshList.push(playerScreen);

};


RealSocket.prototype.removePlayer = function(ID){
  var player = realFaces.THREE.scene.getObjectByName('player-'+ID);
  realFaces.THREE.scene.remove(player);
  var remotesContainer = document.getElementById('remotesVideos');
  var remoteVideo = document.getElementById(ID);
  if (remoteVideo)
    remotesContainer.removeChild(remoteVideo);
};

RealSocket.prototype.teleportPlayer = function(ID, translation){
  if(ID === realFaces.yourID){
    return;
  }

  var player = realFaces.THREE.scene.getObjectByName('player-'+ID);

  player.position.x = translation.position.x;
  player.position.y = translation.position.y;
  player.position.z = translation.position.z;

  // TODO: Euler Angles must be applied to other players before x rotation can be synced
  // player.rotation.x = translation.rotation.x;

  player.rotation.y = translation.rotation.y;

};

RealSocket.prototype.movePlayer = function(ID, newTranslation){
  var player = realFaces.THREE.scene.getObjectByName('player-'+ID);
  var body = realFaces.THREE.duckWalkers[ID];

  if (body.isWalking() && Math.abs(player.position.x - newTranslation.position.x) < 1 && Math.abs(player.position.y - newTranslation.position.y) < 1 && Math.abs(player.position.z - newTranslation.position.z) < 1){
    body.stopWalking();
  }else if(!body.walking && ( Math.abs(player.position.x - newTranslation.position.x) > 1|| Math.abs(player.position.y - newTranslation.position.y) > 1 || Math.abs(player.position.z - newTranslation.position.z) > 1 ) ){
     body.startWalking();
   }

  if(!player.tweenedPosition){
    player.tweenedPosition = {
      x : player.position.x,
      y : player.position.y,
      z : player.position.z
    };
    player.tweenedRotation = {
      y : player.rotation.y
    };
  }

  player.positionTween = new TWEEN.Tween(player.tweenedPosition).to(newTranslation.position, realFaces.socket.socketInterval);
  player.rotationTween = new TWEEN.Tween(player.tweenedRotation).to(newTranslation.rotation, realFaces.socket.socketInterval);

  player.positionTween.onUpdate(function(){
    player.position.x = player.tweenedPosition.x;
    player.position.y = player.tweenedPosition.y;
    player.position.z = player.tweenedPosition.z;
  });

  player.rotationTween.onUpdate(function(){
    player.rotation.y = player.tweenedRotation.y;
  });

  player.positionTween.start();
  player.rotationTween.start();
};


