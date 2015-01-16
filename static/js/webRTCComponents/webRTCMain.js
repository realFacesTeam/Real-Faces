var realFaces = {

 updateCubeWithVideo : function(divID, clientID){
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

    var cube  = realFaces.THREE.scene.getObjectByName('player-'+clientID);
    cube.material = MovingCubeMat;
    cube.material.needsUpdate = true;
  },

  videoAdd : function (video,peer,clientID){
    // Now, open the dataChannel
    var dc = peer.getDataChannel('realTalkClient');
    // Now send my name to all the peers
    // Add a small timeout so dataChannel has time to be ready
    setTimeout(function(){
      realFaces.webrtc.sendDirectlyToAll('realTalkClient','setClientID', clientID);
    }, 3000);
  },

  //ongetclientID
  initWebRTC : function(clientID){
    //console.log('initializing webrtc in rtcMain.js');
    //store clientID
    realFaces.yourID = clientID;
    //ask for username
    realFaces.username = prompt("Please enter your name", "Anonymous");

    //create webRTC obj from library
    realFaces.webrtc = new SimpleWebRTC({
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
    realFaces.webrtc.on('channelMessage', function (peer, label, data) {
      if (data.type === 'setClientID') {
        peer.socketID = data.payload;
        //console.log('data object from channel message');
        //console.log(data);
        realFaces.updateCubeWithVideo(peer.id+'_video_incoming', data.payload);
        //add clientID to DOM video node
        document.getElementById(peer.id+'_video_incoming').setAttribute("id", data.payload);
      } else if (data.type === 'chatMessage'){
        playerEvents.emit('addChatMessage', peer.id, data.payload.message, data.payload.username);
      }
    });

    realFaces.webrtc.on('videoAdded', function(video,peer){
      realFaces.videoAdd(video, peer, realFaces.yourID);
    });

    realFaces.webrtc.on('readyToCall', function () {
      //variable that allows pointer lock
      this.webcam = true;
      // you can name it anything
      this.joinRoom('realTalkClient');
    });

    setInterval(function(){
      realFaces.webrtc.setVolumeForAll(0);
    },1000);
  }

};


// // set volume on video tag for all peers takse a value between 0 and 1
// SimpleWebRTC.prototype.setVolumeForAll = function (volume) {
//     this.webrtc.peers.forEach(function (peer) {
//         if (peer.videoEl) peer.videoEl.volume = volume;
//     });
// };
  

playerEvents.addListener('start_webRTC', realFaces.initWebRTC);

