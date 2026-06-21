
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  Home, ScrollText, BookOpen, Trophy, Shield, Users, Store, Bot, BarChart3,
  Settings, Flame, Zap, Gem, Bell, Play, Star, Gift, Lock, Leaf, Calculator,
  Atom, FlaskConical, LogOut, Sun, Moon, Send, Copy, CheckCircle2
} from "lucide-react";
import "./styles.css";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || "", import.meta.env.VITE_SUPABASE_ANON_KEY || "");

const SUBJECTS = [
  { id: "Biology", icon: <Leaf />, color: "green", topics: ["Cells", "Tissues", "Organ Systems", "Genetics", "Ecology"] },
  { id: "Maths", icon: <Calculator />, color: "blue", topics: ["Algebra", "Graphs", "Trigonometry", "Calculus", "Vectors"] },
  { id: "Physics", icon: <Atom />, color: "purple", topics: ["Forces", "Energy", "Waves", "Electricity", "Space"] },
  { id: "Chemistry", icon: <FlaskConical />, color: "orange", topics: ["Atoms", "Bonding", "Rates", "Acids", "Organic"] }
];
const HOUSES = [{ name: "NITH", pts: 1250, color: "red" }, { name: "SCAUR", pts: 980, color: "blue" }, { name: "CAIRN", pts: 870, color: "green" }];

function today(){ return new Date().toISOString().slice(0,10); }
function weekStart(){ const d = new Date(); const day = (d.getDay()+6)%7; d.setDate(d.getDate()-day); return d.toISOString().slice(0,10); }
function minutesLabel(m){ m=Number(m||0); const h=Math.floor(m/60), mm=m%60; return h ? `${h}h ${mm}m` : `${mm}m`; }
function levelFromXP(xp){ return Math.max(1, Math.floor(Math.sqrt(Number(xp||0)/80))+1); }
function calcStreak(sessions){
  const days = [...new Set((sessions||[]).map(s=>s.session_date))].sort().reverse();
  let streak=0, d=new Date(today()+"T00:00:00");
  for(let i=0;i<365;i++){ const k=d.toISOString().slice(0,10); if(days.includes(k)){streak++; d.setDate(d.getDate()-1); continue;} if(i===0){d.setDate(d.getDate()-1); continue;} break; }
  return streak;
}
function copyText(t){ navigator.clipboard?.writeText(String(t||"")); }

function App(){
  const [session,setSession]=useState(null);
  const [loading,setLoading]=useState(true);
  const [theme,setTheme]=useState(localStorage.getItem("rr_theme")||"light");
  useEffect(()=>{ document.body.dataset.theme=theme; localStorage.setItem("rr_theme",theme); },[theme]);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setSession(data.session); setLoading(false); });
    const { data:{subscription} } = supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return ()=>subscription.unsubscribe();
  },[]);
  if(loading) return <div className="loading">Loading RevisionRoyale...</div>;
  if(!session) return <Auth theme={theme} setTheme={setTheme}/>;
  return <Game user={session.user} theme={theme} setTheme={setTheme}/>;
}

function Auth({theme,setTheme}){
  const [mode,setMode]=useState("login"), [email,setEmail]=useState(""), [password,setPassword]=useState(""), [msg,setMsg]=useState("");
  async function submit(){
    setMsg("");
    const result = mode==="login" ? await supabase.auth.signInWithPassword({email,password}) : await supabase.auth.signUp({email,password});
    if(result.error) setMsg(result.error.message); else setMsg(mode==="login" ? "" : "Account created. Check your email if needed.");
  }
  return <main className="auth">
    <section className="auth-card">
      <div className="logo"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
      <h2>{mode==="login" ? "Welcome back, champion" : "Start your study quest"}</h2>
      <p>Streaks, XP, gems, quests, subject maps and house battles.</p>
      <div className="auth-tabs"><button className={mode==="login"?"on":""} onClick={()=>setMode("login")}>Login</button><button className={mode==="signup"?"on":""} onClick={()=>setMode("signup")}>Sign Up</button></div>
      {msg && <div className="notice">{msg}</div>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="big" onClick={submit}>{mode==="login" ? "Enter RevisionRoyale" : "Create Account"}</button>
      <button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon/>:<Sun/>} Switch theme</button>
    </section>
    <section className="auth-art"><Fox/><h2>Study Like It’s A Game</h2><p>Complete quests, unlock topics and climb the House Cup.</p></section>
  </main>;
}

