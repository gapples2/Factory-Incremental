const tabNames = ["main","settings","tech","scrap"]
const tabDivNames = ["main","settings","techdiv","scrapdiv"]

function loadTabs(){
  updateTabDisplay(player.tabDisplay)
}

function updateTabDisplay(id,firstLoad){
  document.getElementById("tabs").style.display=id==0?"":"none"
  tabNames.forEach((x,i)=>{
    if(document.getElementById(x+"tabbutton")){
      document.getElementById(x+"tabbutton").style.display="none"
      document.getElementById(x+"tabbutton").id=x+"tabbutton"+(id-1)
    }
    if(id==0){
      document.getElementById(x+"tabbutton1").style.display="none"
    }
    if(id==1){
      document.getElementById(x+"tabbutton0").style.display="none"
    }
    if(id!=2){
      document.getElementById(x+"tabbutton"+id).style.display=x=="main"||x=="settings"?"":"none"
      document.getElementById(x+"tabbutton"+id).id=x+"tabbutton"
      document.getElementById(tabDivNames[i]).style.display="none"
    }
    if(id==2){
      document.getElementById(tabDivNames[i]).style.display=x=="main"||x=="settings"?"":"none"
    }
  })
  if(id==0)changeTab(player.tab)
  if(id==1)player.stackedTabs.forEach(x=>changeStackedTab(x))
  document.getElementById("tabDisplay").innerText=["Top","Stacked","None"][id]
}

function changeTabOption(){
  let id = player.tabDisplay
  let newID = id+1
  if(newID>=3)newID=0
  
  updateTabDisplay(newID)
  player.tabDisplay=(player.tabDisplay+1)%3
}

function changeTab(x){
  document.getElementById(player.tab).style.display="none"
  document.getElementById(x).style.display=""
  player.tab=x
}

function changeStackedTab(x){
  let ele = document.getElementById(x)
  let d = ele.style.display=="none"
  ele.style.display=d?"":"none"
  if(d)player.stackedTabs.push(x)
  else player.stackedTabs.splice(player.stackedTabs.indexOf(x),1)
}