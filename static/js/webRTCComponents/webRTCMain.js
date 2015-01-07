var webrtc;
var yourID;

var updateCubeWithVideo = function(divID, clientID){
  console.log("updated cube videoid: "+clientID);
  var audioContext = new window.webkitAudioContext();

  console.log(video);
   var position =  {
      xPosition: 0,
      yPosition: 25.1,
      zPosition: 0,
      xRotation: 0,
      yRotation: 0,
      zRotation: 0
    };
  var debugCube = false;

  var videoTexture = new THREE.VideoTexture( video );
  videoTexture.generateMipmaps = false;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

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

  var cube  = scene.getObjectByName('player-'+clientID);
  cube.material = MovingCubeMat;
  cube.material.needsUpdate = true;


  var video = document.getElementById(divID);
  console.log(video);

  var audioSource = context.createMediaElementSource(video);
  var filter = context.createBiquadFilter();
  filter.frequency = 1000;
  var gainNode = context.createGain();
  gainNode.gain.value = 5;

  audioSource.connect(gainNode);
  gainNode.connect(context.destination);

};


function videoAdd(video,peer,clientID){
  // Now, open the dataChannel
  var dc = peer.getDataChannel('realTalkClient');
  // Now send my name to all the peers
  // Add a small timeout so dataChannel has time to be ready
  setTimeout(function(){
    console.log('sent videoAdd clientID: '+clientID);
    webrtc.sendDirectlyToAll('realTalkClient','setClientID', clientID);
  }, 3000);
}

//ongetclientID
var initWebRTC = function(clientID){
  console.log('initializing webrtc in rtcMain.js');
  //store clientID
  yourID = clientID;

  //create webRTC obj from library
  webrtc = new SimpleWebRTC({
    // the signalmaster URL to implement handshakes
    url: '/signalmaster',
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remotesVideos',
    // immediately ask for camera access
    autoRequestMedia: true
  });

  //create webRTC listeners

  //listen for other clients joining webRTC room, render their video
  webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type === 'setClientID') {
      //console.log('data object from channel message');
      //console.log(data);
      updateCubeWithVideo(peer.id+'_video_incoming', data.payload);

      //add clientID to DOM video node
      document.getElementById(peer.id+'_video_incoming').setAttribute("id", data.payload);
    }
  });

  webrtc.on('videoAdded', function(video,peer){
    // video.mute = true
    videoAdd(video, peer, yourID);
    video.controls = true;


    //console.log(video,peer);

    // peerInput = testCtx.createMediaStreamSource(peer.stream);
    // console.log('peerInput', peerInput);

    // var gainNode = testCtx.createGain();

    // peerInput.connect(gainNode);
    // gainNode.gain.value = 1;

    // gainNode.connect(testCtx.destination);


    // video.controls = true;
    // video.muted = 'true';


  });

  webrtc.on('readyToCall', function () {
    //console.log('rtc readyto call');
    // you can name it anything
    webrtc.joinRoom('realTalkClient');
  });

  // webrtc.on('debug-consolelog', function (obj) {
  //   console.log('debug console log from server');
  //   console.log(obj);
  // });

};

// // set volume on video tag for all peers takse a value between 0 and 1
// SimpleWebRTC.prototype.setVolumeForAll = function (volume) {
//     this.webrtc.peers.forEach(function (peer) {
//         if (peer.videoEl) peer.videoEl.volume = volume;
//     });
// };

playerEvents.addListener('start_webRTC', initWebRTC);
