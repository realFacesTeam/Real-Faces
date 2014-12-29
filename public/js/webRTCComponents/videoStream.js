// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// window.URL = window.URL || window.webkitURL;

// var camvideo = document.getElementById('monitor');

//   if (!navigator.getUserMedia)
//   {
//     document.getElementById('errorMessage').innerHTML =
//       'Sorry. <code>navigator.getUserMedia()</code> is not available.';
//   } else {
//     navigator.getUserMedia({video: true}, gotStream, noStream);
//   }

// function gotStream(stream)
// {
//   if (window.URL)
//   {   camvideo.src = window.URL.createObjectURL(stream);   }
//   else // Opera
//   {   camvideo.src = stream;   }

//   camvideo.onerror = function(e)
//   {   stream.stop();   };

//   stream.onended = noStream;
// }

// function noStream(e)
// {
//   var msg = 'No camera available.';
//   if (e.code == 1)
//   {   msg = 'User denied access to use camera.';   }
//   document.getElementById('errorMessage').textContent = msg;


// }

var webrtc = new SimpleWebRTC({
  // the signalmaster URL to implement handshakes
  url: 'http://localhost:8888/',
  // the id/element dom element that will hold "our" video
  localVideoEl: 'localVideo',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: 'remotesVideos',
  // immediately ask for camera access
  autoRequestMedia: true
});

var renderSelfCube = function(err, roomDescription){
  var position =  {
      xPosition: 0,
      yPosition: 25.1,
      zPosition: 0,
      xRotation: 0,
      yRotation: 0,
      zRotation: 0
    };
  var debugCube = false;
  var videoImage = document.getElementById( 'localVideo' );
  console.log('videoImage======================')
  console.log(videoImage);
  console.log('videoImage======================')

  // videoImageContext = videoImage.getContext( '2d' );
  // // background color if no video present
  // videoImageContext.fillStyle = '#000000';
  // videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

  var videoTexture = new THREE.VideoTexture( videoImage );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  console.log("CREATING SELF CUBE USING CB")


 var materialArray = [];
  scene = scene || window.scene;
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
  if(debugCube){
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));
  }else{
    materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
  }
  var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);

  var cube  = scene.getObjectByName('videoCube'+clientID);
  cube.material = MovingCubeMat;
  cube.material.needsUpdate = true;
}

//ongetclientID
var initWebRTC = function(){
  webrtc.on('readyToCall', function () {
    // you can name it anything
    webrtc.joinRoom('realTalkClient', renderSelfCube);
  });
};
