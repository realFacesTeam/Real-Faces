var createSkybox = function(sceneName, size, context){

  var skyBoxDir = sceneName;

  var path = "images/skyBoxes/" + skyBoxDir + "/";
  var format = '.jpg';
  var urls = [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
  ];

  var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
  reflectionCube.format = THREE.RGBFormat;

  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = reflectionCube;

  var material = new THREE.ShaderMaterial( {

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide

  } ),

  skyBox = new THREE.Mesh( new THREE.BoxGeometry( size, size, size ), material );
  skyBox.position.set(0, size * 0.4, 0);
  context.scene.add( skyBox );
}
