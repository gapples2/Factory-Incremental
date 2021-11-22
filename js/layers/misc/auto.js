function autobuy(){
  // factories
  player.autobuyers.factory.forEach((x,i)=>{
    if(x&&player.tech[6]>=i+1&&!canRankUp(i)&&player.factory[i].u){
      if(player.tech[20]>=i+1)buyMaxFactory(i,true)
      else buyFactory(i,true)
    }
  })
}