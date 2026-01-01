let state = JSON.parse(localStorage.getItem("ascend")) || {
  name:"You",
  level:1,
  xp:0,
  streak:0,
  lastDay:"",
  aiMode:"motivational",
  settings:{tapMode:true,reducedMotion:false},

  nutritionLog:[],
  notes:[],

  tasks:[
    {name:"Make bed",xp:1,enabled:true},
    {name:"Walk 5k steps",xp:2,enabled:true},
    {name:"Walk 10k steps",xp:4,enabled:false},
    {name:"Walk 15k steps",xp:6,enabled:false},

    {name:"Homework done",xp:2,enabled:false},
    {name:"Read 30 pages",xp:3,enabled:false},
    {name:"Read 60 pages",xp:5,enabled:false},
    {name:"Gym session",xp:5,enabled:false},
    {name:"Sleep before 11pm",xp:2,enabled:false}
  ]
};
const XP_PER_LEVEL = 10;

/* ---------- NAV ---------- */
function go(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(p).classList.add("active");
}

/* ---------- TASKS ---------- */
function renderTasks(){
  taskList.innerHTML="";
  state.tasks.filter(t=>t.enabled).forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.name} (+${t.xp})`;
    b.onclick=()=>gainXP(t.xp);
    taskList.appendChild(b);
  });
}
/* ---------- TASK LIBRARY ---------- */
function renderLibrary(){
  taskLibrary.innerHTML="";
  state.tasks.forEach(t=>{
    const b=document.createElement("button");
    b.innerText=`${t.enabled?"✓ ":""}${t.name}`;
    b.onclick=()=>{t.enabled=!t.enabled;save();};
    taskLibrary.appendChild(b);
  });
}

/* ---------- XP SYSTEM ---------- */
function gainXP(x){
  const today=new Date().toDateString();
  if(state.lastDay!==today){
    state.streak++;
    state.lastDay=today;
  }
  state.xp+=x;
  if(state.xp>=XP_PER_LEVEL){
    state.xp-=XP_PER_LEVEL;
    state.level++;
    alert("LEVEL UP!");
  }
  save();
}
/* ---------- PROFILE FRAME ---------- */
function updateFrame(){
  frame.className="level-ring";
  if(state.level>=20) frame.classList.add("frame-20");
  else if(state.level>=10) frame.classList.add("frame-10");
  else if(state.level>=5) frame.classList.add("frame-5");
}

/* ---------- AI COACH ---------- */
function aiCoach(){
  if(state.aiMode==="silent") return;
  if(state.aiMode==="motivational")
    alert("Consistency compounds. Small wins today shape who you become.");
  if(state.aiMode==="analytical")
    alert(`Level ${state.level}. Your streak efficiency is improving. Maintain input consistency.`);
}
/* ---------- NUTRITION ---------- */
function saveNutrition(){
  const entry={
    date:new Date().toDateString(),
    calories:+calories.value||0,
    protein:+protein.value||0,
    carbs:+carbs.value||0,
    fats:+fats.value||0
  };
  state.nutritionLog.push(entry);
  nutritionSummary.innerText=`Saved ${entry.calories} kcal today`;
  calories.value=protein.value=carbs.value=fats.value="";
  save();
}
/* ---------- NOTES (PREMIUM) ---------- */
function addNote(){
  if(!noteInput.value) return;

  state.notes.unshift({
    text:noteInput.value,
    date:new Date().toLocaleString(),
    color:["#1f2937","#111827","#020617"][Math.floor(Math.random()*3)]
  });

  noteInput.value="";
  save();
}

function renderNotes(){
  notesList.innerHTML="";
  state.notes.forEach(n=>{
    const d=document.createElement("div");
    d.className="note-card";
    d.innerHTML=`
      <div class="note-accent" style="background:${n.color}"></div>
      <p>${n.text}</p>
      <small>${n.date}</small>
    `;
    notesList.appendChild(d);
  });
}
/* ---------- LEADERBOARD ---------- */
const leaderboard=[
  ()=>({name:state.name,level:state.level}),
  {name:"Alex",level:14},
  {name:"Sam",level:9}
];

function loadLeaderboard(){
  leaderboardList.innerHTML="";
  leaderboard.forEach(p=>{
    const d=typeof p==="function"?p():p;
    const li=document.createElement("li");
    li.innerText=`${d.name} — Level ${d.level}`;
    leaderboardList.appendChild(li);
  });
}

/* ---------- SETTINGS ---------- */
function toggle(k){ state.settings[k]=!state.settings[k]; save(); }
function setAI(m){ state.aiMode=m; save(); }
function saveName(){ state.name=nameInput.value||state.name; save(); }
/* ---------- SAVE ---------- */
function save(){
  localStorage.setItem("ascend",JSON.stringify(state));
  updateUI();
}

function updateUI(){
  username.innerText=state.name;
  level.innerText=state.level;
  xpFill.style.width=`${(state.xp/XP_PER_LEVEL)*100}%`;
  streak.innerText=`🔥 ${state.streak} day streak`;
  updateFrame();
  renderTasks();
  renderLibrary();
  renderNotes();
  loadLeaderboard();
}

updateUI();
