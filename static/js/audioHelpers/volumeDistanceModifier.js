var volumeDistanceModifier = function(clientID){
  var min = 15;
  var max = 90;
  var otherTranslation = realFaces.socket.lastRecordedPlayerTranslations[clientID];
  if(!otherTranslation){
    return 'does not exist'
  }
  console.log(clientID, realFaces.socket.lastRecordedPlayerTranslations)

  var ox = otherTranslation.position.x;
  var yourx = realFaces.socket.yourPlayerTranslation.position.x;

  var xDistance = Math.abs(otherTranslation.position.x - realFaces.socket.yourPlayerTranslation.position.x);
  var yDistance = Math.abs(otherTranslation.position.y - realFaces.socket.yourPlayerTranslation.position.y);

  var totalDistance = Math.sqrt((xDistance * xDistance)+(yDistance * yDistance));

  if (totalDistance < min)
    return 1;

  if (totalDistance > max)
    return 0;

  //console.log(((max-min)-(totalDistance - min))/max)
  return ((max-min)-(totalDistance - min))/max;

};


