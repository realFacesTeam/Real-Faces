var createPlayerCube = function(ID, createTranslation){
  console.log('created player cube: '+ID);
  var geometry = new THREE.BoxGeometry( 10, 10, 10 );
  //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

  var materialArray = [];
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));

  var material = new THREE.MeshFaceMaterial(materialArray);

  var playerCube = new THREE.Mesh( geometry, material );

  playerCube.name = 'player-' + ID;
  //playerCube.position.y += 10;


  playerCube.update = function(){
   // playerCube.tweenedMove();
  };


  objects.push( playerCube );
  scene.add( playerCube );
  collidableMeshList.push(playerCube);

};


var removePlayer = function(ID){

  var player = scene.getObjectByName('player-'+ID);
  scene.remove(player);

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

playerEvents.addListener('new_player', createPlayerCube);

playerEvents.addListener('remove_player', removePlayer);

playerEvents.addListener('teleport_other_player', teleportPlayer);

playerEvents.addListener('move_other_player', movePlayer);


