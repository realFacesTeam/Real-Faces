// var speaking = false;
// //This overwrite contains confusing variable names as we do not wish to alter the library
// //but this allows positional sound
// //volume 1 means that the user is not speaking
// //volume 0.25 means the user is speaking
// //volume 0 is used to denote no change
SimpleWebRTC.prototype.setVolumeForAll = function (harkVolume, dontChangeHarkVolume) {
      // var volume;
      // //console.log('setting volume', harkVolume, dontChangeHarkVolume);

      // // Strange semantics due to SimpleWebRTC workaround
      // // SimpleWebRTC lowers volume of others when user is talking
      // if (!dontChangeHarkVolume){
      //   if (harkVolume === 1){
      //     this.speaking = false;
      //     volume = 1;
      //   }else if(harkVolume === 0.25){
      //     this.speaking = true;
      //     volume = 0.25;
      //   }
      // }else if (this.speaking === false){
      //   volume = 1;
      // }else if (this.speaking === true){
      //   volume = 0.25;
      // }

      var peers = realFaces.webrtc.webrtc.webrtc.peers;

      peers.forEach(function (peer) {
          if (peer.socketID){
            var vdm = volumeDistanceModifier(peer.socketID);
            console.log(vdm)
            //console.log('vdm', vdm, volume)
            if (vdm === 'does not exist'){
              delete peers[peer];
            }else{
              var harkVolume = harkVolume || 1;
              peer.videoEl.volume = harkVolume * vdm * vdm;
            }
         }
      });
  };
