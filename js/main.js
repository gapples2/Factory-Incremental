const D = x=>new OmegaNum(x)
let player = {
  //main
  points:D(10),
  factory:[{a:D(0),c:D(0),p:D(0),r:D(0)}],
  
  //misc
  time: Date.now(),
  saveInterval: 0,
}

function loop(){
  let diff = (Date.now()-player.time)/1000
  player.time=Date.now()
  
  player.points=player.points.add(player.factory[0].p.times(diff))
  document.getElementById("points").innerText=format(player.points)
  
  player.saveInterval+=diff
  if(player.saveInterval>=10){
    player.saveInterval=0
    save()
  }
  
  requestAnimationFrame(loop)
}

function loadLayers(){
  loadFactory()
}

function loadGame(){
  load()
  loadLayers()
  player.saveInterval=0
  requestAnimationFrame(loop)
}