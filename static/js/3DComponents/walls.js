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
      wall.rotated = true;
    }
    wall.castShadow = castShadow;
    wall.receiveShadow = receiveShadow;

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
    var wall = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ map:texture }) );
    wall.geometry.computeVertexNormals();
    if (rotated){
      wall.rotation.y = Math.PI / 2;
      wall.rotated = true;
    }
  }

  wall.length = length;

  wall.matrixAutoUpdate = false;
  wall.updateMatrix();

  options.context.wallList.push(wall);

  options.context.scene.add(wall);
};


var createWindowFrame = function (options){

  var height = options.height || 25;
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
  var cube_geometry = new THREE.BoxGeometry( height + 3, height + 3, 3 );
  var cube_mesh = new THREE.Mesh( cube_geometry );
  cube_mesh.position.x = x;
  cube_mesh.position.y = y;
  cube_mesh.position.z = z;
  var cube_bsp = new ThreeBSP( cube_mesh );
  var glass_geometry = new THREE.BoxGeometry( height, height, 3.1 );
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

  options.context.scene.add( result );
}

var createWalls = function(context){

  createWall({length:150, x:25, z:50, window:true, context:context});
  createWindowFrame({length:150, x:25, z:50, context:context});
  createWall({length:100, x:-50, z:0, rotated:true, context:context});
  createWall({length:100, x:0, z:-50, context:context});
  createWall({length:150, x:100, z:-25, rotated:true, window:true, context:context});
  createWindowFrame({length:150, x:100, z:-25, rotated:true, context:context});
  createWall({length:250, x:-25, z:-100, window:true, context:context});
  createWindowFrame({length:250, x:-25, z:-100, context:context});
  //createWall({length:100, x:-100, z:-50, rotated:true});
  //createWall({length:50, x:-125, z:-100});
  createWall({length:150, x:-150, z:-25, rotated:true, window:true, context:context});
  createWindowFrame({length:150, x:-150, z:-25, rotated:true, context:context});
  // createWall({length:50, x:-150, z:25, rotated:true});
  createWall({length:100, x:-100, z:50, window:true, context:context});
  createWindowFrame({length:100, x:-100, z:50, context:context});

};
