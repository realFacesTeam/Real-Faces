//simplified adaption of the voxel avatar node package with features that were incompatible with the new version of three.js removed

function Avatar(three, opts) {

  opts = opts || {};

  THREE = three // hack until three.js fixes multiple instantiation
  this.sizeRatio = opts.sizeRatio || 0.4
  this.scale = opts.scale || new three.Vector3(1, 1, 1)
  this.fallbackImage = opts.fallbackImage || 'avatar.png'
  this.createCanvases()
  this.mesh = this.createPlayerObject()
  this.mesh.scale.set(this.sizeRatio, this.sizeRatio * 0.75, this.sizeRatio)

  this.walkSpeed = 0.6;
  this.startedWalking = 0.0;
  this.stoppedWalking = 0.0;
  this.walking = false;
  this.acceleration = 0.5;
}

Avatar.prototype.createCanvases = function() {
  this.avatarBig = document.createElement('canvas')
  this.avatarBigContext = this.avatarBig.getContext('2d')
  this.avatarBig.width = 64 * this.sizeRatio
  this.avatarBig.height = 32 * this.sizeRatio

  this.avatar = document.createElement('canvas')
  this.avatarContext = this.avatar.getContext('2d')
  this.avatar.width = 64
  this.avatar.height = 32
}


Avatar.prototype.createPlayerObject = function(scene) {
  var headgroup = new THREE.Object3D();
  var upperbody = this.upperbody = new THREE.Object3D();
  var plainMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey') } );

  var armMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/arm.png' )});
  var bodyMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/body.png' )});
  var bottomMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/bottom.png' )});
  var handMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/hand.png' )});
  var legMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/leg.png' )});
  var shoeMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/shoe.png' )});
  var shoulderMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/shoulder.png' )});
  var sideMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/bodyTextures/defaultPerson/side.png' )});

  var armMatFull = new THREE.MeshFaceMaterial([armMaterial, armMaterial, shoulderMaterial, handMaterial, armMaterial,armMaterial])
  var bodyMatFull = new THREE.MeshFaceMaterial([bodyMaterial, bodyMaterial, bottomMaterial, bottomMaterial, sideMaterial,sideMaterial])
  var legMatFull = new THREE.MeshFaceMaterial([legMaterial, legMaterial, shoeMaterial, shoeMaterial, legMaterial,legMaterial])
  // Left leg
  var leftleggeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    leftleggeo.vertices[i].y -= 6;
  }


  var leftleg = this.leftLeg = new THREE.Mesh(leftleggeo, legMatFull);
  leftleg.position.z = -2;
  leftleg.position.y = -6;

  // Right leg
  var rightleggeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    rightleggeo.vertices[i].y -= 6;
  }
  var rightleg = this.rightLeg =new THREE.Mesh(rightleggeo, legMatFull);
  rightleg.position.z = 2;
  rightleg.position.y = -6;


  // Body
  var bodygeo = new THREE.CubeGeometry(4, 12, 8);
  var bodymesh = this.body = new THREE.Mesh(bodygeo, bodyMatFull);
  upperbody.add(bodymesh);


  // Left arm
  var leftarmgeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    leftarmgeo.vertices[i].y -= 4;
  }
  var leftarm = this.leftArm = new THREE.Mesh(leftarmgeo, armMatFull);
  leftarm.position.z = -6;
  leftarm.position.y = 4;
  leftarm.rotation.x = Math.PI/32;
  upperbody.add(leftarm);

  // Right arm
  var rightarmgeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    rightarmgeo.vertices[i].y -= 4;
  }
  var rightarm =this.rightArm = new THREE.Mesh(rightarmgeo, armMatFull);
  rightarm.position.z = 6;
  rightarm.position.y = 4;
  rightarm.rotation.x = -Math.PI/32;

  upperbody.add(rightarm);

  //Head
  // var headgeo = new THREE.CubeGeometry(0.1, 0.1, 0.1);
  // var headmesh = this.head = new THREE.Mesh(headgeo, plainMaterial);
  // headmesh.position.y = 2;


  // var unrotatedHeadMesh = new THREE.Object3D();
  // unrotatedHeadMesh.rotation.y = Math.PI / 2;
  // unrotatedHeadMesh.add(headmesh);

  // headgroup.add(unrotatedHeadMesh);
  // headgroup.position.y = 8;

  var playerModel = this.playerModel = new THREE.Object3D();

  playerModel.add(leftleg);
  playerModel.add(rightleg);

  playerModel.add(upperbody);

  var playerRotation = new THREE.Object3D();
  playerRotation.rotation.y = Math.PI / 2
  playerRotation.position.y = 12
  playerRotation.add(playerModel)

  // var rotatedHead = new THREE.Object3D();
  // rotatedHead.rotation.y = -Math.PI/2;
  // rotatedHead.add(headgroup);

  // playerModel.add(rotatedHead);
  playerModel.position.y = 6;

  var playerGroup = new THREE.Object3D();


  playerGroup.add(playerRotation);
  playerGroup.scale  = this.scale
  return playerGroup
};

//slightly adapted copy of the voxel duckWalk node package

Avatar.prototype.render = function(){


  var time = Date.now() / 1000
  if (this.walking && time < this.startedWalking + this.acceleration){
    this.walkSpeed = (time - this.startedWalking) / this.acceleration
    //console.log('walking', this.walkSpeed)
  }
  if (!this.walking ){
    if (time < this.stoppedWalking + this.acceleration)
      this.walkSpeed = -1 / this.acceleration * (time - this.stoppedWalking) + 1
    else if(this.walkSpeed > 0.02)
      this.walkSpeed *= 0.95;
    //console.log('not walking', this.walkSpeed)

  }

  // this.head.rotation.y = Math.sin(time * 1.5) / 3 * this.walkSpeed;
  // this.head.rotation.z = Math.sin(time) / 2 * this.walkSpeed;

  this.rightArm.rotation.z = 2 * Math.cos(0.6662 * time * 10 + Math.PI) * this.walkSpeed
  this.rightArm.rotation.x = 1 * (Math.cos(0.2812 * time * 10) - 1) * this.walkSpeed
  this.leftArm.rotation.z = 2 * Math.cos(0.6662 * time * 10) * this.walkSpeed
  this.leftArm.rotation.x = 1 * (Math.cos(0.2312 * time * 10) + 1) * this.walkSpeed

  this.rightLeg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10) * this.walkSpeed
  this.leftLeg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10 + Math.PI) * this.walkSpeed
}

Avatar.prototype.startWalking = function(){
  //console.log('startWalking', this)
  var now = Date.now() / 1000
  this.walking = true
  if (this.stoppedWalking + this.acceleration > now){
    var progress = now - this.stoppedWalking;
    this.startedWalking = now - (this.stoppedWalking + this.acceleration - now)
  } else {
    this.startedWalking = Date.now() / 1000
  }
}

Avatar.prototype.stopWalking = function() {
  //console.log('stopWalking', this)
  var now = Date.now() / 1000
  this.walking = false
  if (this.startedWalking + this.acceleration > now){
    this.stoppedWalking = now - (this.startedWalking + this.acceleration - now)
  } else {
    this.stoppedWalking = Date.now() / 1000
  }
  //this.walkSpeed = 0;
}

Avatar.prototype.isWalking = function(){
  return this.walking
}

Avatar.prototype.setAcceleration = function(newA){
  this.acceleration = newA
}
