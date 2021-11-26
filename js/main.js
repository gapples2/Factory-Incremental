const D = x=>new OmegaNum(x)
const music = new Audio("https://cdn.glitch.me/87d6c344-7463-4a06-bb43-299659b0719b%2Ffactoryincrementalmusic.wav?v=1637240763238")
music.loop=true
music.volume=0.3
let devSpeed = 1
const version = "0.2.0a"
let justLoaded = true
function getStartPlayer(){
  return{
    //main
    points:D(10),
    pps:D(0),
    factory:[{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false},{a:D(0),c:D(0),p:D(0),r:D(0),s:false,u:false}],
    factoryBuyMax:false,
    factoryToggleAllAutobuyers:true,

    //tech
    tech:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    unlockedTech: [true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    
    //scrap collector
    scraps:D(0),
    scrapGain:D(0),
    scrapEffect:D(0),
    money:D(0),
    moneyEffect:D(0),
    
    conversionType:true,
    conversionCurrency:true,
    conversionAmount:D(0),
    conversionAll:true,
    
    scrapsMilestones: 0,
    moneyMilestones: 0,

    //misc
    time: Date.now(),
    saveInterval: 0,
    tab: "main",
    unlocks:{
      tech:false,
      auto:false,
      scraps:false
    },
    autobuyTime:0,
    autobuyers:{
      factory:[true,true,true,true,true,true]
    },
    version,
    won:false,
    continue:false,
    goal:0,
    tabDisplay:0,
    stackedTabs:[]
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

function pointGain(){
  let pps=D(0)
  for(let x=0;x<factoryAmount;x++)pps=pps.add(player.factory[x].p)
  pps=pps.times(player.scrapEffect)
  pps=pps.times(techData[10].effect())
  return pps
}

function loop(){
  fixStuff()
  
  let diff = (Date.now()-player.time)/1000*devSpeed*(player.won&&!player.continue?0:1)
  player.time=Date.now()
  
  player.pps=pointGain()
  
  player.points=player.points.add(player.pps.times(diff))
  document.getElementById("points").innerText=player.won?"1e1,000":format(player.points)
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
  
  if(player.tabDisplay==0&&player.tab=="main"||player.tabDisplay==1&&player.stackedTabs.includes("main")||player.tabDisplay==2||justLoaded)updateFactory(false,true)
  if(player.tabDisplay==0&&player.tab=="techdiv"||player.tabDisplay==1&&player.stackedTabs.includes("techdiv")||player.tabDisplay==2||justLoaded)updateTech(false,true)
  if(player.tabDisplay==0&&player.tab=="scrapdiv"||player.tabDisplay==1&&player.stackedTabs.includes("scrapdiv")||player.tabDisplay==2||justLoaded)updateScraps(false,true)
  
  if(!player.won&&player.points.gte(1e40))player.won=true
  document.getElementById("game").style.display=player.won&&!player.continue?"none":""
  document.getElementById("end").style.display=player.won&&!player.continue?"":"none"
  
  checkForGoals()
  
  justLoaded=false
}

function loadLayers(){
  document.getElementById("goal").innerText=goalData[player.goal]?.desc||"There isn't anything more to unlock."
  loadTabs()
  loadFactory()
  loadTech()
  loadScraps()
}

function loadGame(){
  load()
  loadLayers()
  if(player.tab=="techtab"||player.tab=="factories")player.tab="main"
  if(player.tabDisplay==0)changeTab(player.tab)
  if(player.tabDisplay==1){
    player.stackedTabs.forEach(x=>changeStackedTab(x))
  }
  player.saveInterval=0
  setInterval(loop,50)
  document.addEventListener("keydown",(key)=>{
    let keynum = Number(key.key)
    if(!isNaN(keynum)){
      if(player.factory[keynum-1]?.u&&document.activeElement.nodeName!="INPUT")handleFactoryButtonClick(keynum-1)
    }
  })
}
