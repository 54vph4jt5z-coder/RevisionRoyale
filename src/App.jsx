
import React,{useEffect,useMemo,useState}from"react";
import{createRoot}from"react-dom/client";
import{createClient}from"@supabase/supabase-js";
import{Home,ScrollText,BookOpen,Trophy,Shield,Users,Store,Bot,BarChart3,Settings,Flame,Bell,Play,Star,Lock,Leaf,Calculator,Atom,FlaskConical,LogOut,Sun,Moon,Send,Copy,CheckCircle2,Target,X,Gift,Crown,Search}from"lucide-react";
import"./styles.css";

const supabase=createClient(import.meta.env.VITE_SUPABASE_URL||"",import.meta.env.VITE_SUPABASE_ANON_KEY||"");
const LEVELS=["National 5","Higher","Advanced Higher"];
const SCHOOLS=["Dumfries High School","Wallace Hall Academy","Sanquhar Academy","St Joseph's College","Dalbeattie High School","Annan Academy","Lockerbie Academy","Moffat Academy","Castle Douglas High School","Kirkcudbright Academy","Other Scottish School"];
const COURSE_TOPICS={
 Biology:{icon:<Leaf/>,color:"green","National 5":["Cell Biology","Multicellular Organisms","Life On Earth"],Higher:["DNA & The Genome","Metabolism & Survival","Sustainability & Interdependence"],"Advanced Higher":["Cells & Proteins","Organisms & Evolution","Investigative Biology"]},
 Maths:{icon:<Calculator/>,color:"blue","National 5":["Expressions & Formulae","Relationships","Applications"],Higher:["Expressions & Functions","Relationships & Calculus","Applications"],"Advanced Higher":["Methods In Algebra & Calculus","Applications Of Algebra & Calculus","Geometry, Proof & Systems"]},
 Physics:{icon:<Atom/>,color:"purple","National 5":["Dynamics & Space","Electricity & Energy","Waves & Radiation"],Higher:["Our Dynamic Universe","Particles & Waves","Electricity","Researching Physics"],"Advanced Higher":["Rotational Motion & Astrophysics","Quanta & Waves","Electromagnetism","Investigating Physics"]},
 Chemistry:{icon:<FlaskConical/>,color:"orange","National 5":["Chemical Changes & Structure","Nature's Chemistry","Chemistry In Society"],Higher:["Chemical Changes & Structure","Nature's Chemistry","Chemistry In Society","Researching Chemistry"],"Advanced Higher":["Inorganic Chemistry","Physical Chemistry","Organic Chemistry","Instrumental Analysis","Researching Chemistry"]}
};
const SHOP=[
 {id:"double_xp",name:"Double XP Potion",icon:"🧪",costType:"gems",cost:3,desc:"Your next saved session earns 2x XP."},
 {id:"coin_charm",name:"Coin Charm",icon:"🪙",costType:"coins",cost:40,desc:"Your next saved session earns 2x coins."},
 {id:"gem_finder",name:"Gem Finder",icon:"💎",costType:"coins",cost:75,desc:"Your next saved session earns +2 gems."}
];
function today(){return new Date().toISOString().slice(0,10)}
function weekStart(){const d=new Date(),day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return d.toISOString().slice(0,10)}
function minutesLabel(m){m=Number(m||0);const h=Math.floor(m/60),mm=m%60;return h?`${h}h ${mm}m`:`${mm}m`}
function levelFromXP(xp){return Math.max(1,Math.floor(Math.sqrt(Number(xp||0)/80))+1)}
function calcStreak(sessions){const days=[...new Set((sessions||[]).map(s=>s.session_date))].sort().reverse();let st=0,d=new Date(today()+"T00:00:00");for(let i=0;i<365;i++){const k=d.toISOString().slice(0,10);if(days.includes(k)){st++;d.setDate(d.getDate()-1);continue}if(i===0){d.setDate(d.getDate()-1);continue}break}return st}
function safeName(email){return(email||"student").split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").slice(0,18)||"student"}
function copyText(t){navigator.clipboard?.writeText(String(t||""))}

function App(){
 const[session,setSession]=useState(null),[loading,setLoading]=useState(true),[theme,setTheme]=useState(localStorage.getItem("rr_theme")||"light");
 useEffect(()=>{document.body.dataset.theme=theme;localStorage.setItem("rr_theme",theme)},[theme]);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
 if(loading)return <div className="loading">Loading RevisionRoyale...</div>;
 if(!session)return <Auth theme={theme} setTheme={setTheme}/>;
 return <Game user={session.user} theme={theme} setTheme={setTheme}/>;
}

function Auth({theme,setTheme}){
 const[mode,setMode]=useState("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[username,setUsername]=useState(""),[school,setSchool]=useState(SCHOOLS[0]),[house,setHouse]=useState("NITH"),[msg,setMsg]=useState("");
 async function submit(){setMsg("");const result=mode==="login"?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password,options:{data:{username:username||safeName(email),school,house}}});if(result.error)setMsg(result.error.message);else if(mode==="signup")setMsg("Account created. Check your email if confirmation is required, then log in.")}
 return <main className="auth">
  <section className="auth-card">
   <div className="logo"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
   <h2>{mode==="login"?"Welcome back, legend":"Create your quest profile"}</h2>
   <p className="friendly">Pick your school, join a house, earn XP, and climb your school leaderboard.</p>
   <div className="auth-tabs"><button className={mode==="login"?"on":""} onClick={()=>setMode("login")}>Login</button><button className={mode==="signup"?"on":""} onClick={()=>setMode("signup")}>Sign Up</button></div>
   {msg&&<div className="notice">{msg}</div>}
   <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
   <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
   {mode==="signup"&&<>
    <input placeholder="Username, e.g. baker07" value={username} onChange={e=>setUsername(e.target.value)}/>
    <select value={school} onChange={e=>setSchool(e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select>
    <select value={house} onChange={e=>setHouse(e.target.value)}><option>NITH</option><option>SCAUR</option><option>CAIRN</option></select>
   </>}
   <button className="big" onClick={submit}>{mode==="login"?"Enter RevisionRoyale":"Start My Quest"}</button>
   <button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon/>:<Sun/>} Switch theme</button>
  </section>
  <section className="auth-art"><Fox/><h2>Make revision feel like a game.</h2><p>Subject maps, daily quests, boosts, coins, gems and school leaderboards.</p></section>
 </main>
}

function Game({user,theme,setTheme}){
 const[page,setPage]=useState("home"),[profile,setProfile]=useState(null),[sessions,setSessions]=useState([]),[friends,setFriends]=useState([]),[subject,setSubject]=useState(localStorage.getItem("rr_subject")||"Biology"),[courseLevel,setCourseLevel]=useState(localStorage.getItem("rr_level")||"Higher"),[toast,setToast]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>localStorage.setItem("rr_subject",subject),[subject]);useEffect(()=>localStorage.setItem("rr_level",courseLevel),[courseLevel]);
 function notify(t){setToast(t);setTimeout(()=>setToast(""),2600)}
 async function ensureProfile(){
  let{data:p}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
  if(!p){const md=user.user_metadata||{},username=md.username||safeName(user.email);const{data:newP}=await supabase.from("profiles").insert({id:user.id,email:user.email,username,display_name:username,school:md.school||SCHOOLS[0],house:md.house||"NITH",coins:0,gems:0,active_boost:null}).select("*").single();p=newP}
  return p;
 }
 async function load(){setLoading(true);const p=await ensureProfile();const[s,f]=await Promise.all([supabase.from("study_sessions").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),supabase.from("friends_view").select("*").or(`requester.eq.${user.id},receiver.eq.${user.id}`)]);setProfile(p);setSessions(s.data||[]);setFriends(f.data||[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 const stats=useMemo(()=>{const xp=sessions.reduce((a,s)=>a+Number(s.xp||0),0),todayS=sessions.filter(s=>s.session_date===today()),week=sessions.filter(s=>s.session_date>=weekStart());return{xp,levelNum:levelFromXP(xp),coins:Number(profile?.coins||0),gems:Number(profile?.gems||0),activeBoost:profile?.active_boost||"",streak:calcStreak(sessions),total:sessions.reduce((a,s)=>a+Number(s.minutes||0),0),todayMinutes:todayS.reduce((a,s)=>a+Number(s.minutes||0),0),todayCount:todayS.length,week:week.reduce((a,s)=>a+Number(s.minutes||0),0)}},[sessions,profile]);
 if(loading)return <div className="loading">Loading your quest map...</div>;
 return <div className="shell">
  <aside className="sidebar">
   <div className="logo"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
   <Nav page={page} setPage={setPage} id="home" icon={<Home/>} label="Home"/><Nav page={page} setPage={setPage} id="quests" icon={<ScrollText/>} label="Quests"/><Nav page={page} setPage={setPage} id="study" icon={<BookOpen/>} label="Study"/><Nav page={page} setPage={setPage} id="leaderboard" icon={<Trophy/>} label="Leaderboard"/><Nav page={page} setPage={setPage} id="house" icon={<Shield/>} label="House"/><Nav page={page} setPage={setPage} id="friends" icon={<Users/>} label="Friends"/><Nav page={page} setPage={setPage} id="shop" icon={<Store/>} label="Shop"/><Nav page={page} setPage={setPage} id="ai" icon={<Bot/>} label="AI Coach"/><Nav page={page} setPage={setPage} id="stats" icon={<BarChart3/>} label="Stats"/><Nav page={page} setPage={setPage} id="settings" icon={<Settings/>} label="Settings"/>
   <div className="player"><div className="avatar">🧑‍🎓</div><b>@{profile?.username||"student"}</b><span>{profile?.school||"School"} · Level {stats.levelNum}</span><div className="bar"><i style={{width:`${Math.min(100,(stats.xp%800)/8)}%`}}/></div><small>{stats.xp%800}/800 XP</small><div className="wallet"><span>🪙 {stats.coins}</span><span>💎 {stats.gems}</span></div></div>
   <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut/> Sign out</button>
  </aside>
  <main className="main">
   <TopStats stats={stats} profile={profile} theme={theme} setTheme={setTheme}/>
   {toast&&<div className="toast">{toast}</div>}
   {page==="home"&&<HomePage stats={stats} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} setPage={setPage}/>}
   {page==="study"&&<Study user={user} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} reload={load} notify={notify} profile={profile}/>}
   {page==="quests"&&<Quests stats={stats} setPage={setPage}/>}
   {page==="leaderboard"&&<SchoolLeaderboard profile={profile}/>}
   {page==="house"&&<HouseCup school={profile?.school}/>}
   {page==="friends"&&<Friends user={user} friends={friends} reload={load} notify={notify}/>}
   {page==="shop"&&<Shop profile={profile} reload={load} notify={notify}/>}
   {page==="ai"&&<AI stats={stats} sessions={sessions} profile={profile} subject={subject} courseLevel={courseLevel}/>}
   {page==="stats"&&<Stats stats={stats} sessions={sessions}/>}
   {page==="settings"&&<SettingsPage profile={profile} setProfile={setProfile} notify={notify} theme={theme} setTheme={setTheme}/>}
  </main>
 </div>
}

