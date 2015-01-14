function chatInit(){
  //on press enter in chat box, send chat message
  $('#chatInput').on("keypress", function(e) {
    if (e.keyCode === 13) {
      parseChatInput();
      return false; // prevent the default behavior from happening
    }
  });

  //or if they click submit button, also send chat message
  $('#chatInputButton').on("click", function(e) {
    parseChatInput();
    return false; // prevent the button click from happening
  });
}
function parseChatInput (){
  //create a copy of chat message
  var message = $('#chatInput').val().slice(0);
  //before we delete it
  $('#chatInput').val("");
  //and then emit event that webRTCMain will use to send data message
  playerEvents.emitEvent('sendChatMessage', [message]);
}

function startChatTyping () {
  //temporarily disabled
  // //reenable controls
  // controls.enabled = false;
  // blocker.style.display = '-webkit-box';
  // blocker.style.display = '-moz-box';
  // blocker.style.display = 'box';
  // instructions.style.display = '';
  // $('#chatInput').focus();
}

chatInit();
playerEvents.addListener('start_chat_typing', startChatTyping);
