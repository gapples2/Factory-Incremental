const D = x=>new OmegaNum(x)
let devSpeed = 1
let player = {
  //main
  points:D(10),
  pps:D(0),
  factory:[{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false}],
  
  //tech
  tech:[0,0],
  
  //misc
  time: Date.now(),
  saveInterval: 0,
  tab: "factories",
  unlocks:{
    tech:false
  }
}

function loop(){
  let diff = (Date.now()-player.time)/1000*devSpeed
  player.time=Date.now()
  
  player.pps = player.factory[0].p.add(player.factory[1].p).add(player.factory[2].p)
  player.points=player.points.add(player.pps.times(diff))
  document.getElementById("points").innerText=format(player.points)
  document.getElementById("pps").innerText=format(player.pps)
  
  player.saveInterval+=diff
  if(player.saveInterval>=10){
    player.saveInterval=0
    save()
  }
  
  updateFactory(false,true)
  updateTech(false,true)
  
  requestAnimationFrame(loop)
}

function changeTab(x){
  document.getElementById(player.tab).style.display="none"
  document.getElementById(x).style.display=""
  player.tab=x
}

function loadLayers(){
  loadFactory()
  loadTech()
}

function loadGame(){
  load()
  loadLayers()
  changeTab(player.tab)
  player.saveInterval=0
  requestAnimationFrame(loop)
}