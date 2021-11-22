function scrapGain(){
  let gain = player.points.div(1e29).log10().floor().max(0)
  return OmegaNum.isNaN(gain)?D(0):gain
}

function scrapNextAt(){
  return D(10).pow(scrapGain().add(1)).times(1e29)
}

function scrapEffect(){
  return player.scraps.add(1).pow(2)
}

function sellScraps(x){
  x=x.min(player.scraps)
  player.money=player.money.add(x)
  player.scraps=player.scraps.minus(x)
}

function buyScraps(x){
  x=x.min(player.money)
  player.money=player.money.minus(x)
  player.scraps=player.scraps.add(x)
}

function moneyEffect(){
  return player.money.add(1).pow(3)
}

function loadScraps(){
  loadMilestones()
  updateScraps()
  for(let x=0;x<5;x++)updateConversion(x)
}

function scrapReset(){
  player.points=D(10)
  player.pps=D(0)
  for(let x=0;x<factoryAmount;x++){
    player.factory[x].a=D(0)
    player.factory[x].c=D(0)
    player.factory[x].p=D(0)
    player.factory[x].r=D(0)
    player.factory[x].u=false
    player.factory[x].s=false
  }
  player.tech.forEach((x,i)=>player.tech[i]=0)
}

function gainScraps(){
  if(player.points.lt(1e30))return;
  player.scraps=player.scraps.add(player.scrapGain)
  scrapReset()
  updateScraps()
  updateTech()
  updateFactory()
  checkForMilestones()
}

function updateScraps(vars=true,css=false){
  if(!player.unlocks.scraps)player.unlocks.scraps=player.points.gte(1e30)
  player.scrapGain=scrapGain()
  player.scrapEffect=scrapEffect()
  player.moneyEffect=moneyEffect()
  if(css){
    document.getElementById(player.tabDisplay==2?"scrapdiv":"scraptabbutton").style.display=player.unlocks.scraps?"":"none"
    document.getElementById("scrapButton").style.className=player.points.gte(1e30)?"bought":"notbought"
    document.getElementById("scrapButton").innerHTML = player.points.gte(1e30)?`You can reset for <span class='scrapText' style='font-size:inherit'>${format(player.scrapGain)}</span> scraps.<br>Next at ${format(scrapNextAt())} points.`:`You can't reset for scraps right now.<br>${format(D(1e30).minus(player.points))} more points until you can do a scrap reset.`
  }
  document.getElementById("scraps").textContent=format(player.scraps)
  document.getElementById("scrapEffect").textContent=format(player.scrapEffect)
  document.getElementById("money").textContent=format(player.money)
  document.getElementById("moneyEffect").textContent=format(player.moneyEffect)
  
  updateMilestones()
}

function updateConversion(x){
  switch(x){
    case 0:
      document.getElementById("convertInput").textContent=format(player.conversionAmount)
      break;
    case 1:
      document.getElementById("conversionType").textContent=player.conversionType?"Absolute":"Percentage"
      break;
    case 2:
      document.getElementById("conversionCurrency").textContent=player.conversionCurrency?"Scraps":"Money"
      break;
    case 3:
      let currency = player.conversionCurrency?"scraps":"money"
      document.getElementById("convertText").textContent=`${player.conversionType?" "+currency:"% of "+currency} into ${player.conversionCurrency?"money":"scraps"}`
      break;
    case 4:
      document.getElementById("conversionAll").textContent=`Convert all ${player.conversionAll?"scraps":"money"} to ${player.conversionAll?"money":"scraps"}`
      break;
  }
}

function handleConversionEvents(x){
  let to;
  let from;
  switch(x){
    case 0:
      let num = D(document.getElementById("convertInput").value)
      if(!OmegaNum.isNaN(num))player.conversionAmount=num
      break;
    case 1:
      player.conversionType=!player.conversionType
      updateConversion(1)
      updateConversion(3)
      break;
    case 2:
      player.conversionCurrency=!player.conversionCurrency
      updateConversion(2)
      updateConversion(3)
      break;
    case 3:
      to = player.conversionCurrency?"money":"scraps"
      from = player.conversionCurrency?"scraps":"money"
      let multi = player.conversionType?1:player.conversionAmount.div(100)
      let amt = player.conversionType?player.conversionAmount.min(player[from]):player[from].times(multi).round()
      player[from]=player[from].minus(amt)
      player[to]=player[to].add(amt)
      checkForMilestones()
      break;
    case 4:
      to = player.conversionAll?"money":"scraps"
      from = player.conversionAll?"scraps":"money"
      player[to]=player[to].add(player[from])
      player[from]=D(0)
      player.conversionAll=!player.conversionAll
      updateConversion(4)
      checkForMilestones()
      break;
  }
}