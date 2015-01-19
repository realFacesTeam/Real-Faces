var createGalleryPicture = function(context, image, x, z, rotated, width, height, y){
  var rotated = rotated || false;
  var height = height || 40;
  var width = width || 40;

  var plainMaterial = new THREE.MeshBasicMaterial( {color: 'white'} );

  var texture = new THREE.ImageUtils.loadTexture( 'images/galleryPictures/' + image );
  //var material = new THREE.MeshLambertMaterial( {map:texture, side:THREE.DoubleSide, color: 'white'} );

  var materialArray = [];
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(new THREE.MeshBasicMaterial( { color:'white', map: texture }));
  materialArray.push(new THREE.MeshBasicMaterial( { color:'white', map: texture }));

  var material = new THREE.MeshFaceMaterial(materialArray);


  var picture = new THREE.Mesh( new THREE.BoxGeometry(width, height, 1), material );
  picture.position.set(x, y || height/2, z);

  if (rotated){
    picture.rotation.y = Math.PI / 2;
  }
  context.scene.add(picture);
}

var createGalleryPictures = function(context){
  createGalleryPicture(context, 'initialSetup.png', -120, -98);
  createGalleryPicture(context, 'WebRTC.png', -70, -98);
  createGalleryPicture(context, 'DOMTo3D.png', -51, -20, true);
  createGalleryPicture(context, 'logoText.jpg', -18, 48, false, 50, 15, 30);
}
