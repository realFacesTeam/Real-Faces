 //(window.AudioContext || window.webkitAudioContext)();
// console.log('audio context created')
//var audioAnalyser = audioContext.createAnalyser();

// var source;
// var gainNode;

// <video autoplay="" src="blob:http%3A//0.0.0.0%3A8081/4108bec8-99b4-4bdc-b5a5-cad33262eeec" id="1828957158998132951_video_incoming"></video>
//                         blob:http%3A//0.0.0.0%3A8081/4108bec8-99b4-4bdc-b5a5-cad33262eeec


var AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();
var gainNode;
// var testCtx = new AudioContext();

// var oscillator = testCtx.createOscillator();
// oscillator.connect(testCtx.destination);
// oscillator.start();

// var peerInput;

//gainNode.gain.value = 1;
