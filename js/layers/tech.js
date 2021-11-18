const techData = [
  {
    name: "Factory Amount",
    buttonDisplay: "FA",
    desc: "Increase the amount of factories you own.",
    max(){return 4},
    cost(){
      switch(Math.min(player.tech[0],this.max()-1)){
        case 0:
          return new OmegaNum(10000)
          break;
        case 1:
          return new OmegaNum(5e7)
          break;
        case 2:
          return new OmegaNum(1e20)
          break;
        case 3:
          return new OmegaNum(1e25)
          break;
      }
    },
    unlocked(){return true}
  },
  {
    name: "Factory Boosters",
    buttonDisplay: "FB",
    desc: "Boost the first factory production based on the amount of first factories you have.",
    max(){return 5},
    cost(){
      let x = Math.min(player.tech[1],this.max()-1)
      return new OmegaNum(2).pow(D(x).pow(x)).times(10000).div(techData[4].effect())
    },
    effect(){
      return player.factory[0].a.add(1).log10().add(1).pow(player.tech[1])
    },
    effectDisplay(){return `${format(this.effect())}x F1 production [(log10(F1+1)+1)<sup>TECH</sup>]`},
    unlocked(){return player.tech[0]>=1}
  },
  {
    name: "Factory Synergy",
    buttonDisplay: "FS",
    desc: "Boost the first factory production based on 2nd and 3rd factory amounts.",
    max(){return 2},
    cost(){
      let x = Math.min(player.tech[2],this.max()-1)
      return new OmegaNum(3).pow(D(x+1).pow(x+1).pow(1.5)).times(30000)
    },
    effect(){
      return player.factory[1].a.add(1).logBase(2).add(1).times(player.factory[2].a.add(1).sqrt()).pow(player.tech[2])
    },
    effectDisplay(){return `${format(this.effect())}x F1 production [((log2(F2+1)+1)*sqrt(F3+1))<sup>TECH</sup>]`},
    unlocked(){return player.tech[1]>=2}
  },
  {
    name: "Basic Factory Rank Improver",
    buttonDisplay: "BFRI",
    desc: "The first factory's rank effect is better.",
    max(){return 5},
    cost(){
      return new OmegaNum(10).pow(new OmegaNum(2).pow(Math.min(player.tech[3],techData[3].max()-1))).times(1e6)
    },
    effectDisplay(){return `R<sup>${player.tech[3]+1}</sup>`},
    unlocked(){return player.tech[1]>=2}
  },
  {
    name: "Booster Cheapeners",
    buttonDisplay: "BC",
    desc: "Cheapens the cost of 'Factory Boosters' based on total factory ranks.",
    max(){return 3},
    cost(){
      return new OmegaNum(1e3).pow(Math.min(player.tech[4],this.max()-1)).times(1e10)
    },
    effect(){
      let eff = D(1)
      for(let x=0;x<factoryAmount;x++)eff=eff.times(player.factory[x].r.add(1))
      let x = player.tech[4]
      return eff.pow(x**x).pow(x==0?0:1)
    },
    effectDisplay(){return `/${format(this.effect())} [productOfRanks<sup>TECH<sup>TECH</sup></sup> (if you don't have any of this tech then it's 1)]`},
    unlocked(){return player.factory[3].r.gte(1)}
  },
  {
    name: "Shrinking Boost",
    buttonDisplay: "SB",
    desc: "Multiply all factory production based on first factories that goes down every next tier of factory.",
    max(){return 3},
    cost(){
      let x = Math.min(player.tech[5],this.max()-1)
      return new OmegaNum(2).pow(new OmegaNum(3).pow(x+1)).times(1.25e10).div(x+1).pow(Math.min(0.95**(x-1),1))
    },
    effectDisplay(){let a=player.factory[0].a;let x=player.tech[5];return `${format(a.div(10).add(1).pow(x))}x F2P [(F1/10+1)<sup>TECH</sup>]<br>${format(a.div(100).add(1).pow(x))}x F3P & F4P [(F1/100+1)<sup>TECH</sup>]${player.tech[0]>=3?`<br>${format(a.div(1000).add(1).pow(x))}x F5P${player.tech[0]>=4?" & F6P":""} [(F1/1,000+1)<sup>TECH</sup>]`:""}`},
    unlocked(){return player.pps.gte(4e9)}
  },
  {
    name: "Factory Autobuyer",
    buttonDisplay: "FA",
    desc: "Unlock a factory autobuyer per level.",
    max(){return 6},
    cost(){
      return new OmegaNum(1000).pow(player.tech[6]).times(1e10)
    },
    unlocked(){return player.pps.gte(4e9)}
  },
  {
    name: "Factory Synergy II",
    buttonDisplay: "FS2",
    desc: "Boost the first factory production based on 4th and 5th factory amounts.",
    max(){return 3},
    cost(){
      let x = Math.min(player.tech[7],this.max())
      return D(10).pow(x).pow(D(2).pow(x)).times(1e20).div(new OmegaNum(8).pow(x))
    },
    effect(){
      return player.factory[3].a.add(1).logBase(2).add(1).times(player.factory[4].a.add(1).sqrt()).pow(player.tech[7])
    },
    effectDisplay(){return `${format(this.effect())}x F1 production [((log2(F4+1)+1)*sqrt(F5+1))<sup>TECH</sup>]`},
    unlocked(){return player.tech[0]>=3}
  },
  {
    name: "Advanced Factory Rank Improver",
    buttonDisplay: "AFRI",
    desc: "The second factory's rank effect is better.",
    max(){return 4},
    cost(){
      let x = Math.min(player.tech[8],techData[8].max()-1)
      return new OmegaNum(10).pow(new OmegaNum(2).pow(x)).times(1e22).div(x+1)
    },
    effect(){
      let x = player.tech[8]+1
      return 1-(0.4/x)-0.1
    },
    effectDisplay(){return `((R-1)*${format(this.effect())}+1)<sup>((R-1)*${format(this.effect())}+1)</sup> [1-0.4/TECH-0.1]`},
    unlocked(){return player.factory[4].r.gte(1)}
  },
  {
    name: "Rank Subtraction",
    buttonDisplay: "RS",
    desc: "Decrease rank cost from all factories by 5.",
    max(){return 3},
    cost(){
      return new OmegaNum(1000).pow(Math.min(player.tech[9],this.max()-1)).times(1e22)
    },
    effect(){return player.tech[9]*5},
    effectDisplay(){return `-${format(this.effect(),0)} rank cost`},
    unlocked(){return player.factory[4].r.gte(1)}
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
  document.getElementById("techDisplay").innerHTML = `<span class='techText'>${data.name}</span><br>${data.desc}<br>Costs ${format(data.cost())} points<br>${format(player.tech[x],0)}/${format(data.max(),0)}${data.effectDisplay?`<br><br>${data.effectDisplay()}`:"<br><br><br>"}`
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
  if(!player.unlocks.tech){
    player.unlocks.tech=player.factory[1].r.gte(1)
  }
  if(css){
    document.getElementById("techdiv").style.display=player.unlocks.tech?"":"none"
  }
  for(let x=0;x<techData.length;x++){
    player.unlockedTech[x]=player.unlockedTech[x]||techData[x].unlocked()
    document.getElementById("techUnlocked").innerText = player.unlockedTech.filter(x=>x==true).length
    if(css){
      document.getElementById("tech"+x).style.borderColor=player.tech[x]>=techData[x].max()?"blue":(player.tech[x]==0?"red":"yellow")
      document.getElementById("tech"+x).style.display=player.unlockedTech[x]?"":"none"
      continue;
    }
    
    document.getElementById("techLvl"+x).innerText=romanNumeral(Math.min(player.tech[x],techData[x].max()-1))
    document.getElementById("techUnlocked").innerText = player.unlockedTech.filter(x=>x==true).length
    let num = 0
    player.tech.forEach(x=>num+=x)
    document.getElementById("techBought").innerText = num
  }
}

function loadTech(){
  document.getElementById("totalTech").innerText = techData.length
  let num = 0
  techData.forEach(x=>num+=x.max())
  document.getElementById("totalTechToBuy").innerText = num
  for(let x=0;x<techData.length;x++)createTechHTML(x)
  updateTech()
}