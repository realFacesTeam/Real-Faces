var speaking = false;
//This overwrite contains confusing variable names as we do not wish to alter the library
//but this allows positional sound
//volume 1 means that the user is not speaking
//volume 0.25 means the user is speaking
//volume 0 is used to denote no change
SimpleWebRTC.prototype.setVolumeForAll = function (harkVolume) {
    var volume;
    if (harkVolume === 1){
      speaking = false;
      volume = 1;

    }else if(harkVolume === 0.25){
      speaking = true;
      volume = 0.25;
    }else if (speaking === false){
      volume = 1;
    }else if (speaking === true){
      volume = 0.25;
    }

    this.webrtc.peers.forEach(function (peer) {
        if (peer.videoEl){
          var vdm = volumeDistanceModifier(peer.socketID);
          console.log('vdm', vdm);
          console.log(peer);
          peer.videoEl.volume = volume * vdm * vdm;
       }
    });
};

