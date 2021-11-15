const factoryCostScaling = [new OmegaNum(1.2)]
const factoryBaseCost = [new OmegaNum(10)]

function createFactoryHTML(x){
  let ele = document.createElement("div")
  let space = "&nbsp".repeat(2)
  space+="/"+space
  ele.innerHTML=`Factory I: Rank I${space}+<span id='factoryProduction${x}'></span> points/sec${space}<button onclick='buyFactory(${x})'>Buy factory for <span id='factoryCost${x}'></span></button>`
  document.getElementById("factories").appendChild(ele)
}

function factoryCost(x){
  return factoryCostScaling[x].pow(player.factory[x].a).times(factoryBaseCost[x])
}

function buyFactory(x){
  if(player.points.gte(player.factory[x].c)){
    player.points=player.points.minus(player.factory[x].c)
    player.factory[x].a=player.factory[x].a.plus(1)
    updateFactory()
  }
}

function updateFactory(textOnly=false){
  for(let x=0;x<1;x++){
    if(!textOnly){
      player.factory[x].c = factoryCost(x)
      player.factory[x].p = player.factory[x].a
    }
    
    document.getElementById(`factoryProduction${x}`).innerText=format(player.factory[x].p)
    document.getElementById(`factoryCost${x}`).innerText=format(player.factory[x].c)
  }
}

function loadFactory(){
  for(let x=0;x<1;x++)createFactoryHTML(x)
  updateFactory()
}