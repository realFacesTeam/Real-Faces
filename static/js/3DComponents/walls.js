var createWall = function (options){

  var height = options.height || 50;
  var width = options.width || 2.5;
  var length = options.length;
  var x = options.x;
  var y = options.y || 25;
  var z = options.z;
  var rotated = options.rotated || false;
  var castShadow = options.castShadow || false;
  var receiveShadow = options.receiveShadow || true;
  var texture = options.texture || new THREE.ImageUtils.loadTexture( 'images/Applestone.jpg' );
  var material = options.material || new THREE.MeshLambertMaterial( {map:texture, side:THREE.DoubleSide} );

  if(!options.window){
    var wall = new THREE.Mesh( new THREE.BoxGeometry(length, height, width), material );
    wall.position.set(x, y, z);
    if (rotated){
      wall.rotation.y = Math.PI / 2;
    }
    wall.castShadow = castShadow;
    wall.receiveShadow = receiveShadow;
    scene.add(wall);
  }else{
    var cube_geometry = new THREE.BoxGeometry( length, height, width );
    var cube_mesh = new THREE.Mesh( cube_geometry );
    cube_mesh.position.x = x;
    cube_mesh.position.y = y;
    cube_mesh.position.z = z;
    var cube_bsp = new ThreeBSP( cube_mesh );
    var glass_geometry = new THREE.BoxGeometry( 26, 26, (width + 0.1) );
    var glass_mesh = new THREE.Mesh( glass_geometry );
    glass_mesh.position.x = x;
    glass_mesh.position.y = 20;
    glass_mesh.position.z = z;
    var glass_bsp = new ThreeBSP( glass_mesh );

    var subtract_bsp = cube_bsp.subtract( glass_bsp );
    var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ map:texture }) );
    result.geometry.computeVertexNormals();
    if (rotated){
      result.rotation.y = Math.PI / 2;
    }
    scene.add( result );

  }

};


var createWindowFrame = function (options){

  var height = options.height || 40;
  var width = options.width || 2.5;
  var length = options.length;
  var x = options.x;
  var y = options.y || 20;
  var z = options.z;
  var rotated = options.rotated || false;
  var castShadow = options.castShadow || false;
  var receiveShadow = options.receiveShadow || false;
  //var texture = options.texture || new THREE.ImageUtils.loadTexture( 'images/Applestone.jpg' );
  //var material = options.material || new THREE.MeshLambertMaterial( {map:texture, side:THREE.DoubleSide} );

  //var start_time = (new Date()).getTime();
  var cube_geometry = new THREE.BoxGeometry( 28, 28, 3 );
  var cube_mesh = new THREE.Mesh( cube_geometry );
  cube_mesh.position.x = x;
  cube_mesh.position.y = y;
  cube_mesh.position.z = z;
  var cube_bsp = new ThreeBSP( cube_mesh );
  var glass_geometry = new THREE.BoxGeometry( 25, 25, 3.1 );
  var glass_mesh = new THREE.Mesh( glass_geometry );
  glass_mesh.position.x = x;
  glass_mesh.position.y = y;
  glass_mesh.position.z = z;
  var glass_bsp = new ThreeBSP( glass_mesh );

  var subtract_bsp = cube_bsp.subtract( glass_bsp );
  var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, color:'white' }) );
  result.geometry.computeVertexNormals();
  if (rotated){
    result.rotation.y = Math.PI / 2;
  }
  scene.add( result );
  //console.log( 'Example 1: ' + ((new Date()).getTime() - start_time) + 'ms' );
}

var createWalls = function(){

  createWall({length:150, x:25, z:50, window:true});
  createWindowFrame({length:150, x:25, z:50});
  createWall({length:100, x:-50, z:0, rotated:true});
  createWall({length:100, x:0, z:-50});
  createWall({length:150, x:100, z:-25, rotated:true, window:true});
  createWindowFrame({length:150, x:100, z:-25, rotated:true});
  createWall({length:200, x:0, z:-100, window:true});
  createWindowFrame({length:200, x:0, z:-100});
  createWall({length:100, x:-100, z:-50, rotated:true});
  createWall({length:50, x:-125, z:0});
  createWall({length:50, x:-150, z:-25, rotated:true});
  createWall({length:50, x:-150, z:25, rotated:true});
  createWall({length:100, x:-100, z:50});

};
