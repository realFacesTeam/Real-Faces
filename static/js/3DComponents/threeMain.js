var RealTHREE = function (xMinBoundary, xMaxBoundary, zMinBoundary, zMaxBoundary) {
  this.collidableMeshList = [];
  this.wallList = [];
  this.objects = [];
  this.duckWalkers = [];
  this.sceneVars = {
    playerStartHeight:12,
    playerSpeed: 300,
    playerJump: 'x',
    playerSize: 'x',
    sceneSize: 500,
    skySize: 4000
  };
  this.negativeBoundaryX = xMinBoundary || -this.sceneVars.sceneSize/2;
  this.positiveBoundaryX = xMaxBoundary || this.sceneVars.sceneSize/2;
  this.negativeBoundaryZ = zMinBoundary || -this.sceneVars.sceneSize/2;
  this.positiveBoundaryZ = zMaxBoundary || this.sceneVars.sceneSize/2;

  this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog( 0xffffff, 0, 1750 );

  this.controls = new THREE.PointerLockControls( this.camera, this.sceneVars, this.positiveBoundaryX, this.negativeBoundaryX, this.positiveBoundaryZ, this.negativeBoundaryZ, this.wallList );
  this.scene.add( this.controls.getObject() );

  this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setClearColor( 0xffffff );
  this.renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( this.renderer.domElement );

  window.addEventListener( 'resize', this.onWindowResize, false );

};

RealTHREE.prototype.createSceneOutdoors = function () {
  ////////////////////
  // CREATE FLOOR ///
  ///////////////////

  // Tiled floor
  // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 10, 10 );
  // DoubleSide: render texture on both sides of mesh
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneBufferGeometry(this.sceneVars.sceneSize, this.sceneVars.sceneSize, 1, 1);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  this.scene.add(floor);

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  this.scene.add( light );

  //////////////////////
  // END CREATE FLOOR //
  //////////////////////

  //////////////////////
  // CREATE SKYBOX   ///
  //////////////////////
  var context = this;
  createSkybox('Tantolunden', this.sceneVars.skySize, context);

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
  wallGeometry = new THREE.BoxGeometry( 10, 100, this.sceneVars.sceneSize);
  var wallWest = new THREE.Mesh(wallGeometry, wireMaterial);
  wallWest.position.set(-this.sceneVars.sceneSize/2, 50, 0);
  this.scene.add(wallWest);
  this.collidableMeshList.push(wallWest);

  //east wall
  var wallEast = new THREE.Mesh(wallGeometry, wireMaterial);
  wallEast.position.set(this.sceneVars.sceneSize/2, 50, 0);
  this.scene.add(wallEast);
  this.collidableMeshList.push(wallEast);

  //north wall
  wallGeometry = new THREE.BoxGeometry(this.sceneVars.sceneSize, 100, 10, 1, 1, 1 );
  var wallNorth = new THREE.Mesh(wallGeometry, wireMaterial);
  wallNorth.position.set(0, 50, -this.sceneVars.sceneSize/2);
  this.scene.add(wallNorth);
  this.collidableMeshList.push(wallNorth);

  //south wall
  var wallSouth = new THREE.Mesh(wallGeometry, wireMaterial);
  wallSouth.position.set(0, 50, this.sceneVars.sceneSize/2);
  this.scene.add(wallSouth);
  this.collidableMeshList.push(wallSouth);

  ///////////////////////
  // END CREATE WALL ////
  ///////////////////////
};


