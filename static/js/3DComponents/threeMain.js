var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var objects = [], duckWalkers = [];

var raycaster;
var collidableMeshList = [];

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var sceneVars = {
  playerStartHeight:12,
  playerSpeed: 300,
  playerJump: 'x',
  playerSize: 'x',

  sceneSize: 500,

  skySize: 4000

}

var negativeBoundary = -sceneVars.sceneSize/2, positiveBoundary = sceneVars.sceneSize/2;

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

  var element = document.body;

  var pointerlockchange = function ( event ) {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      if(!webrtc.webcam){
        document.getElementById('webcamWarning').style.visibility = 'visible';
      }else{
        document.getElementById('webcamWarning').style.visibility = 'hidden';
      }

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      if(!webrtc.webcam){
        document.getElementById('webcamWarning').style.visibility = 'visible';
      }else{
        document.getElementById('webcamWarning').style.visibility = 'hidden';
      }

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

      };

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

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog( 0xffffff, 0, 1750 );
  scene.fog = new THREE.Fog( 0x000000, 0, 500 );
  var ambient = new THREE.AmbientLight( 0x111111 );
  scene.add( ambient );
  light = new THREE.SpotLight( 0xffffff );
  light.position.set( 50, 150, 200 );
  light.target.position.set( 0, 0, 0 );
  if(true){
      light.castShadow = true;
      light.shadowCameraNear = 50;
      light.shadowCameraFar = 1000;//camera.far;
      light.shadowCameraFov = 40;
      light.shadowMapBias = 0.1;
      light.shadowMapDarkness = 0.7;
      light.shadowMapWidth = 2*512;
      light.shadowMapHeight = 2*512;
      //light.shadowCameraVisible = true;
  }
  scene.add( light );

  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );



  //cannon fps copy floor

  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/grid.png' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 100, 100 );
  geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
  material = new THREE.MeshLambertMaterial( { map: floorTexture} );
  floor = new THREE.Mesh( geometry, material );
  floor.castShadow = true;
  floor.receiveShadow = true;
  scene.add( floor );

  //note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.

  // DoubleSide: render texture on both sides of mesh
  // var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture} )
  // var floorGeometry = new THREE.PlaneGeometry(sceneVars.sceneSize, sceneVars.sceneSize, 1, 1);
  // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  // floor.position.y = -0.5;
  // floor.rotation.x = Math.PI / 2;
  // floor.castShadow = true;
  // floor.receiveShadow = true;
  // scene.add(floor);



  renderer = new THREE.WebGLRenderer();
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.setClearColor( scene.fog.color, 1  );
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

  for(var ID in duckWalkers){

    duckWalkers[ID].render();

  }



  TWEEN.update();

  controls.update();

  renderer.render( scene, camera );

}
