const D = x=>new OmegaNum(x)
let devSpeed = 1
const version = "0.1"
function getStartPlayer(){
  return{
    //main
    points:D(10),
    pps:D(0),
    factory:[{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false}],

    //tech
    tech:[0,0,0,0,0,0,0,0,0,0],
    unlockedTech: [true,false,false,false,false,false,false,false,false,false],

    //misc
    time: Date.now(),
    saveInterval: 0,
    tab: "factories",
    unlocks:{
      tech:false,
      auto:false,
    },
    autobuyTime:0,
    autobuyers:{
      factory:[true,true,true,true,true,true]
    },
    version,
    won:false,
    continue:false
  }
}
let player = getStartPlayer()

function fixStuff(){
  if((typeof player.autobuyTime) != "number")player.autobuyTime=0
  if(player.version!=version){
    player.won=false
    player.continue=false
    player.version=version
  }
}

function loop(){
  fixStuff()
  
  let diff = (Date.now()-player.time)/1000*devSpeed*(player.won&&!player.continue?0:1)
  player.time=Date.now()
  
  player.pps=D(0)
  for(let x=0;x<factoryAmount;x++)player.pps=player.pps.add(player.factory[x].p)
  player.points=player.points.add(player.pps.times(diff))
  document.getElementById("points").innerText=format(player.points)
  document.getElementById("pps").innerText=format(player.pps)
  
  player.saveInterval+=diff
  if(player.saveInterval>=10){
    player.saveInterval=0
    save()
  }
  
  player.autobuyTime+=diff
  if(player.autobuyTime>=0.05){
    autobuy()
    player.autobuyTime=0
  }
  
  updateFactory(false,true)
  updateTech(false,true)
  
  if(!player.won&&player.points.gte(1e30))player.won=true
  document.getElementById("game").style.display=player.won&&!player.continue?"none":""
  document.getElementById("end").style.display=player.won&&!player.continue?"":"none"
  
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