function Game({user,theme,setTheme}){
  const [page,setPage]=useState("home"), [profile,setProfile]=useState(null), [sessions,setSessions]=useState([]), [friends,setFriends]=useState([]), [subject,setSubject]=useState("Biology"), [toast,setToast]=useState("");
  function notify(t){ setToast(t); setTimeout(()=>setToast(""),2600); }
  async function load(){
    let {data:p}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
    if(!p){
      const username=(user.email||"student").split("@")[0];
      const {data:newP}=await supabase.from("profiles").insert({id:user.id,email:user.email,username,display_name:username,house:"NITH"}).select("*").single();
      p=newP;
    }
    const [s,f]=await Promise.all([
      supabase.from("study_sessions").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
      supabase.from("friends_view").select("*").or(`requester.eq.${user.id},receiver.eq.${user.id}`)
    ]);
    setProfile(p); setSessions(s.data||[]); setFriends(f.data||[]);
  }
  useEffect(()=>{load()},[]);
  const stats=useMemo(()=>{
    const xp=sessions.reduce((a,s)=>a+Number(s.xp||0),0);
    const todayS=sessions.filter(s=>s.session_date===today());
    const week=sessions.filter(s=>s.session_date>=weekStart());
    return { xp, level:levelFromXP(xp), gems:Math.floor(xp/180), streak:calcStreak(sessions), total:sessions.reduce((a,s)=>a+Number(s.minutes||0),0), todayMinutes:todayS.reduce((a,s)=>a+Number(s.minutes||0),0), todayCount:todayS.length, week:week.reduce((a,s)=>a+Number(s.minutes||0),0) };
  },[sessions]);
  return <div className="shell">
    <aside className="sidebar">
      <div className="logo"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
      <Nav page={page} setPage={setPage} id="home" icon={<Home/>} label="Home"/>
      <Nav page={page} setPage={setPage} id="quests" icon={<ScrollText/>} label="Quests"/>
      <Nav page={page} setPage={setPage} id="study" icon={<BookOpen/>} label="Study"/>
      <Nav page={page} setPage={setPage} id="leaderboard" icon={<Trophy/>} label="Leaderboard"/>
      <Nav page={page} setPage={setPage} id="house" icon={<Shield/>} label="House"/>
      <Nav page={page} setPage={setPage} id="friends" icon={<Users/>} label="Friends"/>
      <Nav page={page} setPage={setPage} id="shop" icon={<Store/>} label="Shop"/>
      <Nav page={page} setPage={setPage} id="ai" icon={<Bot/>} label="AI Coach"/>
      <Nav page={page} setPage={setPage} id="stats" icon={<BarChart3/>} label="Stats"/>
      <Nav page={page} setPage={setPage} id="settings" icon={<Settings/>} label="Settings"/>
      <div className="player"><div className="avatar">🧑‍🎓</div><b>{profile?.display_name||"Student"}</b><span>Level {stats.level}</span><div className="bar"><i style={{width:`${Math.min(100,(stats.xp%800)/8)}%`}}/></div><small>{stats.xp%800}/800 XP</small><div className="wallet"><span>🪙 {Math.floor(stats.xp/6)}</span><span>💎 {stats.gems}</span></div></div>
      <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut/> Sign out</button>
    </aside>
    <main className="main">
      <TopStats stats={stats} profile={profile} theme={theme} setTheme={setTheme}/>
      {toast && <div className="toast">{toast}</div>}
      {page==="home" && <HomePage stats={stats} subject={subject} setSubject={setSubject} setPage={setPage}/>}
      {page==="study" && <Study user={user} subject={subject} setSubject={setSubject} reload={load} notify={notify}/>}
      {page==="quests" && <Quests stats={stats} setPage={setPage}/>}
      {page==="leaderboard" && <Leaderboard/>}
      {page==="house" && <HouseCup/>}
      {page==="friends" && <Friends user={user} friends={friends} reload={load} notify={notify}/>}
      {page==="shop" && <Shop/>}
      {page==="ai" && <AI stats={stats} sessions={sessions} profile={profile}/>}
      {page==="stats" && <Stats stats={stats} sessions={sessions}/>}
      {page==="settings" && <SettingsPage profile={profile} setProfile={setProfile} notify={notify} theme={theme} setTheme={setTheme}/>}
    </main>
  </div>;
}

