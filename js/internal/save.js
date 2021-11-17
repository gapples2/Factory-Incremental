function save(){
  localStorage.factoryincremental=btoa(JSON.stringify(player))
}

function fixSave(main,data){
  if(data==undefined||data==null)return main
  Object.keys(main).forEach(o=>{
    if(main[o] instanceof OmegaNum){main[o]=new OmegaNum(data[o]||main[o])}
    else if(typeof main[o] == "object"&&!(main[o] instanceof OmegaNum)){fixSave(main[o],data[o])}
    else main[o]=data[o]==undefined||data[o]==null?main[o]:data[o]
  })
}

function load(){
  let data = localStorage.factoryincremental
  if(!data||data=="undefined")return;
  data=JSON.parse(atob(data))
  fixSave(player,data)
}

function hardReset(finished=false){
  if(!finished&&!confirm("Are you sure you want to hard reset? This isn't a prestige layer.")||finished&&!confirm("Are you sure you want to reset your progress?"))return;
  localStorage.factoryincremental=undefined
  window.location.reload()
}

function exportSave(){
	let str = btoa(JSON.stringify(player))
	
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
  el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
  alert("Save successfully exported!")
}

function importSave(imported=undefined) {
	if (imported===undefined) imported = prompt("Paste your save here")
	try {
		tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)))
		player = tempPlr;
		fixSave()	
		save()
		window.location.reload()
	} catch(e) {
		return;
	}
}