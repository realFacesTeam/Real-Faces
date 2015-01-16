var camera, scene, renderer, light;
var geometry, material, mesh, verticalMirror;
var controls;


var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;


var objects = [], duckWalkers = [];

var raycaster;
var collidableMeshList = [];

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var sceneVars = {
  playerStartHeight:12,
  playerSpeed: 300,
  //EDIT FIX
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

      // if(!webrtc.webcam){
      //   document.getElementById('webcamWarning').style.visibility = 'visible';
      // }else{
      //   document.getElementById('webcamWarning').style.visibility = 'hidden';
      // }

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      // if(!webrtc.webcam){
      //   document.getElementById('webcamWarning').style.visibility = 'visible';
      // }else{
      //   document.getElementById('webcamWarning').style.visibility = 'hidden';
      // }

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

  console.log('3 init')

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );

  scene = new THREE.Scene();

  //scene.fog = new THREE.Fog( 0xffffff, 0, 1750 );


  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add( ambient );

  light = new THREE.SpotLight( 0xffffff, 0.85, 0, Math.PI / 2, 1 );
  light.position.set( 0, 1500, 1000 );
  light.target.position.set( 0, 0, 0 );

  scene.add( light );

  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // (function() {
  //   var start_time = (new Date()).getTime();
  //   var cube_geometry = new THREE.CubeGeometry( 6, 6, 6 );
  //   var cube_mesh = new THREE.Mesh( cube_geometry );
  //   cube_mesh.position.x = -30;
  //   cube_mesh.position.y = 35;
  //   var cube_bsp = new ThreeBSP( cube_mesh );
  //   var sphere_geometry = new THREE.SphereGeometry( 3.6, 32, 32 );
  //   var sphere_mesh = new THREE.Mesh( sphere_geometry );
  //   sphere_mesh.position.x = -30;
  //   sphere_mesh.position.y = 35;
  //   var sphere_bsp = new ThreeBSP( sphere_mesh );

  //   var subtract_bsp = cube_bsp.subtract( sphere_bsp );
  //   var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture('images/CSGtexture.png') }) );
  //   result.geometry.computeVertexNormals();
  //   scene.add( result );
  //   console.log( 'Example 1: ' + ((new Date()).getTime() - start_time) + 'ms' );
  // })();



  //cannon fps copy floor

  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/grid.png' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 50, 30 );
  geometry = new THREE.PlaneBufferGeometry( 250, 150, 5, 5 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
  material = new THREE.MeshLambertMaterial( { map: floorTexture} );
  floor = new THREE.Mesh( geometry, material );
  floor.position.z = -25;
  floor.position.x = -25;

  floor.castShadow = false;
  floor.receiveShadow = false;
  scene.add( floor );


  createWalls();

  createCeiling();

  //////////////////////
  // CREATE SKYBOX   ///
  //////////////////////

  var skyBoxDir = 'Sorsele3';

  var path = "images/skyBoxes/" + skyBoxDir + "/";
  var format = '.jpg';
  var urls = [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
  ];

  var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
  reflectionCube.format = THREE.RGBFormat;

  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = reflectionCube;

  var material = new THREE.ShaderMaterial( {

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide

  } ),

  skyBox = new THREE.Mesh( new THREE.BoxGeometry( sceneVars.skySize, sceneVars.skySize, sceneVars.skySize ), material );
  skyBox.position.set(0, sceneVars.skySize * 0.4, 0);
  scene.add( skyBox );

  ////////////////////////
  // END CREATE SKYBOX ///
  ////////////////////////


  ///////////////
  // FURNITURE //
  ///////////////



  renderer = new THREE.WebGLRenderer({ antialias: true} );
  renderer.context.canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(renderer.context.canvas);
  renderer.context.canvas.addEventListener("webglcontextlost", function(event) {
      event.preventDefault();
      // animationID would have been set by your call to requestAnimationFrame
      cancelAnimationFrame(animationID);
      console.log('animation cancelled due to lost webGL context')
  }, false);
  //renderer.setClearColor( scene.fog.color );
  //renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  //container.appendChild( renderer.domElement );

  renderer.autoClear = false;

  //

  window.addEventListener( 'resize', onWindowResize, false );


  verticalMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.01, textureWidth: window.innerWidth, textureHeight: window.innerHeight } );

  var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 30, 25 ), verticalMirror.material );
  verticalMirrorMesh.add( verticalMirror );
  verticalMirrorMesh.position.y = 15;
  verticalMirrorMesh.position.z = -47.49;
  scene.add( verticalMirrorMesh );

  document.body.appendChild( renderer.domElement );
}

function onWindowResize() {

  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();

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

  // cubeCamera.updateCubeMap( renderer, scene );

  TWEEN.update();

  controls.update();

  verticalMirror.render();

  renderer.render( scene, camera );


}