function Fox({tiny}){return <div className={tiny?"fox tiny":"fox"}><span className="crown">👑</span><span className="face">🦊</span></div>}
function Nav({page,setPage,id,icon,label}){return <button className={`nav ${page===id?"active":""}`} onClick={()=>setPage(id)}>{React.cloneElement(icon,{size:22})}<span>{label}</span></button>}
function TopStats({stats,profile,theme,setTheme}){return <div className="top"><Metric icon="🔥" value={stats.streak} label="Day Streak"/><Metric icon="⚡" value={stats.xp} label="XP"/><Metric icon="💎" value={stats.gems} label="Gems"/><div className="house-pill"><Shield/> {profile?.house||"NITH"}</div><button className="circle"><Bell/></button><button className="circle" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon/>:<Sun/>}</button><Fox tiny/></div>}
function Metric({icon,value,label}){return <div className="metric"><b>{icon}</b><strong>{value}</strong><span>{label}</span></div>}

function HomePage({stats,subject,setSubject,setPage}){
  const current=SUBJECTS.find(s=>s.id===subject)||SUBJECTS[0];
  return <div className="home-grid">
    <section className="hero"><div><h1>Keep your streak alive!</h1><p>Study today and earn bonus XP.</p><button onClick={()=>setPage("study")}>Start Study Session</button></div><Fox/></section>
    <section className="quest-card"><h2>🎯 Daily Quest</h2><p>Complete 3 study sessions</p><Progress value={Math.min(100,stats.todayCount/3*100)}/><b>{stats.todayCount} / 3</b><div className="rewards"><span>💜 100 XP</span><span>🪙 50</span><span>🎁</span></div></section>
    <section className="card subjects"><h2>Choose Subject</h2><SubjectPicker subject={subject} setSubject={setSubject}/></section>
    <section className="card map-card"><div className="head"><h2>Subject Progress: {current.id}</h2><button>View All Topics ›</button></div><LearningMap subject={current}/></section>
    <section className="card activity"><div className="head"><h2>📅 Today's Activity</h2><button>See All ›</button></div><div className="activity-grid"><Mini icon="🕒" label="Study Time" value={minutesLabel(stats.todayMinutes)} goal="Goal: 3h 00m" pct={Math.min(100,stats.todayMinutes/180*100)}/><Mini icon="🎯" label="Sessions" value={`${stats.todayCount} / 4`} goal="Daily Goal" pct={Math.min(100,stats.todayCount/4*100)}/><Mini icon="⚡" label="XP Earned" value={stats.xp} goal="Daily Goal: 500 XP" pct={Math.min(100,(stats.xp%500)/5)}/></div></section>
    <RightRail stats={stats}/>
  </div>;
}

