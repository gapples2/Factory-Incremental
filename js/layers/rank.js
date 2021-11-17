function rankUpCost(x){
  let r = player.factory[x].r
  switch(x){
    case 0:
      return new OmegaNum(1.8).pow(r).times(25).floor()-techData[9].effect()
      break;
    case 1:
      return new OmegaNum(2.5).pow(r).times(10).floor()-techData[9].effect()
      break;
    case 2:
      return new OmegaNum(3.5).pow(r).times(15).floor()-techData[9].effect()
      break;
    case 3:
      return new OmegaNum(5).pow(r).times(14).floor()-techData[9].effect()
      break;
    case 4:
      return new OmegaNum(7).pow(r).times(13).floor()-techData[9].effect()
      break;
    case 5:
      return new OmegaNum(9).pow(r).times(25).floor()-techData[9].effect()
      break;
  }
}
function canRankUp(x){
  return player.factory[x].a.gte(rankUpCost(x))
}
function toRankUp(x){
  return player.factory[x].a.div(rankUpCost(x)).times(100)
}

function rankUpReset(){
  player.points=new OmegaNum(10)
  player.pps=new OmegaNum(0)
  for(let x=0;x<factoryAmount;x++){
    player.factory[x].a=D(0)
    player.factory[x].c=D(0)
    player.factory[x].p=D(0)
  }
  updateFactory()
}

function rankUp(x){
  if(!canRankUp(x))return;
  player.factory[x].r=player.factory[x].r.add(1)
  rankUpReset()
}