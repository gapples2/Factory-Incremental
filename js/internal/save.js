function save(){
  localStorage.factoryincremental=btoa(JSON.stringify(player))
}

function fixSave(main,data){
  if(data==undefined||data==null)return main
  Object.keys(main).forEach(o=>{
    if(main[o] instanceof OmegaNum){main[o]=new OmegaNum(data[o]||main[o])}
    else if(typeof main[o] == "object"&&!(main[o] instanceof OmegaNum)){fixSave(main[o],data[o])}
    else main[o]=data[o]
  })
}

function load(){
  let data = localStorage.factoryincremental
  if(!data)return;
  data=JSON.parse(atob(data))
  fixSave(player,data)
}