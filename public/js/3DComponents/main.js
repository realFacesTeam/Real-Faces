// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var video, videoImage, videoImageContext, videoTexture;

// // SCENE
// var scene = new THREE.Scene();

var movingCube;

var clientID;

var collidableMeshList = [];

// SCENEinit
scene = new THREE.Scene();

// FUNCTIONS
var init = function(cID)
{
  clientID = cID;
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400);
  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,250,0);
  scene.add(light);
  // FLOOR
  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 10, 10 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  // WALL
  var wallGeometry;
  var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
  var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );
    //west wall
    wallGeometry = new THREE.CubeGeometry( 10, 100, 1000, 1, 1, 1 );
    var wallWest = new THREE.Mesh(wallGeometry, wireMaterial);
    wallWest.position.set(-500, 50, 0);
    scene.add(wallWest);
    collidableMeshList.push(wallWest);
    //east wall
    wallGeometry = new THREE.CubeGeometry(10, 100, 1000, 1, 1, 1 );
    var wallEast = new THREE.Mesh(wallGeometry, wireMaterial);
    wallEast.position.set(500, 50, 0);
    scene.add(wallEast);
    collidableMeshList.push(wallEast);    
    //north wall
    wallGeometry = new THREE.CubeGeometry(1000, 100, 10, 1, 1, 1 );
    var wallNorth = new THREE.Mesh(wallGeometry, wireMaterial);
    wallNorth.position.set(0, 50, -500);
    scene.add(wallNorth);
    collidableMeshList.push(wallNorth);    
    //south wall
    var wallSouth = new THREE.Mesh(wallGeometry, wireMaterial);
    wallGeometry = new THREE.CubeGeometry(1000, 100, 10, 1, 1, 1 );
    wallSouth.position.set(0, 50, 500);
    scene.add(wallSouth);
    collidableMeshList.push(wallSouth);

  // SKYBOX/FOG
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
  scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

  ///////////
  // VIDEO //
  ///////////

  video = document.getElementById( 'monitor' );

  videoImage = document.getElementById( 'videoImage' );
  videoImageContext = videoImage.getContext( '2d' );
  // background color if no video present
  videoImageContext.fillStyle = '#000000';
  videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

  videoTexture = new THREE.Texture( videoImage );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
  // the geometry on which the movie will be displayed;
  //    movie image will be scaled to fit these dimensions.
  var movieGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
  var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.position.set(0,50,0);
  //scene.add(movieScreen);

  camera.position.set(0,150,300);
  camera.lookAt(movieScreen.position);

  //execute webRTC callback
  initWebRTC();
}

  function animate()
{
  requestAnimationFrame( animate );
  render();
  update();
}

function detectCollision(ownCube, moveDirection, globalDirection) 
{
  //collision distance
  var distance = 30;
  //detect local coordinate system vector
  var matrix = new THREE.Matrix4();
  matrix.extractRotation( ownCube.matrix );
  //generate local vector from direction cube is sliding
  //get a vector3 of where cube is facing globally
  if(moveDirection === 0){
    var direction = new THREE.Vector3( 0, 0, -1 );
  }else if(moveDirection === 2){
    var direction = new THREE.Vector3( -1, 0, 0 );
  }else if(moveDirection === 4){
    var direction = new THREE.Vector3( 0, 0, 1 );
  }else if(moveDirection === 6){
    var direction = new THREE.Vector3( 1, 0, 0 );
  }
  //if we need local to global conversion, convert
  if(!globalDirection){
    direction = direction.applyProjection(matrix);
  }
  //create raycaster and link it in cube's direction
  var caster = new THREE.Raycaster(), collisions;
  caster.set(ownCube.position, direction);
  //get objects cube can run into
  collisions = caster.intersectObjects(collidableMeshList);
  //if possible collision is within distance, return true
  if (collisions.length > 0 && collisions[0].distance <= distance) {
    return true;
  }else{
    return false;
  }
}

function update()
{
  ownCube = scene.getObjectByName("videoCube" + clientID);

  if ( keyboard.pressed("p") ) // pause
    video.pause();
  if ( keyboard.pressed("r") ) // resume
    video.play();

  var delta = clock.getDelta(); // seconds.
  var moveDistance = 200 * delta; // 200 pixels per second
  var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

  // local coordinates

  // local transformations

  // move forwards/backwards/left/right
  if ( keyboard.pressed("W") && !detectCollision(ownCube, 0)){
    ownCube.translateZ( -moveDistance );
    sendPositionToServer({
      type: 'relativeTranslate',
      axis: 'z',
      offset: -moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("S") && !detectCollision(ownCube, 4)){
    ownCube.translateZ(  moveDistance );
    sendPositionToServer({
      type: 'relativeTranslate',
      axis: 'z',
      offset: moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("Q") && !detectCollision(ownCube, 2)){
    ownCube.translateX( -moveDistance );
    sendPositionToServer({
      type: 'relativeTranslate',
      axis: 'x',
      offset: -moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("E") && !detectCollision(ownCube, 6)){
    ownCube.translateX(  moveDistance );
    sendPositionToServer({
      type: 'relativeTranslate',
      axis: 'x',
      offset: moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }


  // rotate left/right/up/down
  var rotation_matrix = new THREE.Matrix4().identity();
  if ( keyboard.pressed("A") ){
    ownCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    sendPositionToServer({
      type: 'rotate',
      axes: [0,1,0],
      angle: rotateAngle, 
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
      },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("D") ){
    ownCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
    sendPositionToServer({
      type: 'rotate',
      axes: [0,1,0],
      angle: -rotateAngle, 
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
      },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("R") ){
    ownCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
    sendPositionToServer({
      type: 'rotate',
      axes: [1,0,0],
      angle: rotateAngle, 
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
      },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("F") ){
    ownCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
    sendPositionToServer({
      type: 'rotate',
      axes: [1,0,0],
      angle: -rotateAngle, 
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
      },
      clientID: clientID
    });
  }

  // global coordinates
  if ( keyboard.pressed("left") && !detectCollision(ownCube, 2, true)){
    ownCube.position.x -= moveDistance;
    sendPositionToServer({
      type: 'absoluteTranslate',
      axis: 'x',
      offset: -moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }

  if ( keyboard.pressed("right") && !detectCollision(ownCube, 6, true)){
    ownCube.position.x += moveDistance;
    sendPositionToServer({
      type: 'absoluteTranslate',
      axis: 'x',
      offset: moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("up") && !detectCollision(ownCube, 0, true)){
    ownCube.position.z -= moveDistance;
    sendPositionToServer({
      type: 'absoluteTranslate',
      axis: 'z',
      offset: -moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }
  if ( keyboard.pressed("down") && !detectCollision(ownCube, 4, true)){
    ownCube.position.z += moveDistance;
    sendPositionToServer({
      type: 'absoluteTranslate',
      axis: 'z',
      offset: moveDistance,
      globalPosition: {
        xPosition: ownCube.position.x,
        yPosition: ownCube.position.y,
        zPosition: ownCube.position.z,
        xRotation: ownCube.rotation.x,
        yRotation: ownCube.rotation.y,
        zRotation: ownCube.rotation.z
        },
      clientID: clientID
    });
  }

  controls.update();
  stats.update();
}

function render()
{
  if ( video.readyState === video.HAVE_ENOUGH_DATA )
  {
    videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
    if ( videoTexture )
      videoTexture.needsUpdate = true;
  }

  renderer.render( scene, camera );
}
