// var getAudioSourceFromVideo = function(video){

//   var context = new (window.AudioContext || window.webkitAudioContext);
//   var gainNode = context.createGain();
//   // gainNode.gain.value = 1;                   // Change Gain Value to test
//   filter = context.createBiquadFilter();
//   // filter.type = 2;                          // Change Filter type to test
//   // filter.frequency.value = 5040;            // Change frequency to test

//   // Wait for window.onload to fire. See crbug.com/112368
//   //window.addEventListener('load', function(e) {
//     // Our <video> element will be the audio source.
//     var source = context.createMediaElementSource(video);
//     source.connect(gainNode);
//     gainNode.connect(filter);
//     filter.connect(context.destination);

//     return source;

//   //}, false);

// }
THREE.Audio.prototype.loadBlob = function ( file ) {

  file = file.slice(5);

  var scope = this;

  var request = new XMLHttpRequest();
  request.open( 'GET', file, true );
  request.responseType = 'blob';
  request.onload = function ( e ) {

    scope.context.decodeAudioData( this.response, function ( buffer ) {

      scope.source.buffer = buffer;
      scope.source.connect( scope.panner );
      scope.source.start( 0 );

    } );

  };
  request.send();

  return this;

};