RealTHREE.prototype.createSceneArtGallery = function () {

  var ambient = new THREE.AmbientLight( 0x444444 );
  this.scene.add( ambient );

  var light = new THREE.SpotLight( 0xffffff, 0.85, 0, Math.PI / 2, 1 );
  light.position.set( 0, 1500, 1000 );
  light.target.position.set( 0, 0, 0 );

  this.scene.add( light );

  //cannon fps copy floor

  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/grid.png' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 50, 30 );
  var geometry = new THREE.PlaneBufferGeometry( 250, 150, 5, 5 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
  var material = new THREE.MeshLambertMaterial( { map: floorTexture} );
  var floor = new THREE.Mesh( geometry, material );
  floor.position.z = -25;
  floor.position.x = -25;

  floor.castShadow = false;
  floor.receiveShadow = false;
  this.scene.add( floor );

  var context = this;
  createWalls(context);
      //fix this function call
  createCeiling(null, context);

  createSkybox('Sorsele3', this.sceneVars.skySize, context);

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
  renderer.setSize( window.innerWidth, window.innerHeight );
  //container.appendChild( renderer.domElement );

  //renderer.autoClear = false;


  this.verticalMirror = new THREE.Mirror( this.renderer, this.camera, { clipBias: 0.01, textureWidth: window.innerWidth, textureHeight: window.innerHeight } );

  var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 30, 25 ), this.verticalMirror.material );
  verticalMirrorMesh.add( this.verticalMirror );
  verticalMirrorMesh.position.y = 15;
  verticalMirrorMesh.position.z = -47.49;
  this.scene.add( verticalMirrorMesh );

  document.body.appendChild( renderer.domElement );

}

RealTHREE.prototype.createSceneUnionSquare  = function () {
  ////////////////////
  // CREATE FLOOR ///
  ///////////////////

  // Tiled floor
  // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 10, 10 );
  // DoubleSide: render texture on both sides of mesh
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneBufferGeometry(this.sceneVars.sceneSize, this.sceneVars.sceneSize, 1, 1);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  floor.matrixAutoUpdate = false;
  floor.updateMatrix();
  this.scene.add(floor);

  //////////////////////
  // END CREATE FLOOR //
  //////////////////////

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
  this.scene.add( light );


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

  skyBox = new THREE.Mesh( new THREE.BoxGeometry( this.sceneVars.skySize, this.sceneVars.skySize, this.sceneVars.skySize ), material );
  skyBox.position.set(0, this.sceneVars.skySize * 0.4, 0);
  this.scene.add( skyBox );

  ////////////////////////
  // END CREATE SKYBOX ///
  ////////////////////////

}

RealTHREE.prototype.createScene = function (sceneName) {
  if(sceneName === 'Outdoors'){
    this.createSceneOutdoors();
  }else if(sceneName === 'ArtGallery'){
    this.createSceneArtGallery();
  }else if(sceneName === 'UnionSquare'){
    this.createSceneUnionSquare();
  }
}

RealTHREE.prototype.onWindowResize = function() {
  realFaces.THREE.camera.aspect = window.innerWidth / window.innerHeight;
  realFaces.THREE.camera.updateProjectionMatrix();

  realFaces.THREE.renderer.setSize( window.innerWidth, window.innerHeight );
}

RealTHREE.prototype.animate = function (thisRef) {
  window.animateContext = window.animateContext || thisRef;
  var thisRef = window.animateContext;

  requestAnimationFrame( window.animateContext.animate );

  thisRef.controls.isOnObject( false );

  thisRef.raycaster.ray.origin.copy( thisRef.controls.getObject().position );
  thisRef.raycaster.ray.origin.y -= 10;

  var intersections = thisRef.raycaster.intersectObjects( thisRef.objects );

  if ( intersections.length > 0 ) {
    thisRef.controls.isOnObject( true );
  }

  for(var i = 0, len = thisRef.objects.length; i < len; i++){
    var object = thisRef.objects[i];
    if (typeof(object.update) === 'function')
      object.update();
  }

  for(var ID in thisRef.duckWalkers){
    thisRef.duckWalkers[ID].render();
  }

  TWEEN.update();
  //if this scene has mirrors, render them
  if(thisRef.verticalMirror){
    thisRef.verticalMirror.render();
  }
  thisRef.controls.update();
  thisRef.renderer.render( thisRef.scene, thisRef.camera );
}


RealTHREE.prototype.pointerLock = function () {

  //POINTER LOCK
  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );

  var negativeBoundary = -this.sceneVars.sceneSize/2, positiveBoundary = this.sceneVars.sceneSize/2;

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

        realFaces.THREE.controls.enabled = true;

        blocker.style.display = 'none';

      } else {

        if(!realFaces.webrtc.webcam){
          document.getElementById('webcamWarning').style.visibility = 'visible';
        }else{
          document.getElementById('webcamWarning').style.visibility = 'hidden';
        }

        realFaces.THREE.controls.enabled = false;

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
  //POINTER LOCK
}
