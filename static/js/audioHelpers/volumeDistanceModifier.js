var volumeDistanceModifier = function(clientID){
  var min = 20;
  var max = 100;
  console.log(lastRecordedPlayerTranslations)
  console.log(clientID)
  var otherTranslation = lastRecordedPlayerTranslations[clientID];

  var ox = otherTranslation.position.x;
  var yourx = yourPlayerTranslation.position.x;

  var xDistance = Math.abs(otherTranslation.position.x - yourPlayerTranslation.position.x);
  var yDistance = Math.abs(otherTranslation.position.y - yourPlayerTranslation.position.y);

  var totalDistance = Math.sqrt((xDistance * xDistance)+(yDistance * yDistance));

  if (totalDistance < min)
    return 1;

  if (totalDistance > max)
    return 0;

  return ((max-min)-(totalDistance - min))/max;

};