function Fox({tiny}){return <div className={tiny?"fox tiny":"fox"}><span className="crown">👑</span><span className="face">🦊</span></div>}
function Nav({page,setPage,id,icon,label}){return <button className={`nav ${page===id?"active":""}`} onClick={()=>setPage(id)}>{React.cloneElement(icon,{size:21})}<span>{label}</span></button>}
function TopStats({stats,profile,theme,setTheme}){return <div className="top"><Metric icon="🔥" value={stats.streak} label="Day Streak"/><Metric icon="⚡" value={stats.xp} label="XP"/><Metric icon="🪙" value={stats.coins} label="Coins"/><Metric icon="💎" value={stats.gems} label="Gems"/><div className="house-pill"><Shield size={18}/> {profile?.house||"NITH"}</div><button className="circle"><Bell size={18}/></button><button className="circle" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button><Fox tiny/></div>}
function Metric({icon,value,label}){return <div className="metric"><b>{icon}</b><strong>{value}</strong><span>{label}</span></div>}

function HomePage({stats,subject,setSubject,courseLevel,setCourseLevel,setPage}){
 const course=COURSE_TOPICS[subject];return <div className="home-grid">
  <section className="hero"><div><h1>Keep your streak alive!</h1><p>{courseLevel} {subject}: study today and earn XP, coins and gems.</p><button onClick={()=>setPage("study")}>Start Study Session</button></div><Fox/></section>
  <section className="quest-card"><h2>🎯 Daily Quest</h2><p>Complete 3 study sessions</p><Progress value={Math.min(100,stats.todayCount/3*100)}/><b>{stats.todayCount} / 3</b><div className="rewards"><span>💜 100 XP</span><span>🪙 50</span><span>🎁</span></div>{stats.activeBoost&&<p className="boost-active">Active boost: {boostName(stats.activeBoost)}</p>}</section>
  <section className="card selectors"><div><h2>Choose Subject</h2><SubjectPicker subject={subject} setSubject={setSubject}/></div><div><h2>Choose Level</h2><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/></div></section>
  <section className="card map-card"><TopicHeader subject={subject} courseLevel={courseLevel}/><LearningMap subject={subject} courseLevel={courseLevel} course={course}/></section>
  <section className="card activity"><div className="head"><h2>📅 Today's Activity</h2></div><div className="activity-grid"><Mini icon="🕒" label="Study Time" value={minutesLabel(stats.todayMinutes)} goal="Goal: 3h 00m" pct={Math.min(100,stats.todayMinutes/180*100)}/><Mini icon="🎯" label="Sessions" value={`${stats.todayCount} / 4`} goal="Daily Goal" pct={Math.min(100,stats.todayCount/4*100)}/><Mini icon="⚡" label="XP Earned" value={stats.xp} goal="Level progress" pct={Math.min(100,(stats.xp%800)/8)}/></div></section>
  <RightRail stats={stats}/>
 </div>
}
function TopicHeader({subject,courseLevel}){const[open,setOpen]=useState(false),topics=COURSE_TOPICS[subject][courseLevel];return <div className="head"><h2>{courseLevel} {subject} Progress</h2><button onClick={()=>setOpen(true)}>View Topics ›</button>{open&&<div className="modal-back" onClick={()=>setOpen(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setOpen(false)}><X/></button><h2>{courseLevel} {subject} Topics</h2>{topics.map((t,i)=><div className="topic-row" key={t}><b>{i+1}</b><span>{t}</span></div>)}</div></div>}</div>}
function SubjectPicker({subject,setSubject}){return <div className="subject-grid">{Object.entries(COURSE_TOPICS).map(([name,s])=><button key={name} className={`subject ${s.color} ${subject===name?"selected":""}`} onClick={()=>setSubject(name)}>{React.cloneElement(s.icon,{size:24})}<b>{name}</b></button>)}</div>}
function LevelPicker({courseLevel,setCourseLevel}){return <div className="level-grid">{LEVELS.map(l=><button key={l} className={courseLevel===l?"level selected":"level"} onClick={()=>setCourseLevel(l)}>{l}</button>)}</div>}
function Progress({value}){return <div className="progress"><i style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>}
function LearningMap({subject,courseLevel,course}){const topics=course[courseLevel]||[];return <div className={`map ${course.color}`}>{topics.map((t,i)=><div className={`node n${i+1} ${i>1?"locked":""}`} key={t}><div>{i>1?<Lock size={26}/>:<Star size={26}/>}</div><span>{i+1}</span><b>{t}</b><small>{i<2?"⭐⭐⭐":"🔒"}</small></div>)}</div>}
function Mini({icon,label,value,goal,pct}){return <div className="mini"><span>{icon}</span><div><small>{label}</small><b>{value}</b><em>{goal}</em><Progress value={pct}/></div></div>}
function RightRail({stats}){return <aside className="rail"><section className="streak"><div>🔥</div><b>{stats.streak}</b><span>Day Streak</span><p>Amazing! Keep it up!</p><div className="week">{["M","T","W","T","F","S","S"].map((d,i)=><i key={i} className={i<5?"done":i===5?"today":""}>{d}</i>)}</div></section><section className="boost"><div>🧪</div><h3>Daily Boost</h3><p>Buy boosts in the shop and use them on your next saved session.</p><button onClick={()=>document.querySelector('[data-shop]')?.click()}>Visit Shop</button></section></aside>}

function Study({user,subject,setSubject,courseLevel,setCourseLevel,reload,notify,profile}){
 const[running,setRunning]=useState(false),[seconds,setSeconds]=useState(0),[notes,setNotes]=useState("");
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t)},[running]);
 const minutes=Math.max(1,Math.floor(seconds/60));
 async function save(){
  let xp=minutes+(minutes>=60?50:0),coins=Math.max(1,Math.floor(xp/10)),gems=minutes>=45?1:0;
  if(profile?.active_boost==="double_xp")xp*=2;if(profile?.active_boost==="coin_charm")coins*=2;if(profile?.active_boost==="gem_finder")gems+=2;
  const{error}=await supabase.from("study_sessions").insert({user_id:user.id,subject,minutes,xp,notes,check_in:`${courseLevel}: ${notes}`,session_date:today()});
  if(error){notify(error.message);return}
  await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,active_boost:null}).eq("id",user.id);
  notify(`Quest complete: ${minutes} min · ${xp} XP · ${coins} coins · ${gems} gems`);
  setRunning(false);setSeconds(0);setNotes("");reload();
 }
 return <section className="page study"><h1>Study Session</h1><SubjectPicker subject={subject} setSubject={setSubject}/><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/><div className="timer"><Fox tiny/><b>{String(Math.floor(seconds/3600)).padStart(2,"0")}:{String(Math.floor(seconds/60)%60).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</b><span>{courseLevel} {subject} quest in progress</span></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write what you revised or one thing you learned..."/><div className="actions">{!running?<button onClick={()=>setRunning(true)}><Play/>Start</button>:<button onClick={()=>setRunning(false)}>Pause</button>}<button className="green" onClick={save}><CheckCircle2/>End & Save</button></div></section>
}
function boostName(id){return SHOP.find(x=>x.id===id)?.name||id}
function Quests({stats,setPage}){return <section className="page"><h1>Daily Quests</h1><Quest title="Complete 3 study sessions" progress={stats.todayCount} goal={3}/><Quest title="Study for 45 minutes" progress={stats.todayMinutes} goal={45}/><Quest title="Keep your streak alive" progress={stats.streak>0?1:0} goal={1}/><button onClick={()=>setPage("study")}>Start A Quest</button></section>}
function Quest({title,progress,goal}){return <div className="quest"><Target/><div><b>{title}</b><Progress value={Math.min(100,progress/goal*100)}/><small>{progress}/{goal} · Reward available</small></div></div>}
function SchoolLeaderboard({profile}){const[rows,setRows]=useState([]);useEffect(()=>{if(!profile?.school)return;supabase.from("leaderboard_weekly").select("*").eq("school",profile.school).limit(50).then(({data})=>setRows(data||[]))},[profile?.school]);return <section className="page"><h1>{profile?.school||"School"} Leaderboard</h1>{rows.map((r,i)=><div className="leader" key={r.user_id}><span>#{i+1}</span><b>@{r.username}</b><em>{minutesLabel(r.minutes)}</em><strong>{r.xp} XP</strong></div>)}{!rows.length&&<p>No leaderboard data yet. Save a study session to appear here.</p>}</section>}
function HouseCup({school}){const[rows,setRows]=useState([]);useEffect(()=>{supabase.from("house_leaderboard").select("*").eq("school",school||"").then(({data})=>setRows(data||[]))},[school]);const all=["NITH","SCAUR","CAIRN"].map(h=>rows.find(r=>r.house===h)||{house:h,xp:0});return <section className="page house"><h1>🏆 House Cup</h1><p>House points start at 0 and rise when students in that house earn XP.</p>{all.map((h,i)=><div className={`house-row ${["red","blue","green"][i]}`} key={h.house}><Shield/><b>{h.house}</b><span>{h.xp||0} pts</span></div>)}</section>}
function Friends({user,friends,reload,notify}){const[query,setQuery]=useState(""),[results,setResults]=useState([]);async function search(){const q=query.trim();if(!q)return;const{data}=await supabase.from("profiles").select("id,username,display_name,school").ilike("username",`%${q}%`).limit(8);setResults((data||[]).filter(p=>p.id!==user.id))}async function add(p){const{error}=await supabase.from("friends").insert({requester:user.id,receiver:p.id,status:"accepted"});if(error){notify(error.message);return}notify(`Added @${p.username}`);setResults([]);setQuery("");reload()}return <section className="page"><h1>Friends</h1><p>Search by username. School is shown so you know who you are adding.</p><div className="inline"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search username, e.g. baker07"/><button onClick={search}><Search/>Search</button></div>{results.map(p=><div className="friend" key={p.id}><b>@{p.username}</b><span>{p.school}</span><button onClick={()=>add(p)}>Add</button></div>)}<h2>Your Friends</h2>{friends.map(f=><div className="friend" key={f.id}>👥 {f.friend_username?`@${f.friend_username}`:f.friend_email||"Friend"}</div>)}</section>}
function Shop({profile,reload,notify}){async function buy(item){if(profile?.active_boost){notify("Use your current boost before buying another.");return}const coins=Number(profile?.coins||0),gems=Number(profile?.gems||0);if(item.costType==="coins"&&coins<item.cost){notify("Not enough coins.");return}if(item.costType==="gems"&&gems<item.cost){notify("Not enough gems.");return}const patch={active_boost:item.id};if(item.costType==="coins")patch.coins=coins-item.cost;else patch.gems=gems-item.cost;const{error}=await supabase.from("profiles").update(patch).eq("id",profile.id);if(error){notify(error.message);return}notify(`${item.name} activated for your next session.`);reload()}return <section className="page" data-shop><h1>Shop</h1><p>Your balance: 🪙 {profile?.coins||0} coins · 💎 {profile?.gems||0} gems</p>{profile?.active_boost&&<div className="notice good">Active boost: {boostName(profile.active_boost)}</div>}<div className="shop-grid">{SHOP.map(item=><div className="shop" key={item.id}><span>{item.icon}</span><b>{item.name}</b><p>{item.desc}</p><strong>{item.cost} {item.costType}</strong><button onClick={()=>buy(item)}>Buy & Activate</button></div>)}</div></section>}
function AI({stats,sessions,profile,subject,courseLevel}){const[q,setQ]=useState(""),[answer,setAnswer]=useState(""),[busy,setBusy]=useState(false);async function ask(prompt){const question=prompt||q||`Make me a ${courseLevel} ${subject} revision plan.`;setBusy(true);try{const res=await fetch("/api/ai-study-coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,stats,recentSessions:sessions.slice(0,20),profile,subject,level:courseLevel})});const data=await res.json();setAnswer(data.answer||"Try again.")}catch{setAnswer("AI could not respond right now.")}setBusy(false)}return <section className="page ai"><h1>AI Study Coach 🤖</h1><div className="quick"><button onClick={()=>ask(`Make me a ${courseLevel} ${subject} revision plan`)}>Revision Plan</button><button onClick={()=>ask("Which subject am I neglecting?")}>Weak Spots</button><button onClick={()=>ask("How do I keep my streak?")}>Streak Advice</button></div><div className="ai-chat"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask anything about studying..." onKeyDown={e=>{if(e.key==="Enter")ask()}}/><button onClick={()=>ask()}><Send/>Ask</button></div><pre>{busy?"Thinking...":answer||"Ask your AI coach for revision tips."}</pre>{answer&&<button onClick={()=>copyText(answer)}><Copy/>Copy</button>}</section>}
function Stats({stats,sessions}){return <section className="page"><h1>Stats</h1><div className="stats-grid"><Metric icon="🔥" value={stats.streak} label="Streak"/><Metric icon="⚡" value={stats.xp} label="XP"/><Metric icon="🕒" value={minutesLabel(stats.total)} label="Total Study"/></div>{Object.keys(COURSE_TOPICS).map(s=>{const m=sessions.filter(x=>x.subject===s).reduce((a,x)=>a+Number(x.minutes||0),0);return <div className="subject-stat" key={s}><b>{s}</b><Progress value={Math.min(100,m/300*100)}/><span>{minutesLabel(m)}</span></div>})}</section>}
function SettingsPage({profile,setProfile,notify,theme,setTheme}){const[name,setName]=useState(profile?.display_name||""),[username,setUsername]=useState(profile?.username||""),[school,setSchool]=useState(profile?.school||SCHOOLS[0]),[house,setHouse]=useState(profile?.house||"NITH");async function save(){const{data,error}=await supabase.from("profiles").update({display_name:name,username,school,house}).eq("id",profile.id).select("*").single();if(error){notify(error.message);return}setProfile(data);notify("Settings saved.")}return <section className="page"><h1>Settings</h1><label>Display Name</label><input value={name} onChange={e=>setName(e.target.value)}/><label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)}/><label>School</label><select value={school} onChange={e=>setSchool(e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select><label>House</label><select value={house} onChange={e=>setHouse(e.target.value)}><option>NITH</option><option>SCAUR</option><option>CAIRN</option></select><button onClick={save}>Save</button><button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>Switch Theme</button></section>}

createRoot(document.getElementById("root")).render(<App/>);
