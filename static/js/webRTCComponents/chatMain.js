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
  //reenable controls
  // controls.enabled = false;
  inChatBox = true;
  $('#chatInput').focus();
}

//send a chat message
function sendChatMessage (message){
  webrtc.sendDirectlyToAll('realTalkClient','chatMessage', {message:message, username:username});
  addChatMessage(null, message, 'You');
};

//receive a chat message from a peer
function addChatMessage (peerID, msgText, msgOwner){
  //construct new chat el
  var chatMessage = $('<div></div>').html(msgOwner+': '+msgText).attr('id','chatMessage');
  //add new chat message to the chatBox
  $('#chatInput').before(chatMessage);
  //attach a timer, after 10 seconds, fade it out slowly, then remove it from the DOM
  setTimeout(function(){
    chatMessage.hide('slow', function(){ chatMessage.remove(); });
  },20000);
}

chatInit();

//check if user is typing every 50ms
  //if they are typing, disable controls
setInterval(function(){  
  controls.enabled = ( $('#chatInput').is( ":focus" ) ) ? false : true;
}, 50);

playerEvents.addListener('start_chat_typing', startChatTyping);
playerEvents.addListener('sendChatMessage', sendChatMessage);
playerEvents.addListener('addChatMessage', addChatMessage);