module.exports = function(io){
  //create socket.io client movement namespacing
  var translations = io.of('/translations');

  var clientTranslations = {};

  translations.on('connection', function(client){
    client.on('player_join', function(){
      console.log('Client Connected', client.id);

      clientTranslations[client.id] = {
        position: {x:0, y:15, z:0},
        rotation: {x:0, y:0}
      };

      //tells new clients about pre-existing clients
      client.emit('preexisting_clients', clientTranslations, client.id);

      //tells all pre-existing clients about new client
      client.broadcast.emit('new_client', client.id);

      //sets event listener for new client
      client.on('translate', function(translation){
        client.broadcast.emit('move_other_player', {clientID:client.id, translation:translation});
        clientTranslations[client.id] = translation;
      });

      //sets disconnect listener for new client
      client.on('disconnect', function(){
        console.log('Client Disconnected.', client.id);

        delete clientTranslations[client.id];

        client.broadcast.emit('client_disconnected', client.id);
      });
    });
  });
};
