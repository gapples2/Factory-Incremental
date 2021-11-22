const goalData=[
  {
    desc: "Unlock technology once you rank up your second factory.",
    req(){return player.unlocks.tech}
  },
  {
    desc: "Unlock another tech once you buy the first tech.",
    req(){return player.tech[0]>=1}
  },
  {
    desc: 'Unlock 2 more tech once you buy another level of the first tech.',
    req(){return player.tech[0]>=2}
  },
  {
    desc: "Unlock 1 more tech once you rank up your third factory.",
    req(){return player.factory[2].r.gte(1)}
  },
  {
    desc: "Unlock 2 more tech once you gain 4e9 points per second.",
    req(){return player.pps.gte(4e9)}
  },
  {
    desc: "Unlock 1 more tech once you buy the first tech 3 times.",
    req(){return player.tech[0]>=3}
  },
  {
    desc: "Unlock 2 more tech once you rank up your fourth factory.",
    req(){return player.factory[3].r.gte(1)}
  },
  {
    desc: "Unlock scraps once you get 1e30 points.",
    req(){return player.points.gte(1e30)}
  },
  {
    desc: "Unlock scrap/money milestones once you get 3 scraps/money.",
    req(){return player.scraps.add(player.money).gte(3)}
  }
]

function checkForGoals(){
  if(goalData[player.goal]?.req()){
    player.goal++
    document.getElementById("goal").innerText=goalData[player.goal]?.desc||"There isn't anything more to unlock."
  }
}