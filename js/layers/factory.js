const factoryCostScaling = [new OmegaNum(1.2),new OmegaNum(1.5)]
const factoryBaseCost = [new OmegaNum(10),new OmegaNum(150)]
const factoryUnlocked = [
  ()=>{return true},
  ()=>{return player.factory[0].a.gte(15)},
]
const factoryUnlockedText = [
  "if you see this there's a bug",
  "Factory II - Unlock at <span class='factoryText'>15</span> x Factory I"
]
const showFactory = [
  ()=>{return true},
  ()=>{return true}
]
const factoryAmount = 2

function createFactoryHTML(x){
  let ele = document.createElement("tr")
  let space = "&nbsp".repeat(3)
  space+="/"+space
  ele.innerHTML=`<div id='factory${x}'><span id='factoryAmount${x}' class='factoryText'></span> x Factory ${romanNumeral(x)}${space}Rank <span id='factoryRank${x}'></span><br>+<span id='factoryTotalProduction${x}' class='factoryText'></span> point(s) [+<span id='factoryProduction${x}'></span> point(s)]<br><span id='factoryToRank${x}' class='factoryText'></span>% to ranking up<br><button onclick='handleFactoryButtonClick(${x})' class='factory' id='factoryButton${x}'><span id='factoryCost${x}'></span></button></div><span id='factoryNotUnlocked${x}' style='display:none'>${factoryUnlockedText[x]}</span><br>`
  document.getElementById("factories").appendChild(ele)
}

function factoryCost(x){
  return factoryCostScaling[x].pow(player.factory[x].a).times(factoryBaseCost[x])
}

function factoryProduction(x){
  let a = player.factory[x].a
  let r = player.factory[x].r
  switch(x){
    case 0:
      return r.add(1)
      break;
    case 1:
      return player.factory[0].p.sqrt().add(1).times(r.div(2).add(1).pow(r.div(2).add(1)))
      break;
  }
}

function factoryTotalProduction(x){
  return factoryProduction(x).times(player.factory[x].a)
}

function handleFactoryButtonClick(x){
  if(canRankUp(x))rankUp(x)
  else buyFactory(x)
}

function buyFactory(x){
  if(player.points.gte(player.factory[x].c)){
    player.points=player.points.minus(player.factory[x].c)
    player.factory[x].a=player.factory[x].a.plus(1)
    updateFactory()
  }
}

function updateFactory(textOnly=false,css=false){
  for(let x=0;x<factoryAmount;x++){
    if(css){
      let cr = canRankUp(x)
      document.getElementById(`factoryButton${x}`).className=`factory ${cr?"rankup":(player.points.gte(player.factory[x].c)?"bought":"notbought")}`
      document.getElementById(`factory${x}`).style.display = player.factory[x].s&&player.factory[x].u?"":"none"
      document.getElementById(`factoryNotUnlocked${x}`).style.display = player.factory[x].s&&player.factory[x].u?"none":""
      continue;
    }
    if(!textOnly){
      player.factory[x].c = factoryCost(x)
      player.factory[x].p = factoryTotalProduction(x)
      player.factory[x].u = player.factory[x].u||factoryUnlocked[x]()
      player.factory[x].s = showFactory[x]()
    }
    
    document.getElementById(`factoryTotalProduction${x}`).innerText=format(player.factory[x].p)
    document.getElementById(`factoryProduction${x}`).innerText=format(factoryProduction(x))
    document.getElementById(`factoryCost${x}`).innerText=canRankUp(x)?"RANK UP":format(player.factory[x].c)+" points"
    document.getElementById(`factoryAmount${x}`).innerText=format(player.factory[x].a,0)
    document.getElementById(`factoryToRank${x}`).innerText=format(toRankUp(x),0)
    document.getElementById(`factoryRank${x}`).innerText=romanNumeral(Math.round(player.factory[x].r.toNumber()))
  }
}

function loadFactory(){
  for(let x=0;x<factoryAmount;x++)createFactoryHTML(x)
  updateFactory()
}