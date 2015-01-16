realFaces.THREE = {};
realFaces.THREE.collidableMeshList = [];
realFaces.THREE.objects = [];
realFaces.THREE.duckWalkers = [];

// var camera, scene, renderer;
// var controls;

// var objects = [], duckWalkers = [];

// var raycaster;
// var collidableMeshList = [];

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

realFaces.sceneVars = {
  playerStartHeight:12,
  playerSpeed: 300,
  playerJump: 'x',
  playerSize: 'x',

  sceneSize: 500,

  skySize: 4000

}

var negativeBoundary = -realFaces.sceneVars.sceneSize/2, positiveBoundary = realFaces.sceneVars.sceneSize/2;

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

  var element = document.body;

  var pointerlockchange = function ( event ) {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      if(!realFaces.webrtc.webcam){
        document.getElementById('webcamWarning').style.visibility = 'visible';
      }else{
        document.getElementById('webcamWarning').style.visibility = 'hidden';
      }

      controls.enabled = true;

      blocker.style.display = 'none';

    } else {

      if(!realFaces.webrtc.webcam){
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


realFaces.THREE.init = function () {

  realFaces.THREE.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );

  realFaces.THREE.scene = new THREE.Scene();
  realFaces.THREE.scene.fog = new THREE.Fog( 0xffffff, 0, 1750 );

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  realFaces.THREE.scene.add( light );

  controls = new THREE.PointerLockControls( realFaces.THREE.camera );
  realFaces.THREE.scene.add( controls.getObject() );

  realFaces.THREE.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // var geometry = new THREE.BoxGeometry( 10, 10, 10 );
  // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  // var playerCub = new THREE.Mesh( geometry, material );

  // scene.add( playerCube );

  ///////////////////
  // CREATE FLOOR ///
  ///////////////////

  // Tiled floor

  // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 10, 10 );
  // DoubleSide: render texture on both sides of mesh
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(realFaces.sceneVars.sceneSize, realFaces.sceneVars.sceneSize, 1, 1);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  realFaces.THREE.scene.add(floor);


  //basic floor
  // geometry = new THREE.PlaneBufferGeometry( sceneVars.sceneSize, sceneVars.sceneSize, 50,50);
  // geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );



  // material = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey'), wireframe:true } );

  // mesh = new THREE.Mesh( geometry, material );
  // scene.add( mesh );

  //////////////////////
  // END CREATE FLOOR //
  //////////////////////

  //////////////////////
  // CREATE SKYBOX   ///
  //////////////////////

  var skyBoxDir = 'UnionSquare';

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

  skyBox = new THREE.Mesh( new THREE.BoxGeometry( realFaces.sceneVars.skySize, realFaces.sceneVars.skySize, realFaces.sceneVars.skySize ), material );
  skyBox.position.set(0, realFaces.sceneVars.skySize * 0.4, 0);
  realFaces.THREE.scene.add( skyBox );

  ////////////////////////
  // END CREATE SKYBOX ///
  ////////////////////////

  ///////////////////
  // CREATE WALL ////
  ///////////////////
  var wallGeometry;
  var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, visible:false } );

  //west wall
  wallGeometry = new THREE.BoxGeometry( 10, 100, realFaces.sceneVars.sceneSize);
  var wallWest = new THREE.Mesh(wallGeometry, wireMaterial);
  wallWest.position.set(-realFaces.sceneVars.sceneSize/2, 50, 0);
  realFaces.THREE.scene.add(wallWest);
  realFaces.THREE.collidableMeshList.push(wallWest);
  //east wall
  //wallGeometry = new THREE.CubeGeometry(10, 100, 500, 1, 1, 1 );
  var wallEast = new THREE.Mesh(wallGeometry, wireMaterial);
  wallEast.position.set(realFaces.sceneVars.sceneSize/2, 50, 0);
  realFaces.THREE.scene.add(wallEast);
  realFaces.THREE.collidableMeshList.push(wallEast);
  //north wall
  wallGeometry = new THREE.BoxGeometry(realFaces.sceneVars.sceneSize, 100, 10, 1, 1, 1 );
  var wallNorth = new THREE.Mesh(wallGeometry, wireMaterial);
  wallNorth.position.set(0, 50, -realFaces.sceneVars.sceneSize/2);
  realFaces.THREE.scene.add(wallNorth);
  realFaces.THREE.collidableMeshList.push(wallNorth);
  //south wall
  //wallGeometry = new THREE.CubeGeometry(500, 100, 10, 1, 1, 1 );
  var wallSouth = new THREE.Mesh(wallGeometry, wireMaterial);
  wallSouth.position.set(0, 50, realFaces.sceneVars.sceneSize/2);
  realFaces.THREE.scene.add(wallSouth);
  realFaces.THREE.collidableMeshList.push(wallSouth);

  ///////////////////////
  // END CREATE WALL ////
  ///////////////////////


  realFaces.THREE.renderer = new THREE.WebGLRenderer();
  realFaces.THREE.renderer.setClearColor( 0xffffff );
  realFaces.THREE.renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( realFaces.THREE.renderer.domElement );

  //

  window.addEventListener( 'resize', realFaces.THREE.onWindowResize, false );

}

realFaces.THREE.onWindowResize = function() {

  realFaces.THREE.camera.aspect = window.innerWidth / window.innerHeight;
  realFaces.THREE.camera.updateProjectionMatrix();

  realFaces.THREE.renderer.setSize( window.innerWidth, window.innerHeight );

}

realFaces.THREE.animate = function () {

  requestAnimationFrame( realFaces.THREE.animate );

  controls.isOnObject( false );

  realFaces.THREE.raycaster.ray.origin.copy( controls.getObject().position );
  realFaces.THREE.raycaster.ray.origin.y -= 10;

  var intersections = realFaces.THREE.raycaster.intersectObjects( realFaces.THREE.objects );

  if ( intersections.length > 0 ) {

    controls.isOnObject( true );

  }

  for(var i = 0, len = realFaces.THREE.objects.length; i < len; i++){

    var object = realFaces.THREE.objects[i];

    if (object.hasOwnProperty('update'))
      object.update();

  }

  for(var ID in realFaces.THREE.duckWalkers){

    realFaces.THREE.duckWalkers[ID].render();

  }



  TWEEN.update();

  controls.update();

  realFaces.THREE.renderer.render( realFaces.THREE.scene, realFaces.THREE.camera );

}


realFaces.THREE.init();
realFaces.THREE.animate();