function SubjectPicker({subject,setSubject}){return <div className="subject-grid">{SUBJECTS.map(s=><button key={s.id} className={`subject ${s.color} ${subject===s.id?"selected":""}`} onClick={()=>setSubject(s.id)}>{React.cloneElement(s.icon,{size:25})}<b>{s.id}</b></button>)}</div>}
function Progress({value}){return <div className="progress"><i style={{width:`${value}%`}}/></div>}
function LearningMap({subject}){return <div className={`map ${subject.color}`}>{subject.topics.map((t,i)=><div className={`node n${i+1} ${i>1&&i<4?"locked":""}`} key={t}><div>{i>1&&i<4?<Lock/>:<Star/>}</div><span>{i+1}</span><b>{t}</b><small>{i<2?"⭐⭐⭐":i===4?"🎁":"🔒"}</small></div>)}</div>}
function Mini({icon,label,value,goal,pct}){return <div className="mini"><span>{icon}</span><div><small>{label}</small><b>{value}</b><em>{goal}</em><Progress value={pct}/></div></div>}
function RightRail({stats}){return <aside className="rail"><HouseCup compact/><section className="streak"><div>🔥</div><b>{stats.streak}</b><span>Day Streak</span><p>Amazing! Keep it up!</p><div className="week">{["M","T","W","T","F","S","S"].map((d,i)=><i key={i} className={i<5?"done":i===5?"today":""}>{d}</i>)}</div></section><section className="boost"><div>🧪</div><h3>Daily Boost</h3><p>Earn 2x XP for your next session!</p><button>Activate Boost</button></section></aside>}

