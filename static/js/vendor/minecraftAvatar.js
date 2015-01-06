//simplified adaption of the voxel skin node package with features that were incompatible with the new version of three.js removed

function Skin(three, opts) {

  opts = opts || {};

  THREE = three // hack until three.js fixes multiple instantiation
  this.sizeRatio = opts.sizeRatio || 0.4
  this.scale = opts.scale || new three.Vector3(1, 1, 1)
  this.fallbackImage = opts.fallbackImage || 'skin.png'
  this.createCanvases()
  this.mesh = this.createPlayerObject()
  this.mesh.scale.set(this.sizeRatio, this.sizeRatio * 0.75, this.sizeRatio)

  this.walkSpeed = 0.6;
  this.startedWalking = 0.0;
  this.stoppedWalking = 0.0;
  this.walking = false;
  this.acceleration = 0.5;
}

Skin.prototype.createCanvases = function() {
  this.skinBig = document.createElement('canvas')
  this.skinBigContext = this.skinBig.getContext('2d')
  this.skinBig.width = 64 * this.sizeRatio
  this.skinBig.height = 32 * this.sizeRatio

  this.skin = document.createElement('canvas')
  this.skinContext = this.skin.getContext('2d')
  this.skin.width = 64
  this.skin.height = 32
}


// Skin.prototype.cubeFromPlanes = function (size, mat) {
//   var cube = new THREE.Object3D();
//   var meshes = [];
//   for(var i=0; i < 6; i++) {
//     var mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
//     mesh.doubleSided = true;
//     cube.add(mesh);
//     meshes.push(mesh);
//   }
//   // Front
//   meshes[0].rotation.x = Math.PI/2;
//   meshes[0].rotation.z = -Math.PI/2;
//   meshes[0].position.x = size/2;

//   // Back
//   meshes[1].rotation.x = Math.PI/2;
//   meshes[1].rotation.z = Math.PI/2;
//   meshes[1].position.x = -size/2;

//   // Top
//   meshes[2].position.y = size/2;

//   // Bottom
//   meshes[3].rotation.y = Math.PI;
//   meshes[3].rotation.z = Math.PI;
//   meshes[3].position.y = -size/2;

//   // Left
//   meshes[4].rotation.x = Math.PI/2;
//   meshes[4].position.z = size/2;

//   // Right
//   meshes[5].rotation.x = -Math.PI/2;
//   meshes[5].rotation.y = Math.PI;
//   meshes[5].position.z = -size/2;

//   return cube;
// }

//exporting these meshes for manipulation:
//leftLeg
//rightLeg
//leftArm
//rightArm
//body
//head

Skin.prototype.createPlayerObject = function(scene) {
  var headgroup = new THREE.Object3D();
  var upperbody = this.upperbody = new THREE.Object3D();
  var plainMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey') } );

  // Left leg
  var leftleggeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    leftleggeo.vertices[i].y -= 6;
  }
  var leftleg = this.leftLeg = new THREE.Mesh(leftleggeo, plainMaterial);
  leftleg.position.z = -2;
  leftleg.position.y = -6;

  // Right leg
  var rightleggeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    rightleggeo.vertices[i].y -= 6;
  }
  var rightleg = this.rightLeg =new THREE.Mesh(rightleggeo, plainMaterial);
  rightleg.position.z = 2;
  rightleg.position.y = -6;


  // Body
  var bodygeo = new THREE.CubeGeometry(4, 12, 8);
  var bodymesh = this.body = new THREE.Mesh(bodygeo, plainMaterial);
  upperbody.add(bodymesh);


  // Left arm
  var leftarmgeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    leftarmgeo.vertices[i].y -= 4;
  }
  var leftarm = this.leftArm = new THREE.Mesh(leftarmgeo, plainMaterial);
  leftarm.position.z = -6;
  leftarm.position.y = 4;
  leftarm.rotation.x = Math.PI/32;
  upperbody.add(leftarm);

  // Right arm
  var rightarmgeo = new THREE.CubeGeometry(4, 12, 4);
  for(var i=0; i < 8; i+=1) {
    rightarmgeo.vertices[i].y -= 4;
  }
  var rightarm =this.rightArm = new THREE.Mesh(rightarmgeo, plainMaterial);
  rightarm.position.z = 6;
  rightarm.position.y = 4;
  rightarm.rotation.x = -Math.PI/32;

  upperbody.add(rightarm);

  //Head
  var headgeo = new THREE.CubeGeometry(8, 8, 8);
  var headmesh = this.head = new THREE.Mesh(headgeo, plainMaterial);
  headmesh.position.y = 2;


  var unrotatedHeadMesh = new THREE.Object3D();
  unrotatedHeadMesh.rotation.y = Math.PI / 2;
  unrotatedHeadMesh.add(headmesh);

  headgroup.add(unrotatedHeadMesh);
  headgroup.position.y = 8;

  var playerModel = this.playerModel = new THREE.Object3D();

  playerModel.add(leftleg);
  playerModel.add(rightleg);

  playerModel.add(upperbody);

  var playerRotation = new THREE.Object3D();
  playerRotation.rotation.y = Math.PI / 2
  playerRotation.position.y = 12
  playerRotation.add(playerModel)

  var rotatedHead = new THREE.Object3D();
  rotatedHead.rotation.y = -Math.PI/2;
  rotatedHead.add(headgroup);

  playerModel.add(rotatedHead);
  playerModel.position.y = 6;

  var playerGroup = new THREE.Object3D();


  playerGroup.add(playerRotation);
  playerGroup.scale  = this.scale
  return playerGroup
}
