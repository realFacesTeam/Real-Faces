var makeRandomString = function(){
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var setPrivateURL = function(id, base){

  var element = document.getElementById(id);

  element.href = base + makeRandomString();

}

setPrivateURL('UnionSquarePrivate', 'UnionSquare-');
setPrivateURL('OutdoorsPrivate', 'Outdoors-');
setPrivateURL('ArtGalleryPrivate', 'ArtGallery-');
