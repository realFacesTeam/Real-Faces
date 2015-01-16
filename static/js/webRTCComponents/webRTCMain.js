var RealWebRTC =  function (clientID) {

  //create webRTC obj from library
  this.webrtc = new SimpleWebRTC({
    // the signalmaster URL to implement handshakes
    url: '/signalmaster',
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remotesVideos',
    // immediately ask for camera access
    autoRequestMedia: true
  });

  //store clientID
  this.yourID = clientID;


  ////////////////////////////
  //create webRTC listeners//
  ///////////////////////////

  //listen for other clients joining webRTC room, render their video
  this.webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type === 'setClientID') {
      peer.socketID = data.payload;
      updateCubeWithVideo(peer.id+'_video_incoming', data.payload);
      //add clientID to DOM video node
      document.getElementById(peer.id+'_video_incoming').setAttribute("id", data.payload);
    } else if (data.type === 'chatMessage'){
      playerEvents.emit('addChatMessage', peer.id, data.payload.message, data.payload.username);
    }
  });

  this.webrtc.on('videoAdded', function(video,peer){
    videoAdd(video, peer, realFaces.webrtc.yourID);
  });

  this.webrtc.on('readyToCall', function () {
    //ask for username
    this.username = prompt("Please enter your name", "Anonymous");
    //variable that allows pointer lock
    this.webcam = true;
    // you can name it anything
    this.joinRoom('realTalkClient');
  });

  // //OVERWRITES VANILLA LIBRARY METHOD
  // // set volume on video tag for all peers takse a value between 0 and 1
  // SimpleWebRTC.prototype.setVolumeForAll = function (volume) {
  //   this.webrtc.peers.forEach(function (peer) {
  //     if (peer.videoEl) {
  //       peer.videoEl.volume = volume;
  //     }
  //   });
  // };
  
  //set volume for all peers to 0
  setInterval(function(){
    realFaces.webrtc.webrtc.setVolumeForAll(0);
  },1000);
};

var updateCubeWithVideo = function (divID, clientID) {
  var video = document.getElementById(divID);

  var videoTexture = new THREE.VideoTexture( video );
  videoTexture.generateMipmaps = false;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  var materialArray = [];
  realFaces.THREE.scene = realFaces.THREE.scene || window.scene;
  var plainMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color('grey') } );
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(plainMaterial);
  materialArray.push(new THREE.MeshBasicMaterial( { map: videoTexture }));
  var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);

  var cube = realFaces.THREE.scene.getObjectByName('player-'+clientID);
  cube.material = MovingCubeMat;
  cube.material.needsUpdate = true;
};


var videoAdd = function (video, peer, clientID) {
  // Now, open the dataChannel
  var dc = peer.getDataChannel('realTalkClient');
  // Now send my name to all the peers
  // Add a small timeout so dataChannel has time to be ready
  setTimeout(function(){
    realFaces.webrtc.webrtc.webrtc.sendDirectlyToAll('realTalkClient','setClientID', realFaces.socket.socketio.yourID);
  }, 3000);
};



=======
var webrtc;
var yourID;
var username;

var updateCubeWithVideo = function(divID, clientID, isOwn){
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

var addChatMessage = function(peerID, message){
  console.log('got chat message from: '+peerID+' with message '+message);
}

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
  //console.log('initializing webrtc in rtcMain.js');
  //store clientID
  yourID = clientID;
  //ask for username
  username = prompt("Please enter your name", "Anonymous");

>>>>>>> b0c6c98f44fbf720111ca5fe12d06195d4e6319e