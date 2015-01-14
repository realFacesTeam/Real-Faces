var speaking = false;
//This overwrite contains confusing variable names as we do not wish to alter the library
//but this allows positional sound
//volume 1 means that the user is not speaking
//volume 0.25 means the user is speaking
//volume 0 is used to denote no change
SimpleWebRTC.prototype.setVolumeForAll = function (volume) {
    if (volume === 1){
      speaking = false;
    }else if(volume === 0.25){
      speaking = true;
    }

    this.webrtc.peers.forEach(function (peer) {
        if (peer.videoEl){
          var vdm = volumeDistanceModifier(peer.socketID);
          console.log('vdm', vdm);
          console.log(peer);
          peer.videoEl.volume = volume * vdm;
       }
    });
};

