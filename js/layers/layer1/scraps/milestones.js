// [req,[scraptech,moneytech]]
const milestoneData = [
  [new OmegaNum(5),["Recycling","Factory Autobuyer II"]],
  [new OmegaNum(50),["Factory Boosters II","Factory Keeper"]],
  [new OmegaNum(500),["Rank Subtraction II","Factory Keeper II"]],
  [new OmegaNum(1e5),["Factory Synergy III","Factory Keeper III"]]
]

const milestoneAmt = milestoneData.length

function loadMilestones(){
  for(let x=0;x<milestoneAmt;x++)createMilestoneHTML(x)
}

function checkForMilestones(){
  (["scraps","money"]).forEach((x,i)=>{
    let amt = 0
    milestoneData.forEach(c=>{
      if(player[x].gte(c[0]))amt++
    })
    player[x+"Milestones"]=amt
    for(let a=0;a<10;a++){
      let id = (i+1)*10+a
      player.unlockedTech[id]=a<amt
      player.tech[id]=a<amt?player.tech[id]:0
    }
  })
}

function updateMilestones(){
  if(player.goals>=9){
    (["scraps","money"]).forEach((x,i)=>{
      milestoneData.forEach((a,b)=>{
        if(player[x+"Milestones"]>=(b-1)){
          document.getElementById(x+"Milestone"+b).className="milestone "+x+"Milestone"+(player[x+"Milestones"]>b?"Complete":"Incomplete")
        }
        document.getElementById("milestoneRow"+b).style.display=player[x+"Milestones"]<b-1?"none":""
      })
    })
  }
  document.getElementById("milestones").style.display=player.goals>=9?"":"none"
}

function createMilestoneHTML(id){
  let row = document.createElement("tr")
  row.id = "milestoneRow"+id;
  (["scraps","money"]).forEach((x,i)=>{
    let data = milestoneData[id]
    let ele = document.createElement("td")
    ele.innerHTML = `<div class="milestone" id="${x+"Milestone"+id}"><span style='font-size:20px'>${format(data[0],0)} ${x.slice(0,1).toUpperCase()+x.slice(1)}</span><br><br>Unlock <b>${data[1][i]}</b>.</div>`
    row.appendChild(ele)
  })
  document.getElementById("milestones").appendChild(row)
}