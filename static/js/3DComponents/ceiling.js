var createCeiling = function (options){

  var options = options || {};

  var height = options.height || 5;
  var width = options.width || 150;
  var length = options.length || 250;
  var x = options.x || -25;
  var y = options.y || 50;
  var z = options.z || -25;
  var rotated = options.rotated || false;
  var castShadow = options.castShadow || false;
  var receiveShadow = options.receiveShadow || true;



  var cube_geometry = new THREE.BoxGeometry( length, height, width );
  var cube_mesh = new THREE.Mesh( cube_geometry );
  cube_mesh.position.x = x;
  cube_mesh.position.y = y;
  cube_mesh.position.z = z;
  var cube_bsp = new ThreeBSP( cube_mesh );
  var glass_geometry = new THREE.BoxGeometry( 5, 3, 5 );
  var glass_mesh = new THREE.Mesh( glass_geometry );
  glass_mesh.position.x = x;
  glass_mesh.position.y = y;
  glass_mesh.position.z = z;
  var glass_bsp = new ThreeBSP( glass_mesh );

  var subtract_bsp = cube_bsp.subtract( glass_bsp );
  var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ color:'white' }) );
  result.geometry.computeVertexNormals();

  realFaces.THREE.scene.add( result );

}
