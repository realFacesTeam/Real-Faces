/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

  var scope = this;

  camera.rotation.set( 0, 0, 0 );

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 12;
  yawObject.add( pitchObject );


  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;

  var isOnObject = false;
  var canJump = false;

  var prevTime = performance.now();

  var velocity = new THREE.Vector3();

  var PI_2 = Math.PI / 2;

  var getTranslation = function(){
    var position = {
      x: yawObject.position.x,
      y: yawObject.position.y,
      z: yawObject.position.z,
    }
    var rotation = {
      x: pitchObject.rotation.x,
      y: yawObject.rotation.y
    }

    //console.log('yaw/pitch objs',yawObject, pitchObject)

    return {position:position, rotation:rotation};
  };

  var rotated = false;
  var onMouseMove = function ( event ) {

    if ( scope.enabled === false ) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    if (Math.abs(movementX) > 0.04 || Math.abs(movementY) > 0.04){

      rotated = true;

      yawObject.rotation.y -= movementX * 0.002;
      pitchObject.rotation.x -= movementY * 0.002;

      pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

    }

  };

  var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = detectCollision("forward") ? false: true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = detectCollision("left") ? false: true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = detectCollision("backward") ? false: true;
        break;

      case 39: // right
      case 68: // d
        moveRight = detectCollision("right") ? false: true;
        break;

      case 32: // space
        if ( canJump === true ) velocity.y += 180;
        canJump = false;
        break;

    }

  };

  var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  this.enabled = false;

  this.getObject = function () {

    return yawObject;

  };

  this.isOnObject = function ( boolean ) {

    isOnObject = boolean;
    canJump = boolean;

  };



  //I believe this gets direction of other object relative to the camera
  this.getDirection = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3( 0, 0, -1 );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

    return function( v ) {

      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

      v.copy( direction ).applyEuler( rotation );

      return v;

    }

  }();



  this.update = function () {

    var jumped = false;


    if ( scope.enabled === false ) return;

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;


    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    //make sure character position is within boundary, reset it to outer edge if it is not
    if ( yawObject.position.z > positiveBoundary){
      yawObject.position.z  = positiveBoundary;
    } else if (yawObject.position.z < negativeBoundary ){
      yawObject.position.z  = negativeBoundary;
    } else if ( yawObject.position.x > positiveBoundary){
      yawObject.position.x  = positiveBoundary;
    } else if (yawObject.position.x < negativeBoundary ){
      yawObject.position.x  = negativeBoundary;
    }

    //default is 400
    var speed = 300.0;
    //add velocity to your character if key is pressed
    if ( moveForward ) velocity.z -= speed * delta;
    if ( moveBackward ) velocity.z += speed * delta;

    if ( moveLeft ) velocity.x -= speed * delta;
    if ( moveRight ) velocity.x += speed * delta;


    // Min velocity is enables to prevent insignificant movements from being broadcast
    // Max velocity is a work around for the after pause teleport bug in PointerLock vendor code
    if (Math.abs(velocity.x) < 0.001  || Math.abs(velocity.x) > 100 || Math.abs(velocity.x * delta) > 100) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.001  || Math.abs(velocity.y) > 500 || Math.abs(velocity.y * delta) > 500) velocity.y = 0;
    if (Math.abs(velocity.z) < 0.001  || Math.abs(velocity.z) > 100 || Math.abs(velocity.z * delta) > 100) velocity.z = 0;

    if ( isOnObject === true ) {

      velocity.y = Math.max( 0, velocity.y );

    }

    yawObject.translateX( velocity.x * delta );
    yawObject.translateY( velocity.y * delta );
    yawObject.translateZ( velocity.z * delta );

    if ( yawObject.position.y < 12 ) {

      velocity.y = 0;
      yawObject.position.y = 12;

      if (!canJump)
        jumped = true;

      canJump = true;

    }

    prevTime = time;

    if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0 || rotated || jumped){

      var translation = getTranslation();
      playerEvents.emitEvent('player_movement', [translation]);
      //socket.emit('movement', velocity);
      rotated = false;
    }



  };


};
