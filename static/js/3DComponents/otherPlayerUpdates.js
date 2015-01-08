var createPlayerScreen = function(ID, createTranslation){
  console.log('created player cube: '+ID);
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

  playerScreen.name = 'player-' + ID;

  body = new Avatar(THREE);

  body.mesh.position.y = -sceneVars.playerStartHeight;

  body.stopWalking();

  duckWalkers[ID] = body;

  playerScreen.add(body.mesh);
  playerScreen.position.y += 10;


  objects.push( playerScreen );
  scene.add( playerScreen );
  collidableMeshList.push(playerScreen);

};


var removePlayer = function(ID){
  var player = scene.getObjectByName('player-'+ID);
  scene.remove(player);
  var remotesContainer = document.getElementById('remotesVideos');
  var remoteVideo = document.getElementById(ID);
  if (remoteVideo)
    remotesContainer.removeChild(remoteVideo);
};

var teleportPlayer = function(ID, translation){

  var player = scene.getObjectByName('player-'+ID);

  player.position.x = translation.position.x;
  player.position.y = translation.position.y;
  player.position.z = translation.position.z;

  // TODO: Euler Angles must be applied to other players before x rotation can be synced
  // player.rotation.x = translation.rotation.x;

  player.rotation.y = translation.rotation.y;

};

var movePlayer = function(ID, newTranslation){

  var player = scene.getObjectByName('player-'+ID);
  var body = duckWalkers[ID];

  //console.log('translationChanges', player.position.x - newTranslation.position.x, player.position.y - newTranslation.position.y, player.position.z - newTranslation.position.z)

  // //console.log(body)
  if (body.isWalking() && Math.abs(player.position.x - newTranslation.position.x) < 1 && Math.abs(player.position.y - newTranslation.position.y) < 1 && Math.abs(player.position.z - newTranslation.position.z) < 1){
    //console.log('stop moving')
    body.stopWalking();
  }else if(!body.walking && ( Math.abs(player.position.x - newTranslation.position.x) > 1|| Math.abs(player.position.y - newTranslation.position.y) > 1 || Math.abs(player.position.z - newTranslation.position.z) > 1 ) ){
     //console.log('not moving so start, body.walking=', body.walking)
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

  player.positionTween = new TWEEN.Tween(player.tweenedPosition).to(newTranslation.position, socketInterval);
  player.rotationTween = new TWEEN.Tween(player.tweenedRotation).to(newTranslation.rotation, socketInterval);

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

playerEvents.addListener('new_player', createPlayerScreen);

playerEvents.addListener('remove_player', removePlayer);

playerEvents.addListener('teleport_other_player', teleportPlayer);

playerEvents.addListener('move_other_player', movePlayer);


