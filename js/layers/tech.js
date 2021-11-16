const techData = [
  {
    name: "Factory Amount",
    buttonDisplay: "FA",
    desc: "Increase the amount of factories you own.",
    max(){return 1},
    cost(){
      switch(Math.min(player.tech[0],this.max()-1)){
        case 0:
          return new OmegaNum(10000)
          break;
        case 1:
          return new OmegaNum(1e308)
          break;
      }
    },
    unlocked(){return true}
  },
  {
    name: "Factory Boosters",
    buttonDisplay: "FB",
    desc: "Boost the first factory production based on the amount of first factories you have.",
    max(){return 4},
    cost(){
      let x = Math.min(player.tech[1],this.max()-1)
      return new OmegaNum(2).pow(D(x).pow(x)).times(10000).div(new OmegaNum(100000).pow(player.tech[3]))
    },
    effect(){
      return player.factory[0].a.add(1).log10().add(1).pow(player.tech[1])
    },
    effectDisplay(){return `${format(this.effect())}x F1 production`},
    unlocked(){return player.tech[0]>=1}
  },
  {
    name: "Factory Synergy",
    buttonDisplay: "FS",
    desc: "Boost the first factory production based on 2nd and 3rd factory amounts.",
    max(){return 2},
    cost(){
      let x = Math.min(player.tech[2],this.max()-1)
      return new OmegaNum(3).pow(D(x+1).pow(x+1).pow(1.5)).times(30000).div(new OmegaNum(10).pow(player.tech[3]))
    },
    effect(){
      return player.factory[1].a.add(1).logBase(2).add(1).times(player.factory[2].a.add(1).sqrt()).pow(player.tech[2])
    },
    effectDisplay(){return `${format(this.effect())}x F1 production`},
    unlocked(){return player.tech[1]>=2}
  },
  {
    name: "Tech Cheapener",
    buttonDisplay: "TC",
    desc: "Make 'Factory Boosters' 100,000x cheaper and 'Factory Synergy' 10x cheaper.",
    max(){return 1},
    cost(){
      return new OmegaNum(1e7)
    },
    unlocked(){return player.tech[1]>=2}
  }
]

function buyTech(x){
  if(D(player.tech[x]).gte(techData[x].max())||player.points.lt(techData[x].cost()))return;
  player.points=player.points.minus(techData[x].cost())
  player.tech[x]++
  updateTech()
  updateFactory()
  handleTechHover(x)
}

function handleTechHover(x){
  let data = techData[x]
  document.getElementById("techDisplay").innerHTML = `<b>${data.name}</b><br>${data.desc}<br>Costs ${format(data.cost())} points<br>${format(player.tech[x],0)}/${format(data.max(),0)}${data.effectDisplay?`<br><br>${data.effectDisplay()}`:""}`
}

function createTechHTML(x){
  let data = techData[x]
  let rowNum = Math.floor(x/10)
  let row = document.getElementById("techRow"+rowNum)
  if(!row){
    row=document.createElement("tr")
    row.id = "techRow"+rowNum
    document.getElementById("tech").appendChild(row)
  }
  let col = document.createElement("td")
  let ele = document.createElement("button")
  ele.innerHTML = `${data.buttonDisplay} <span id='techLvl${x}'></span>`
  ele.addEventListener("click",()=>buyTech(x))
  ele.addEventListener("mouseover",()=>handleTechHover(x))
  ele.style.width = "50px"
  ele.style.height = "50px"
  ele.id = "tech"+x
  col.appendChild(ele)
  row.appendChild(col)
}

function updateTech(textOnly=false,css=false){
  if(!player.unlocks.tech)player.unlocks.tech=player.factory[1].r.gte(1)
  if(css){
    document.getElementById("techtabbutton").style.display=player.unlocks.tech?"":"none"
  }
  for(let x=0;x<techData.length;x++){
    if(css){
      document.getElementById("tech"+x).style.borderColor=player.tech[x]>=techData[x].max()?"blue":(player.tech[x]==0?"red":"yellow")
      document.getElementById("tech"+x).style.display=techData[x].unlocked()?"":"none"
      continue;
    }
    
    document.getElementById("techLvl"+x).innerText=romanNumeral(Math.min(player.tech[x],techData[x].max()-1))
  }
}

function loadTech(){
  for(let x=0;x<techData.length;x++)createTechHTML(x)
  updateTech()
}