var webrtc;
var yourID;

var updateCubeWithVideo = function(divID, clientID){
  console.log("updated cube videoid: "+clientID);
  var video = document.getElementById(divID);
   // var position =  {
   //    xPosition: 0,
   //    yPosition: 25.1,
   //    zPosition: 0,
   //    xRotation: 0,
   //    yRotation: 0,
   //    zRotation: 0
   //  };
  var debugCube = false;

  var videoTexture = new THREE.VideoTexture( video );
  videoTexture.generateMipmaps = false;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

 var materialArray = [];
  scene = scene || window.scene;
  var plainMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey') } );
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  if(debugCube){
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/smiley.png' ) }));
  }else{
    materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
  }
  var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);

  var cube  = scene.getObjectByName('player-'+clientID);
  cube.material = MovingCubeMat;
  cube.material.needsUpdate = true;
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
      peer.socketID = data.payload;
      console.log('data object from channel message');
      console.log(data);
      updateCubeWithVideo(peer.id+'_video_incoming', data.payload);
      //add clientID to DOM video node
      document.getElementById(peer.id+'_video_incoming').setAttribute("id", data.payload);
    }
  });

  webrtc.on('videoAdded', function(video,peer){
    videoAdd(video, peer, yourID);
  });

  webrtc.on('readyToCall', function () {
    //variable that allows pointer lock
    webrtc.webcam = true;
    // you can name it anything
    webrtc.joinRoom('realTalkClient');
  });

  // webrtc.on('debug-consolelog', function (obj) {
  //   console.log('debug console log from server');
  //   console.log(obj);
  // });
  setInterval(function(){
    console.log('updating sound')
    webrtc.setVolumeForAll(0);
  },1000);
};

// // set volume on video tag for all peers takse a value between 0 and 1
// SimpleWebRTC.prototype.setVolumeForAll = function (volume) {
//     this.webrtc.peers.forEach(function (peer) {
//         if (peer.videoEl) peer.videoEl.volume = volume;
//     });
// };

playerEvents.addListener('start_webRTC', initWebRTC);
