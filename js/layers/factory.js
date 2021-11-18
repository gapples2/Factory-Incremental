const factoryBuySound = new Audio("https://cdn.glitch.me/87d6c344-7463-4a06-bb43-299659b0719b%2F5810162088017920.wav?v=1637242387777")

const factoryCostScaling = [new OmegaNum(1.2),new OmegaNum(1.5),new OmegaNum(1.7),new OmegaNum(1.9),new OmegaNum(2.1),new OmegaNum(2.3)]
const factoryBaseCost = [new OmegaNum(10),new OmegaNum(150),new OmegaNum(5000),new OmegaNum(1e7),new OmegaNum(1e19),new OmegaNum(1e25)]
const factoryUnlocked = [
  ()=>{return true},
  ()=>{return player.factory[0].a.gte(15)},
  ()=>{return player.factory[1].a.gte(10)},
  ()=>{return player.factory[2].a.gte(15)},
  ()=>{return player.factory[1].a.gte(100)},
  ()=>{return player.factory[4].a.gte(20)}
]
const factoryUnlockedText = [
  "if you see this there's a bug",
  "Factory II - Unlock at <span class='factoryText'>15</span> x Factory I",
  "Factory III - Unlock at <span class='factoryText'>10</span> x Factory II",
  "Factory IV - Unlock at <span class='factoryText'>15</span> x Factory III",
  "Factory V - Unlock at <span class='factoryText'>100</span> x Factory II",
  "Factory VI - Unlock at <span class='factoryText'>20</span> x Factory V"
]
const showFactory = [
  ()=>{return true},
  ()=>{return true},
  ()=>{return player.tech[0]>=1},
  ()=>{return player.tech[0]>=2},
  ()=>{return player.tech[0]>=3},
  ()=>{return player.tech[0]>=4}
]
const factoryAmount = 6

function createFactoryHTML(x){
  let rowNum = Math.floor(x/3)
  let row = document.getElementById(`factoryRow${rowNum}`)
  if(!row){
    row = document.createElement("tr")
    row.id=`factoryRow${rowNum}`
    document.getElementById("factories").appendChild(row)
  }
  let ele = document.createElement("td")
  let space = "&nbsp".repeat(3)
  space+="/"+space
  ele.innerHTML=`<div id='factory${x}'><span id='factoryAmount${x}' class='factoryText'></span> x Factory ${romanNumeral(x)}${space}Rank <span id='factoryRank${x}'></span><br>+<span id='factoryTotalProduction${x}' class='factoryText'></span> point(s)${space}+<span id='factoryProduction${x}' class='factoryText'></span> point(s)/factory<br><span id='factoryToRank${x}' class='factoryText'></span>% to ranking up<br><div style='display:inline-flex;align-items:center'><button onclick='handleFactoryButtonClick(${x})' class='factory' id='factoryButton${x}'><span id='factoryCost${x}'></span></button><span id='factoryAutobuyer${x}'>&nbsp&nbsp<button id='factoryAutobuyerButton${x}' onclick='toggleFactoryAutobuyer(${x})'></button></span></div></div><span id='factoryNotUnlocked${x}' style='display:none'>${factoryUnlockedText[x]}</span>`
  row.appendChild(ele)
  document.getElementById("factoriesUnlockTxt").innerHTML+=`<span id='factoryNotUnlocked${x}' style='display:none'><br>${factoryUnlockedText[x]}</span>`
}

function factoryCost(x){
  return factoryCostScaling[x].pow(player.factory[x].a).times(factoryBaseCost[x])
}

