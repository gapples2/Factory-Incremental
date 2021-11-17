function autobuy(){
  // factories
  player.autobuyers.factory.forEach((x,i)=>{
    if(x&&player.tech[6]>=i+1&&!canRankUp(i))buyFactory(i)
  })
}