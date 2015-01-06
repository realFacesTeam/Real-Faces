//slightly adapted copy of the voxel duckWalk node package

//animates walking players


//var duckWalk = {};

Skin.prototype.render = function(){

  // var walkSpeed = skin.walkSpeed
  // var startedWalking = skin.startedWalking
  // var stoppedWalking = skin.stoppedWalking
  // var walking = skin.walking
  // var acceleration = skin.acceleration

  var time = Date.now() / 1000
  if (this.walking && time < this.startedWalking + this.acceleration){
    this.walkSpeed = (time - this.startedWalking) / this.acceleration
    //console.log('walking', this.walkSpeed)
  }
  if (!this.walking ){
    if (time < this.stoppedWalking + this.acceleration)
      this.walkSpeed = -1 / this.acceleration * (time - this.stoppedWalking) + 1
    else if(this.walkSpeed > 0.02)
      this.walkSpeed *= 0.95;
    //console.log('not walking', this.walkSpeed)

  }

  this.head.rotation.y = Math.sin(time * 1.5) / 3 * this.walkSpeed
  this.head.rotation.z = Math.sin(time) / 2 * this.walkSpeed

  this.rightArm.rotation.z = 2 * Math.cos(0.6662 * time * 10 + Math.PI) * this.walkSpeed
  this.rightArm.rotation.x = 1 * (Math.cos(0.2812 * time * 10) - 1) * this.walkSpeed
  this.leftArm.rotation.z = 2 * Math.cos(0.6662 * time * 10) * this.walkSpeed
  this.leftArm.rotation.x = 1 * (Math.cos(0.2312 * time * 10) + 1) * this.walkSpeed

  this.rightLeg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10) * this.walkSpeed
  this.leftLeg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10 + Math.PI) * this.walkSpeed
}

Skin.prototype.startWalking = function(){
  console.log('startWalking', this)
  var now = Date.now() / 1000
  this.walking = true
  if (this.stoppedWalking + this.acceleration > now){
    var progress = now - this.stoppedWalking;
    this.startedWalking = now - (this.stoppedWalking + this.acceleration - now)
  } else {
    this.startedWalking = Date.now() / 1000
  }
}

Skin.prototype.stopWalking = function() {
  console.log('stopWalking', this)
  var now = Date.now() / 1000
  this.walking = false
  if (this.startedWalking + this.acceleration > now){
    this.stoppedWalking = now - (this.startedWalking + this.acceleration - now)
  } else {
    this.stoppedWalking = Date.now() / 1000
  }
  //this.walkSpeed = 0;
}

Skin.prototype.isWalking = function(){
  return this.walking
}

Skin.prototype.setAcceleration = function(newA){
  this.acceleration = newA
}