function factoryProduction(x){
  let a = player.factory[x].a
  let r = player.factory[x].r
  switch(x){
    case 0:
      return r.add(1).times(r.add(1).pow(player.tech[3])).times(techData[1].effect()).times(techData[2].effect()).times(techData[7].effect())
      break;
    case 1:
      return player.factory[0].p.sqrt().add(1).times(r.times(techData[8].effect()).add(1).pow(r.times(techData[8].effect()).add(1))).times(player.factory[0].a.div(10).add(1).pow(player.tech[5]))
      break;
    case 2:
      return player.factory[1].p.div(player.factory[1].a.add(1).sqrt()).add(1).times(r.div(2).add(1).pow(r.div(2).add(1))).times(player.factory[0].a.div(100).add(1).pow(player.tech[5]))
      break;
    case 3:
      return player.factory[2].p.div(player.factory[2].a.add(1).sqrt()).add(1).times(r.div(2).add(1).pow(r.div(2).add(1))).times(player.factory[0].a.div(100).add(1).pow(player.tech[5]))
      break;
    case 4:
      return player.factory[3].p.div(player.factory[3].a.add(1).sqrt()).add(1).times(r.div(2).add(1).pow(r.div(2).add(1))).times(player.factory[0].a.div(1000).add(1).pow(player.tech[5]))
      break;
    case 5:
      return player.factory[4].p.div(player.factory[4].a.add(1).sqrt()).add(1).times(r.div(2).add(1).pow(r.div(2).add(1))).times(player.factory[0].a.div(1000).add(1).pow(player.tech[5]))
      break;
  }
}

function factoryTotalProduction(x){
  return factoryProduction(x).times(player.factory[x].a)
}

function handleFactoryButtonClick(x){
  if(canRankUp(x)){rankUp(x)}
  else if(player.factoryBuyMax){buyMaxFactory(x)}
  else buyFactory(x)
}

function buyFactory(x,auto=false){
  if(player.points.gte(player.factory[x].c)){
    player.points=player.points.minus(player.factory[x].c)
    player.factory[x].a=player.factory[x].a.plus(1)
    updateFactory()
  }
}

function buyMaxFactory(x){
  let max = player.points.div(factoryBaseCost[x]).logBase(factoryCostScaling[x]).minus(player.factory[x].a).floor()
  if(OmegaNum.isNaN(max))return;
  max=max.add(player.factory[x].a).min(rankUpCost(x)).minus(player.factory[x].a)
  if(player.points.gte(player.factory[x].c))max=max.add(1)
  if(max.lte(0))return;
  let cost = factoryCostScaling[x].pow(max.add(player.factory[x].a).minus(1)).times(factoryBaseCost[x])
  player.points=player.points.minus(cost)
  player.factory[x].a=player.factory[x].a.add(max)
  updateFactory()
}

function toggleFactoryAutobuyer(x){
  player.autobuyers.factory[x]=!player.autobuyers.factory[x]
  updateFactoryAutobuyer(x)
}

function toggleFactoryBuyMax(){
  player.factoryBuyMax=!player.factoryBuyMax
  updateFactoryBuyMax()
}

function updateFactory(textOnly=false,css=false){
  for(let x=0;x<factoryAmount;x++){
    if(css){
      let cr = canRankUp(x)
      document.getElementById(`factoryButton${x}`).className=`factory ${cr?"rankup":(player.points.gte(player.factory[x].c)?"bought":"notbought")}`
      document.getElementById(`factory${x}`).style.display = player.factory[x].s&&player.factory[x].u?"":"none"
      document.getElementById(`factoryNotUnlocked${x}`).style.display = player.factory[x].s&&!player.factory[x].u?"":"none"
      document.getElementById(`factoryAutobuyer${x}`).style.display = player.tech[6]>=x+1?"":"none"
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

function updateFactoryAutobuyer(x){
  document.getElementById(`factoryAutobuyerButton${x}`).classList = player.autobuyers.factory[x]?"bought":"notbought"
  document.getElementById(`factoryAutobuyerButton${x}`).innerText = player.autobuyers.factory[x]?"ON":"OFF"
}

function updateFactoryBuyMax(){
  document.getElementById(`factoryBuyMax`).classList = player.factoryBuyMax?"bought":"notbought"
  document.getElementById(`factoryBuyMax`).innerText = player.factoryBuyMax?"ON":"OFF"
}

function loadFactory(){
  for(let x=0;x<factoryAmount;x++){createFactoryHTML(x);updateFactoryAutobuyer(x)}
  updateFactory()
  updateFactoryBuyMax()
}