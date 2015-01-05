var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var objects = [];

var raycaster;
var collidableMeshList = [];

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

  var element = document.body;

  var pointerlockchange = function ( event ) {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      controls.enabled = false;

      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';

      instructions.style.display = '';

    }

  }

  var pointerlockerror = function ( event ) {

    instructions.style.display = '';

  };

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener( 'click', function ( event ) {

    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

      var fullscreenchange = function ( event ) {

        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

          document.removeEventListener( 'fullscreenchange', fullscreenchange );
          document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

          element.requestPointerLock();
        }

      }

      document.addEventListener( 'fullscreenchange', fullscreenchange, false );
      document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

      element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

      element.requestFullscreen();

    } else {

      element.requestPointerLock();

    }

  }, false );

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  scene.add( light );

  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // var geometry = new THREE.BoxGeometry( 10, 10, 10 );
  // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  // var playerCub = new THREE.Mesh( geometry, material );

  // scene.add( playerCube );

  ///////////////////
  // CREATE FLOOR ///
  ///////////////////

  geometry = new THREE.PlaneBufferGeometry( 500, 500, 100, 100 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

  // for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

  //   var vertex = geometry.vertices[ i ];
  //   vertex.x += Math.random() * 20 - 10;
  //   vertex.y += Math.random() * 2;
  //   vertex.z += Math.random() * 20 - 10;

  // }

  // for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

  //   var face = geometry.faces[ i ];
  //   face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  //   face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  //   face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

  // }

  material = new THREE.MeshBasicMaterial( { color: new THREE.Color('lightgreen'), wireframe:true } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  //////////////////////
  // END CREATE FLOOR //
  //////////////////////

  ///////////////////
  // CREATE WALL ////
  ///////////////////
  var wallGeometry;
  var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
  //west wall
  wallGeometry = new THREE.BoxGeometry( 10, 100, 500, 1, 1, 1 );
  var wallWest = new THREE.Mesh(wallGeometry, wireMaterial);
  wallWest.position.set(-250, 50, 0);
  scene.add(wallWest);
  collidableMeshList.push(wallWest);
  //east wall
  //wallGeometry = new THREE.CubeGeometry(10, 100, 500, 1, 1, 1 );
  var wallEast = new THREE.Mesh(wallGeometry, wireMaterial);
  wallEast.position.set(250, 50, 0);
  scene.add(wallEast);
  collidableMeshList.push(wallEast);
  //north wall
  wallGeometry = new THREE.BoxGeometry(500, 100, 10, 1, 1, 1 );
  var wallNorth = new THREE.Mesh(wallGeometry, wireMaterial);
  wallNorth.position.set(0, 50, -250);
  scene.add(wallNorth);
  collidableMeshList.push(wallNorth);
  //south wall
  //wallGeometry = new T,,HREE.CubeGeometry(500, 100, 10, 1, 1, 1 );
  var wallSouth = new THREE.Mesh(wallGeometry, wireMaterial);
  wallSouth.position.set(0, 50, 250);
  scene.add(wallSouth);
  collidableMeshList.push(wallSouth);

  ///////////////////////
  // END CREATE WALL ////
  ///////////////////////

  /// CREATE VIKING MODEL

  viking = new Skin(THREE, 'images/viking.png')

  viking.mesh.position.z = -50

  scene.add(viking.mesh)



  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xffffff );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  controls.isOnObject( false );

  raycaster.ray.origin.copy( controls.getObject().position );
  raycaster.ray.origin.y -= 10;

  var intersections = raycaster.intersectObjects( objects );

  if ( intersections.length > 0 ) {

    controls.isOnObject( true );

  }

  for(var i = 0, len = objects.length; i < len; i++){

    var object = objects[i];

    if (object.hasOwnProperty('update'))
      object.update();

  }



  TWEEN.update();

  controls.update();

  renderer.render( scene, camera );

}