function Study({user,subject,setSubject,reload,notify}){
  const [running,setRunning]=useState(false),[seconds,setSeconds]=useState(0),[notes,setNotes]=useState("");
  useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(t)},[running]);
  const minutes=Math.max(1,Math.floor(seconds/60));
  async function save(){const xp=minutes+(minutes>=60?50:0);const {error}=await supabase.from("study_sessions").insert({user_id:user.id,subject,minutes,xp,notes,check_in:notes,session_date:today()});if(error){notify(error.message);return}notify(`Quest complete: ${minutes} min · ${xp} XP`);setRunning(false);setSeconds(0);setNotes("");reload();}
  return <section className="page study"><h1>Study Session</h1><SubjectPicker subject={subject} setSubject={setSubject}/><div className="timer"><Fox tiny/><b>{String(Math.floor(seconds/3600)).padStart(2,"0")}:{String(Math.floor(seconds/60)%60).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</b><span>{subject} quest in progress</span></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write what you revised or one thing you learned..."/><div className="actions">{!running?<button onClick={()=>setRunning(true)}><Play/>Start</button>:<button onClick={()=>setRunning(false)}>Pause</button>}<button className="green" onClick={save}><CheckCircle2/>End & Save</button></div></section>;
}
function Quests({stats,setPage}){return <section className="page"><h1>Daily Quests</h1><Quest title="Complete 3 study sessions" progress={stats.todayCount} goal={3}/><Quest title="Study for 45 minutes" progress={stats.todayMinutes} goal={45}/><Quest title="Keep your streak alive" progress={stats.streak>0?1:0} goal={1}/><button onClick={()=>setPage("study")}>Start A Quest</button></section>}
function Quest({title,progress,goal}){return <div className="quest"><Target/><div><b>{title}</b><Progress value={Math.min(100,progress/goal*100)}/><small>{progress}/{goal} · Reward available</small></div></div>}
function Leaderboard(){const [rows,setRows]=useState([]);useEffect(()=>{supabase.from("leaderboard_weekly").select("*").limit(50).then(({data})=>setRows(data||[]))},[]);return <section className="page"><h1>Leaderboard</h1>{rows.map((r,i)=><div className="leader" key={r.user_id}><span>#{i+1}</span><b>{r.display_name||r.username}</b><em>{minutesLabel(r.minutes)}</em><strong>{r.xp} XP</strong></div>)}{!rows.length&&<p>No leaderboard data yet.</p>}</section>}
function HouseCup({compact}){return <section className={compact?"house compact":"page house"}><h2>🏆 House Cup</h2><p>Season ends in 12d 0h</p>{HOUSES.map(h=><div className={`house-row ${h.color}`} key={h.name}><Shield/><b>{h.name}</b><span>{h.pts} pts</span></div>)}{!compact&&<p>Choose NITH, SCAUR or CAIRN in Settings.</p>}</section>}
function Friends({user,friends,reload,notify}){const [email,setEmail]=useState("");async function add(){const {data:p}=await supabase.from("profiles").select("*").eq("email",email.trim()).maybeSingle();if(!p){notify("No user found.");return}const {error}=await supabase.from("friends").insert({requester:user.id,receiver:p.id,status:"accepted"});if(error){notify(error.message);return}notify("Friend added.");setEmail("");reload()}return <section className="page"><h1>Friends</h1><div className="inline"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Friend email"/><button onClick={add}>Add</button></div>{friends.map(f=><div className="friend" key={f.id}>👥 {f.friend_email||"Friend"}</div>)}</section>}
function Shop(){return <section className="page"><h1>Shop</h1><div className="shop-grid"><ShopItem icon="🧊" name="Streak Freeze" price="50 coins"/><ShopItem icon="🧪" name="Double XP Potion" price="37 gems"/><ShopItem icon="👑" name="Royal Badge" price="120 coins"/></div></section>}
function ShopItem({icon,name,price}){return <div className="shop"><span>{icon}</span><b>{name}</b><p>{price}</p><button>Buy</button></div>}
function AI({stats,sessions,profile}){const [q,setQ]=useState(""),[answer,setAnswer]=useState(""),[busy,setBusy]=useState(false);async function ask(prompt){const question=prompt||q||"Make me a revision plan.";setBusy(true);try{const res=await fetch("/api/ai-study-coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,stats,recentSessions:sessions.slice(0,20),profile})});const data=await res.json();setAnswer(data.answer||"Try again.")}catch{setAnswer("AI could not respond right now.")}setBusy(false)}return <section className="page ai"><h1>AI Study Coach 🤖</h1><div className="quick"><button onClick={()=>ask("Make me a revision plan for Biology, Maths, Physics and Chemistry")}>Weekly Plan</button><button onClick={()=>ask("Which subject am I neglecting?")}>Weak Spots</button><button onClick={()=>ask("How do I keep my streak?")}>Streak Advice</button></div><div className="ai-chat"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask anything about studying..." onKeyDown={e=>{if(e.key==="Enter")ask()}}/><button onClick={()=>ask()}><Send/>Ask</button></div><pre>{busy?"Thinking...":answer||"Ask your AI coach for revision tips."}</pre>{answer&&<button onClick={()=>copyText(answer)}><Copy/>Copy</button>}</section>}
function Stats({stats,sessions}){return <section className="page"><h1>Stats</h1><div className="stats-grid"><Metric icon="🔥" value={stats.streak} label="Streak"/><Metric icon="⚡" value={stats.xp} label="XP"/><Metric icon="🕒" value={minutesLabel(stats.total)} label="Total Study"/></div>{SUBJECTS.map(s=>{const m=sessions.filter(x=>x.subject===s.id).reduce((a,x)=>a+Number(x.minutes||0),0);return <div className="subject-stat" key={s.id}><b>{s.id}</b><Progress value={Math.min(100,m/300*100)}/><span>{minutesLabel(m)}</span></div>})}</section>}
function SettingsPage({profile,setProfile,notify,theme,setTheme}){const [name,setName]=useState(profile?.display_name||""),[house,setHouse]=useState(profile?.house||"NITH");async function save(){const {data,error}=await supabase.from("profiles").update({display_name:name,house}).eq("id",profile.id).select("*").single();if(error){notify(error.message);return}setProfile(data);notify("Settings saved.")}return <section className="page"><h1>Settings</h1><label>Display Name</label><input value={name} onChange={e=>setName(e.target.value)}/><label>House</label><select value={house} onChange={e=>setHouse(e.target.value)}><option>NITH</option><option>SCAUR</option><option>CAIRN</option></select><button onClick={save}>Save</button><button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>Switch Theme</button></section>}

createRoot(document.getElementById("root")).render(<App/>);
