
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  Home, Brain, Timer, Trophy, Shield, Users, Store, Bot, BarChart3, Settings,
  Bell, Star, Leaf, Calculator, Atom, FlaskConical, LogOut, Sun, Moon, Send,
  Copy, CheckCircle2, Target, X, Search, UserRound, Palette, Play, Pause,
  Square, Award, Gift, Swords, School, CalendarDays, Crown, Sparkles
} from "lucide-react";
import "./styles.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

const LEVELS = ["National 5", "Higher", "Advanced Higher"];
const HOUSES = ["NITH", "SCAUR", "CAIRN"];
const SCHOOLS = [
  "Wallace Hall Academy",
  "Dumfries High School",
  "Sanquhar Academy",
  "St Joseph's College",
  "Dalbeattie High School",
  "Annan Academy",
  "Lockerbie Academy",
  "Moffat Academy",
  "Castle Douglas High School",
  "Kirkcudbright Academy",
  "Other Scottish School"
];
const AVATARS = ["🦊", "🐼", "🐧", "🐸", "🐯", "🐻", "🐨", "🦁", "🐵", "🐰", "🦉", "🐺"];
const PETS = ["🦊", "🐣", "🐢", "🐲", "🦄", "🐉"];

const EXAMS_2026 = [
  { subject: "Biology", level: "National 5", date: "2026-05-12" },
  { subject: "Biology", level: "Higher", date: "2026-05-13" },
  { subject: "Biology", level: "Advanced Higher", date: "2026-05-19" },
  { subject: "Chemistry", level: "National 5", date: "2026-05-22" },
  { subject: "Chemistry", level: "Higher", date: "2026-05-18" },
  { subject: "Chemistry", level: "Advanced Higher", date: "2026-05-26" },
  { subject: "Physics", level: "National 5", date: "2026-05-05" },
  { subject: "Physics", level: "Higher", date: "2026-05-07" },
  { subject: "Physics", level: "Advanced Higher", date: "2026-05-21" },
  { subject: "Maths", level: "National 5", date: "2026-05-01" },
  { subject: "Maths", level: "Higher", date: "2026-04-30" },
  { subject: "Maths", level: "Advanced Higher", date: "2026-05-08" }
];

const SHOP = [
  { id: "double_xp", name: "Double XP Potion", icon: "🧪", costType: "gems", cost: 3, desc: "Next quiz or study timer earns double XP." },
  { id: "triple_xp", name: "Triple XP Potion", icon: "⚡", costType: "gems", cost: 8, desc: "Next quiz or study timer earns triple XP." },
  { id: "coin_charm", name: "Coin Charm", icon: "🪙", costType: "coins", cost: 50, desc: "Next reward earns double coins." },
  { id: "gem_finder", name: "Gem Finder", icon: "💎", costType: "coins", cost: 75, desc: "Next reward gives two bonus gems." },
  { id: "streak_shield", name: "Streak Shield", icon: "🛡️", costType: "gems", cost: 5, desc: "A cosmetic badge for your profile." },
  { id: "fox_costume", name: "Fox Costume", icon: "👑", costType: "coins", cost: 150, desc: "A royal mascot cosmetic." },
  { id: "house_banner", name: "House Banner", icon: "🏳️", costType: "coins", cost: 100, desc: "Show your house spirit." }
];

const TOPICS = {
  Biology: {
    icon: <Leaf />, color: "green",
    "National 5": [
      ["Cell Biology", "Cell structure, transport, DNA, enzymes, respiration and photosynthesis.", "Draw cells, compare diffusion/osmosis/active transport, practise enzyme graphs and explain DNA to protein."],
      ["Multicellular Organisms", "Specialised cells, tissues, organs, control, reproduction and inheritance.", "Use flowcharts for specialisation, revise control systems, practise genetics crosses and link structure to function."],
      ["Life On Earth", "Ecosystems, sampling, biodiversity, energy transfer, adaptation and human impact.", "Practise sampling calculations, food chains, adaptations and biodiversity data questions."]
    ],
    Higher: [
      ["DNA And The Genome", "DNA structure, replication, gene expression, mutations, evolution and genomics.", "Use diagrams for replication/expression, practise mutation effects and sequencing uses."],
      ["Metabolism And Survival", "Metabolic pathways, enzymes, respiration, photosynthesis and survival adaptations.", "Compare pathways, explain limiting factors and connect adaptations to survival."],
      ["Sustainability And Interdependence", "Food supply, plant growth, animal welfare, populations and biodiversity.", "Analyse population graphs, evaluate sustainability and practise extended responses."]
    ],
    "Advanced Higher": [
      ["Cells And Proteins", "Laboratory techniques, proteins, membranes, communication and signalling.", "Interpret protein data, revise signalling and evaluate experimental techniques."],
      ["Organisms And Evolution", "Field techniques, variation, selection, speciation and animal behaviour.", "Use examples for selection, compare behaviours and analyse field evidence."],
      ["Investigative Biology", "Planning, carrying out, analysing and evaluating biological investigations.", "Write aims, variables, uncertainty, graphs, conclusions and evaluations."]
    ]
  },
  Maths: {
    icon: <Calculator />, color: "blue",
    "National 5": [
      ["Expressions And Formulae", "Algebra, indices, surds, factorising, equations and formulae.", "Practise factorising, index rules, rearranging formulae and showing clear working."],
      ["Relationships", "Straight lines, graphs, quadratics, trigonometry and geometry.", "Sketch graphs, learn line formulae, practise trig and solve quadratics."],
      ["Applications", "Statistics, probability, vectors, percentages and problem solving.", "Practise units, rounding, charts, vectors and real-life questions."]
    ],
    Higher: [
      ["Expressions And Functions", "Functions, polynomials, logs, graphs and transformations.", "Practise notation, transformed graphs, log equations and polynomial factorising."],
      ["Relationships And Calculus", "Differentiation, integration, trigonometry and equations.", "Learn calculus rules, trig identities and connect answers to gradients/areas."],
      ["Applications", "Vectors, recurrence relations, optimisation and mathematical modelling.", "Write vector steps, practise recurrence and explain answers in context."]
    ],
    "Advanced Higher": [
      ["Methods In Algebra And Calculus", "Advanced algebra, integration, differentiation and differential equations.", "Practise long solutions, standard integrals, proof structure and logical steps."],
      ["Applications Of Algebra And Calculus", "Advanced modelling using calculus and algebra.", "Define variables, state assumptions and practise mixed exam questions."],
      ["Geometry, Proof And Systems", "Vectors, matrices, complex numbers, proof and systems.", "Use diagrams, matrix operations, Argand diagrams and proof structure."]
    ]
  },
  Physics: {
    icon: <Atom />, color: "purple",
    "National 5": [
      ["Dynamics And Space", "Velocity, acceleration, forces, energy, projectiles, satellites and space.", "Memorise relationships, practise motion graphs and draw force diagrams."],
      ["Electricity And Energy", "Circuits, power, heat, gas laws and conservation of energy.", "Practise circuits, energy equations, series/parallel and heat-transfer examples."],
      ["Waves And Radiation", "Wave properties, light, sound, EM spectrum, nuclear radiation and half-life.", "Use v=fλ, draw waves, compare radiation types and practise half-life."]
    ],
    Higher: [
      ["Our Dynamic Universe", "Motion, forces, energy, gravitation, relativity and cosmology.", "Practise vector motion, redshift, gravitation and space examples."],
      ["Particles And Waves", "Standard Model, nuclear reactions, waves, interference, spectra and photoelectric effect.", "Learn particle families, nuclear equations and spectra/photoelectric evidence."],
      ["Electricity", "Fields, circuits, capacitors, semiconductors and electrical principles.", "Practise capacitor graphs, fields, circuits and semiconductor explanations."],
      ["Researching Physics", "Uncertainty, graph analysis, practical skills and scientific reporting.", "Revise uncertainty, conclusions, improvements and graph gradients."]
    ],
    "Advanced Higher": [
      ["Rotational Motion And Astrophysics", "Angular motion, torque, gravitation, orbital motion and astrophysics.", "Compare linear/rotational motion and explain astrophysics evidence."],
      ["Quanta And Waves", "Quantum theory, wave-particle duality, interference and polarisation.", "Practise quantum calculations and explain evidence for duality."],
      ["Electromagnetism", "Fields, induction, circuits and electromagnetic applications.", "Draw fields, practise induction and link equations to meaning."],
      ["Investigating Physics", "Advanced investigation planning, data processing and evaluation.", "Plan methods, handle uncertainty, process data and evaluate limitations."]
    ]
  },
  Chemistry: {
    icon: <FlaskConical />, color: "orange",
    "National 5": [
      ["Chemical Changes And Structure", "Rates, atomic structure, bonding, formulae, acids and reaction quantities.", "Write formulae, balance equations, draw bonding and explain rates."],
      ["Nature's Chemistry", "Fuels, hydrocarbons, alcohols, acids, esters, fats and oils.", "Learn functional groups, naming, fuels and uses of esters/fats."],
      ["Chemistry In Society", "Metals, plastics, fertilisers, batteries, analysis and industry.", "Revise extraction, plastics, calculations and environmental impact."]
    ],
    Higher: [
      ["Chemical Changes And Structure", "Periodicity, bonding, energetics, rates, equilibrium and calculations.", "Practise enthalpy, equilibrium shifts, pH and bonding explanations."],
      ["Nature's Chemistry", "Organic chemistry, fuels, proteins, fats, oxidation and synthesis.", "Learn pathways, formulae, functional groups and oxidation."],
      ["Chemistry In Society", "Industrial chemistry, redox, batteries, analysis and materials.", "Practise redox, cells, analytical results and process evaluation."],
      ["Researching Chemistry", "Practical skills, uncertainty, chromatography, titration and reporting.", "Revise techniques, process results and explain uncertainty."]
    ],
    "Advanced Higher": [
      ["Inorganic Chemistry", "Electronic structure, transition metals, bonding and complexes.", "Practise configurations, colour, complex formation and bonding models."],
      ["Physical Chemistry", "Thermodynamics, kinetics, equilibrium, electrochemistry and analysis.", "Practise rate laws, K values, thermodynamics and cells."],
      ["Organic Chemistry", "Mechanisms, synthesis, stereochemistry and organic analysis.", "Draw mechanisms, plan synthesis and interpret spectra."],
      ["Instrumental Analysis", "Spectroscopy, chromatography, NMR, IR and MS.", "Match spectra to structures and justify conclusions."],
      ["Researching Chemistry", "Advanced research, planning, analysis, evaluation and reporting.", "Plan reliable experiments, manage risk/uncertainty and write evaluations."]
    ]
  }
};

function today(){ return new Date().toISOString().slice(0,10); }
function weekStart(){ const d=new Date(),day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return d.toISOString().slice(0,10); }
function minutesLabel(m){ m=Number(m||0); const h=Math.floor(m/60), mm=m%60; return h?`${h}h ${mm}m`:`${mm}m`; }
function levelFromXP(xp){ return Math.max(1,Math.floor(Math.sqrt(Number(xp||0)/80))+1); }
function safeName(email){ return (email||"student").split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").slice(0,18)||"student"; }
function titleCase(s){ return String(s||"").replace(/\b\w/g,c=>c.toUpperCase()); }
function boostName(id){ return SHOP.find(x=>x.id===id)?.name||id; }
function copyText(t){ navigator.clipboard?.writeText(String(t||"")); }
function calcStreak(sessions){ const days=[...new Set((sessions||[]).map(s=>s.session_date))].sort().reverse(); let st=0,d=new Date(today()+"T00:00:00"); for(let i=0;i<365;i++){ const k=d.toISOString().slice(0,10); if(days.includes(k)){ st++; d.setDate(d.getDate()-1); continue; } if(i===0){ d.setDate(d.getDate()-1); continue; } break; } return st; }
function averageScore(sessions){ const scored=sessions.map(s=>Number(s.score||0)).filter(Boolean); return scored.length?Math.round(scored.reduce((a,b)=>a+b,0)/scored.length):0; }
function daysUntil(dateStr){ const diff=new Date(dateStr+"T09:00:00")-new Date(); return Math.max(0,Math.ceil(diff/86400000)); }

function makeQuiz(subject, level, topic){
  const topicData = TOPICS[subject][level].find(t=>t[0]===topic) || [topic,"",""];
  const [title, summary, revise] = topicData;
  return [
    { q:`Which summary best matches ${title}?`, a:0, options:[summary,"This topic is not assessed.","This topic is only vocabulary.","This topic is unrelated to the course."] },
    { q:"What is the best first revision move?", a:1, options:["Guess answers quickly","Learn the key ideas, then practise questions","Only change your notes colour","Avoid mistakes completely"] },
    { q:`For ${level}, what improves marks most?`, a:2, options:["One-word answers","No working","Clear reasoning and exam-style practice","Leaving blanks"] },
    { q:"What should you do after a wrong answer?", a:0, options:["Find the mistake and retry a similar question","Ignore it","Delete the quiz","Change all answers randomly"] },
    { q:`Which method fits ${title}?`, a:3, options:["Only reading","Watching one clip only","Copying without thinking",revise] },
    { q:"What helps long-term memory?", a:1, options:["Cram once","Spaced repetition and active recall","Never reviewing","Only highlighting"] },
    { q:"What should a good study note contain?", a:2, options:["Everything copied","No headings","Short key points in your own words","Only emojis"] },
    { q:"What should you track after a quiz?", a:0, options:["Score and weak topic","Only your friend’s score","Nothing","Only the date"] },
    { q:"Why does the app mark the quiz?", a:3, options:["To let users fake XP","To hide mistakes","To make scores random","To give fair XP based on performance"] },
    { q:"What is the best next step after scoring below 7?", a:1, options:["Give up","Revise the topic summary and try again","Buy random items","Skip the subject forever"] }
  ].map((x,i)=>({...x,id:i+1}));
}

function App(){
  const [session,setSession]=useState(null),[loading,setLoading]=useState(true),[theme,setTheme]=useState(localStorage.getItem("rr_theme")||"light");
  useEffect(()=>{ document.body.dataset.theme=theme; localStorage.setItem("rr_theme",theme); },[theme]);
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)}); const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return()=>subscription.unsubscribe(); },[]);
  if(loading) return <div className="loading">Loading RevisionRoyale...</div>;
  if(!session) return <Auth theme={theme} setTheme={setTheme}/>;
  return <Game user={session.user} theme={theme} setTheme={setTheme}/>;
}

function Auth({theme,setTheme}){
  const [mode,setMode]=useState("login"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[username,setUsername]=useState(""),[school,setSchool]=useState(SCHOOLS[0]),[house,setHouse]=useState("NITH"),[msg,setMsg]=useState("");
  async function submit(){
    setMsg("");
    const result=mode==="login"
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password,options:{data:{username:username||safeName(email),school,house,avatar:"🦊",pet:"🦊"}}});
    if(result.error) setMsg(result.error.message);
    else if(mode==="signup") setMsg("Account created. Check your email if needed, then log in.");
  }
  return <main className="auth-v7">
    <section className="welcome-side">
      <div className="floating">🦊</div>
      <h1>Study. Quiz. Level Up.</h1>
      <p>Join your school, take real marked quizzes, use the study timer, earn rewards and compete in the House Cup.</p>
      <div className="bubble-row"><span>🔥 Streaks</span><span>📝 Quizzes</span><span>⏱️ Timer</span><span>🎁 Daily Chest</span></div>
    </section>
    <section className="auth-card-v7">
      <div className="logo wide"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
      <h2>{mode==="login"?"Welcome Back":"Create Your Account"}</h2>
      <div className="auth-tabs"><button className={mode==="login"?"on":""} onClick={()=>setMode("login")}>Login</button><button className={mode==="signup"?"on":""} onClick={()=>setMode("signup")}>Sign Up</button></div>
      {msg&&<div className="notice">{msg}</div>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      {mode==="signup"&&<>
        <input placeholder="Username, e.g. Baker07" value={username} onChange={e=>setUsername(e.target.value)}/>
        <select value={school} onChange={e=>setSchool(e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select>
        <select value={house} onChange={e=>setHouse(e.target.value)}>{HOUSES.map(h=><option key={h}>{h}</option>)}</select>
      </>}
      <button className="big" onClick={submit}>{mode==="login"?"Enter RevisionRoyale":"Create My Account"}</button>
      <button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon/>:<Sun/>} Switch Theme</button>
    </section>
  </main>;
}

function Game({user,theme,setTheme}){
  const [page,setPage]=useState("home"),[profile,setProfile]=useState(null),[sessions,setSessions]=useState([]),[friends,setFriends]=useState([]),[subject,setSubject]=useState(localStorage.getItem("rr_subject")||"Biology"),[courseLevel,setCourseLevel]=useState(localStorage.getItem("rr_level")||"Higher"),[toast,setToast]=useState(""),[notifs,setNotifs]=useState(false),[loading,setLoading]=useState(true);
  useEffect(()=>localStorage.setItem("rr_subject",subject),[subject]);
  useEffect(()=>localStorage.setItem("rr_level",courseLevel),[courseLevel]);
  function notify(t){ setToast(t); setTimeout(()=>setToast(""),2800); }
  async function ensureProfile(){
    let {data:p}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
    if(!p){
      const md=user.user_metadata||{},username=md.username||safeName(user.email);
      const {data:newP}=await supabase.from("profiles").insert({id:user.id,email:user.email,username,display_name:username,school:md.school||SCHOOLS[0],house:md.house||"NITH",avatar:md.avatar||"🦊",pet:md.pet||"🦊",coins:0,gems:0,active_boost:null,last_chest:null}).select("*").single();
      p=newP;
    }
    return p;
  }
  async function load(){
    setLoading(true);
    const p=await ensureProfile();
    const [s,f]=await Promise.all([
      supabase.from("study_sessions").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
      supabase.from("friends_view").select("*").or(`requester.eq.${user.id},receiver.eq.${user.id}`)
    ]);
    setProfile(p); setSessions(s.data||[]); setFriends(f.data||[]); setLoading(false);
  }
  useEffect(()=>{load()},[]);
  const stats=useMemo(()=>{const xp=sessions.reduce((a,s)=>a+Number(s.xp||0),0),todayS=sessions.filter(s=>s.session_date===today()),week=sessions.filter(s=>s.session_date>=weekStart());return{xp,levelNum:levelFromXP(xp),coins:Number(profile?.coins||0),gems:Number(profile?.gems||0),activeBoost:profile?.active_boost||"",streak:calcStreak(sessions),total:sessions.reduce((a,s)=>a+Number(s.minutes||0),0),todayMinutes:todayS.reduce((a,s)=>a+Number(s.minutes||0),0),todayCount:todayS.length,week:week.reduce((a,s)=>a+Number(s.minutes||0),0),avgScore:averageScore(sessions)}} ,[sessions,profile]);
  if(loading) return <div className="loading">Loading Your Study Hub...</div>;
  const notifications=[`You have a ${stats.streak} day streak.`,stats.activeBoost?`${boostName(stats.activeBoost)} is active.`:"No boost active.",`Balance: ${stats.coins} coins and ${stats.gems} gems.`];
  return <div className="shell">
    <aside className="sidebar">
      <div className="logo sidebar-logo"><Fox tiny/><h1>Revision<span>Royale</span></h1></div>
      <Nav page={page} setPage={setPage} id="home" icon={<Home/>} label="Home"/>
      <Nav page={page} setPage={setPage} id="quiz" icon={<Brain/>} label="Quiz"/>
      <Nav page={page} setPage={setPage} id="timer" icon={<Timer/>} label="Timer"/>
      <Nav page={page} setPage={setPage} id="quests" icon={<Target/>} label="Quests"/>
      <Nav page={page} setPage={setPage} id="leaderboard" icon={<Trophy/>} label="Leaderboard"/>
      <Nav page={page} setPage={setPage} id="battles" icon={<Swords/>} label="Battles"/>
      <Nav page={page} setPage={setPage} id="house" icon={<Shield/>} label="House"/>
      <Nav page={page} setPage={setPage} id="friends" icon={<Users/>} label="Friends"/>
      <Nav page={page} setPage={setPage} id="shop" icon={<Store/>} label="Shop"/>
      <Nav page={page} setPage={setPage} id="character" icon={<UserRound/>} label="Character"/>
      <Nav page={page} setPage={setPage} id="ai" icon={<Bot/>} label="AI Coach"/>
      <Nav page={page} setPage={setPage} id="stats" icon={<BarChart3/>} label="Stats"/>
      <Nav page={page} setPage={setPage} id="settings" icon={<Settings/>} label="Settings"/>
      <ProfileCard profile={profile} stats={stats}/>
      <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut/> Sign Out</button>
    </aside>
    <main className="main">
      <PageHeader title={pageTitle(page)} profile={profile} stats={stats} theme={theme} setTheme={setTheme} setNotifs={setNotifs}/>
      {toast&&<div className="toast">{toast}</div>}
      {notifs&&<Modal title="Notifications" close={()=>setNotifs(false)}>{notifications.map(n=><div className="topic-row" key={n}><Bell size={18}/><span>{n}</span></div>)}</Modal>}
      {page==="home"&&<HomePage stats={stats} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} setPage={setPage} profile={profile} reload={load} notify={notify}/>}
      {page==="quiz"&&<QuizPage user={user} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} reload={load} notify={notify} profile={profile}/>}
      {page==="timer"&&<StudyTimer user={user} subject={subject} setSubject={setSubject} courseLevel={courseLevel} setCourseLevel={setCourseLevel} reload={load} notify={notify} profile={profile}/>}
      {page==="quests"&&<Quests stats={stats} subject={subject} courseLevel={courseLevel} setPage={setPage}/>}
      {page==="leaderboard"&&<Leaderboards profile={profile} friends={friends}/>}
      {page==="battles"&&<Battles profile={profile} stats={stats}/>}
      {page==="house"&&<HouseCup school={profile?.school}/>}
      {page==="friends"&&<Friends user={user} friends={friends} reload={load} notify={notify}/>}
      {page==="shop"&&<Shop profile={profile} reload={load} notify={notify}/>}
      {page==="character"&&<Character profile={profile} setProfile={setProfile} notify={notify}/>}
      {page==="ai"&&<AI stats={stats} sessions={sessions} profile={profile} subject={subject} courseLevel={courseLevel}/>}
      {page==="stats"&&<Stats stats={stats} sessions={sessions}/>}
      {page==="settings"&&<SettingsPage profile={profile} setProfile={setProfile} notify={notify} theme={theme} setTheme={setTheme}/>}
    </main>
  </div>;
}

function pageTitle(p){return({home:"Study Hub",quiz:"Topic Quiz",timer:"Study Timer",quests:"Daily Quests",leaderboard:"Leaderboards",battles:"Battles",house:"House Cup",friends:"Friends",shop:"Boost Shop",character:"Customise Character",ai:"AI Study Coach",stats:"Progress Stats",settings:"Settings"}[p]||titleCase(p));}
function Fox({tiny}){return <div className={tiny?"fox tiny":"fox"}><span className="crown">👑</span><span className="face">🦊</span></div>;}
function Nav({page,setPage,id,icon,label}){return <button className={`nav ${page===id?"active":""}`} onClick={()=>setPage(id)}>{React.cloneElement(icon,{size:20})}<span>{label}</span></button>;}
function ProfileCard({profile,stats}){return <div className="player"><div className="avatar-big">{profile?.avatar||"🦊"}</div><b>@{profile?.username||"Student"}</b><span>{profile?.school||"School"}</span><small>{profile?.house||"NITH"} · Level {stats.levelNum}</small><div className="bar"><i style={{width:`${Math.min(100,(stats.xp%800)/8)}%`}}/></div><small>{stats.xp%800}/800 XP</small><div className="wallet"><span>🪙 {stats.coins}</span><span>💎 {stats.gems}</span></div></div>;}
function PageHeader({title,profile,stats,theme,setTheme,setNotifs}){return <header className="page-head"><div><h1>{title}</h1><p>{profile?.school||"Your School"} · {profile?.house||"NITH"} House</p></div><div className="header-actions"><span className="chip">🔥 {stats.streak}</span><span className="chip">🪙 {stats.coins}</span><span className="chip">💎 {stats.gems}</span><button className="circle" onClick={()=>setNotifs(true)}><Bell size={18}/></button><button className="circle" onClick={()=>setTheme(theme==="light"?"dark":"light")}>{theme==="light"?<Moon size={18}/>:<Sun size={18}/>}</button><span className="mini-avatar">{profile?.avatar||"🦊"}</span></div></header>;}

function HomePage({stats,subject,setSubject,courseLevel,setCourseLevel,setPage,profile,reload,notify}){
  return <div className="home-grid">
    <section className="hero"><div><h1>Study Smarter. Score Higher.</h1><p>Take marked quizzes, use the study timer, unlock rewards and climb your school leaderboard.</p><div className="hero-actions"><button onClick={()=>setPage("quiz")}><Brain/> Take Quiz</button><button className="alt" onClick={()=>setPage("timer")}><Timer/> Start Timer</button></div></div><PetFox profile={profile} stats={stats}/></section>
    <DailyChest profile={profile} reload={reload} notify={notify}/>
    <section className="card selectors"><div><h2>Choose Subject</h2><SubjectPicker subject={subject} setSubject={setSubject}/></div><div><h2>Choose Level</h2><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/></div></section>
    <TopicMap subject={subject} courseLevel={courseLevel} setPage={setPage} stats={stats}/>
    <ExamCountdown subject={subject} courseLevel={courseLevel}/>
    <Activity stats={stats}/>
  </div>;
}

function PetFox({profile,stats}){let mood="📚"; if(stats.streak>=7)mood="🔥"; if(stats.xp>=2000)mood="🏆"; if(stats.todayCount===0)mood="😴"; return <div className="pet-fox"><span>{profile?.pet||profile?.avatar||"🦊"}</span><b>{mood}</b><small>{stats.streak>=7?"Streak Mode":stats.todayCount>0?"Studying":"Ready To Start"}</small></div>;}
function DailyChest({profile,reload,notify}){const canClaim=profile?.last_chest!==today(); async function claim(){if(!canClaim){notify("Daily Chest Already Claimed.");return}const coins=75,gems=1;const{error}=await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,last_chest:today()}).eq("id",profile.id);if(error){notify(error.message);return}notify(`Daily Chest: ${coins} Coins And ${gems} Gem.`);reload()}return <section className="quest-card chest-card"><h2>🎁 Daily Chest</h2><p>{canClaim?"Claim Today’s Reward.":"Come Back Tomorrow For Another Reward."}</p><button onClick={claim}><Gift/> {canClaim?"Claim Chest":"Claimed"}</button></section>;}
function SubjectPicker({subject,setSubject}){return <div className="subject-grid">{Object.entries(TOPICS).map(([name,s])=><button key={name} className={`subject ${s.color} ${subject===name?"selected":""}`} onClick={()=>setSubject(name)}>{React.cloneElement(s.icon,{size:22})}<b>{name}</b></button>)}</div>;}
function LevelPicker({courseLevel,setCourseLevel}){return <div className="level-grid">{LEVELS.map(l=><button key={l} className={courseLevel===l?"level selected":"level"} onClick={()=>setCourseLevel(l)}>{l}</button>)}</div>;}
function Progress({value}){return <div className="progress"><i style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>;}

function TopicMap({subject,courseLevel,setPage,stats}){const[open,setOpen]=useState(false),[selected,setSelected]=useState(null),course=TOPICS[subject],topics=course[courseLevel];return <section className="card map-card"><div className="head"><h2>{courseLevel} {subject} Learning Path</h2><button onClick={()=>setOpen(true)}>View Topics ›</button></div><div className="path-map">{topics.map(([title,summary,revise],i)=><button className={`path-node ${course.color} node-${i%5}`} key={title} onClick={()=>setSelected({title,summary,revise,i})}><span>{stats.avgScore>=8?<Award/>:<Star/>}</span><b>{title}</b><small>{stats.avgScore>=8?"Gold Path":"Tap To Learn"}</small></button>)}</div>{open&&<Modal title={`${courseLevel} ${subject} Topics`} close={()=>setOpen(false)}>{topics.map(([t,s,r],i)=><div className="topic-row clickable" key={t} onClick={()=>setSelected({title:t,summary:s,revise:r,i})}><b>{i+1}</b><div><strong>{t}</strong><p>{s}</p></div></div>)}</Modal>}{selected&&<Modal title={selected.title} close={()=>setSelected(null)}><p className="summary">{selected.summary}</p><div className="study-tips"><h3>Best Revision Method</h3><p>{selected.revise}</p><div className="modal-actions"><button onClick={()=>{setSelected(null);setPage("quiz")}}><Brain/> Take Quiz</button><button className="alt" onClick={()=>{setSelected(null);setPage("timer")}}><Timer/> Study Timer</button></div></div></Modal>}</section>;}
function ExamCountdown({subject,courseLevel}){const exam=EXAMS_2026.find(e=>e.subject===subject&&e.level===courseLevel);return <section className="card exam-card"><CalendarDays/><div><h2>{courseLevel} {subject} Exam Countdown</h2><p>{exam?`${daysUntil(exam.date)} Days Remaining · ${exam.date}`:"Add Your Exam Date In Settings Later."}</p></div></section>;}
function Modal({title,close,children}){return <div className="modal-back" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={close}><X/></button><h2>{title}</h2>{children}</div></div>;}
function Activity({stats}){return <section className="card activity"><div className="head"><h2>📅 Today’s Activity</h2></div><div className="activity-grid"><Mini icon="📝" label="Sessions Today" value={`${stats.todayCount}`} goal="Goal: 3" pct={Math.min(100,stats.todayCount/3*100)}/><Mini icon="🎯" label="Average Score" value={`${stats.avgScore}/10`} goal="Aim For 8+" pct={Math.min(100,stats.avgScore*10)}/><Mini icon="⏱️" label="Study Time" value={minutesLabel(stats.todayMinutes)} goal="Timer XP" pct={Math.min(100,stats.todayMinutes/120*100)}/></div></section>;}
function Mini({icon,label,value,goal,pct}){return <div className="mini"><span>{icon}</span><div><small>{label}</small><b>{value}</b><em>{goal}</em><Progress value={pct}/></div></div>;}

function QuizPage({user,subject,setSubject,courseLevel,setCourseLevel,reload,notify,profile}){
  const [topic,setTopic]=useState(TOPICS[subject][courseLevel][0][0]),[answers,setAnswers]=useState({}),[result,setResult]=useState(null),[saved,setSaved]=useState(false);
  useEffect(()=>{setTopic(TOPICS[subject][courseLevel][0][0]);setAnswers({});setResult(null);setSaved(false)},[subject,courseLevel]);
  const questions=useMemo(()=>makeQuiz(subject,courseLevel,topic),[subject,courseLevel,topic]);
  function mark(){const score=questions.reduce((a,q)=>a+(Number(answers[q.id])===q.a?1:0),0);setResult(score);setSaved(false);}
  async function save(){if(result===null){notify("Complete And Mark The Quiz First.");return}let xp=result*20,coins=Math.max(1,result*3),gems=result>=9?2:result>=7?1:0;if(profile?.active_boost==="double_xp")xp*=2;if(profile?.active_boost==="triple_xp")xp*=3;if(profile?.active_boost==="coin_charm")coins*=2;if(profile?.active_boost==="gem_finder")gems+=2;const{error}=await supabase.from("study_sessions").insert({user_id:user.id,subject,minutes:10,xp,score:result,notes:`Quiz: ${topic}`,check_in:`${courseLevel} · ${topic} · Quiz Score ${result}/10`,session_date:today(),session_type:"quiz"});if(error){notify(error.message);return}await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,active_boost:null}).eq("id",user.id);setSaved(true);notify(`Quiz Saved: ${result}/10 · ${xp} XP · ${coins} Coins · ${gems} Gems`);reload();}
  return <section className="page quiz-page"><h1>10-Question Topic Quiz</h1><p className="summary">The app marks the quiz and awards XP from the score. Students do not choose their own score.</p><SubjectPicker subject={subject} setSubject={setSubject}/><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/><label>Topic</label><select value={topic} onChange={e=>{setTopic(e.target.value);setAnswers({});setResult(null);setSaved(false)}}>{TOPICS[subject][courseLevel].map(([t])=><option key={t}>{t}</option>)}</select><div className="quiz-list">{questions.map(q=><div className="question" key={q.id}><h3>{q.id}. {q.q}</h3>{q.options.map((op,i)=><label className={`option ${Number(answers[q.id])===i?"picked":""}`} key={`${q.id}-${i}`}><input type="radio" name={`q${q.id}`} checked={Number(answers[q.id])===i} onChange={()=>setAnswers({...answers,[q.id]:i})}/>{op}</label>)}</div>)}</div><div className="quiz-actions"><button onClick={mark}><CheckCircle2/> Mark Quiz</button>{result!==null&&<button className="green" onClick={save} disabled={saved}><Sparkles/> {saved?"Saved":"Save And Earn XP"}</button>}</div>{result!==null&&<div className="result-card"><h2>Your Score: {result}/10</h2><p>{result>=9?"Excellent. Maximum rewards unlocked.":result>=7?"Strong result. Keep building.":result>=4?"Good attempt. Revise weak points and retry.":"Revise the topic summary, then try again."}</p><b>Base XP: {result*20}</b></div>}</section>;
}

function StudyTimer({user,subject,setSubject,courseLevel,setCourseLevel,reload,notify,profile}){
  const [running,setRunning]=useState(false),[seconds,setSeconds]=useState(0),[notes,setNotes]=useState("");
  useEffect(()=>{if(!running)return;const t=setInterval(()=>setSeconds(s=>Math.min(s+1,36000)),1000);return()=>clearInterval(t)},[running]);
  const minutes=Math.max(1,Math.floor(seconds/60)); const projectedXP=Math.round(minutes*(200/60));
  async function save(){let xp=projectedXP,coins=Math.max(1,Math.floor(xp/15)),gems=minutes>=60?1:0;if(profile?.active_boost==="double_xp")xp*=2;if(profile?.active_boost==="triple_xp")xp*=3;if(profile?.active_boost==="coin_charm")coins*=2;if(profile?.active_boost==="gem_finder")gems+=2;const{error}=await supabase.from("study_sessions").insert({user_id:user.id,subject,minutes,xp,score:null,notes,check_in:`${courseLevel} · Study Timer · ${minutes} minutes`,session_date:today(),session_type:"timer"});if(error){notify(error.message);return}await supabase.from("profiles").update({coins:Number(profile?.coins||0)+coins,gems:Number(profile?.gems||0)+gems,active_boost:null}).eq("id",user.id);notify(`Study Saved: ${minutes} Min · ${xp} XP · ${coins} Coins · ${gems} Gems`);setRunning(false);setSeconds(0);setNotes("");reload();}
  return <section className="page timer-page"><h1>Study Timer</h1><p className="summary">Timer XP scales with study time: 200 XP per hour, proportional from 1 minute up to 10 hours.</p><SubjectPicker subject={subject} setSubject={setSubject}/><LevelPicker courseLevel={courseLevel} setCourseLevel={setCourseLevel}/><div className="timer-card"><span>{profile?.avatar||"🦊"}</span><b>{String(Math.floor(seconds/3600)).padStart(2,"0")}:{String(Math.floor(seconds/60)%60).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</b><p>Projected XP: {projectedXP}</p><div className="timer-buttons">{!running?<button onClick={()=>setRunning(true)}><Play/> Start</button>:<button onClick={()=>setRunning(false)}><Pause/> Pause</button>}<button className="plain" onClick={()=>{setRunning(false);setSeconds(0)}}><Square/> Reset</button></div></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What did you study?"/><button className="green" onClick={save}><CheckCircle2/> Save Study Time And Earn XP</button></section>;
}

function Quests({stats,subject,courseLevel,setPage}){return <section className="page"><h1>Daily Quests</h1><Quest title={`Complete 2 ${courseLevel} ${subject} Quizzes`} progress={Math.min(stats.todayCount,2)} goal={2}/><Quest title="Score 7 Or Higher In A Quiz" progress={stats.avgScore>=7?1:0} goal={1}/><Quest title="Use The Study Timer Today" progress={stats.todayMinutes>0?1:0} goal={1}/><div className="actions"><button onClick={()=>setPage("quiz")}><Brain/> Take Quiz</button><button className="alt" onClick={()=>setPage("timer")}><Timer/> Study Timer</button></div></section>;}
function Quest({title,progress,goal}){return <div className="quest"><Target/><div><b>{title}</b><Progress value={Math.min(100,progress/goal*100)}/><small>{progress}/{goal} · Reward Available</small></div></div>;}

function Leaderboards({profile,friends}){const[tab,setTab]=useState("school"),[rows,setRows]=useState([]);useEffect(()=>{let q=supabase.from("leaderboard_weekly").select("*").limit(50);if(tab==="school")q=q.eq("school",profile?.school||"");if(tab==="house")q=q.eq("school",profile?.school||"").eq("house",profile?.house||"");q.then(({data})=>setRows(data||[]));},[tab,profile?.school,profile?.house]);return <section className="page"><h1>Leaderboards</h1><div className="tabs"><button className={tab==="school"?"on":""} onClick={()=>setTab("school")}><School/> School</button><button className={tab==="house"?"on":""} onClick={()=>setTab("house")}><Shield/> House</button><button className={tab==="global"?"on":""} onClick={()=>setTab("global")}><Trophy/> Global</button></div>{rows.map((r,i)=><div className="leader" key={r.user_id}><span>#{i+1}</span><b>@{r.username}</b><em>{minutesLabel(r.minutes)}</em><strong>{r.xp} XP</strong></div>)}{!rows.length&&<p>No leaderboard data yet.</p>}</section>;}
function Battles({profile,stats}){return <section className="page"><h1>Weekly Battles</h1><div className="battle-card"><Swords/><div><h2>Friend Streak Battle</h2><p>You: {stats.streak} Days · Rival: 0 Days</p><b>Winner Reward: 200 XP + 25 Coins</b></div></div><SchoolBattle profile={profile}/></section>;}
function SchoolBattle({profile}){const[rows,setRows]=useState([]);useEffect(()=>{supabase.from("leaderboard_weekly").select("school,xp").limit(200).then(({data})=>{const map={};(data||[]).forEach(r=>{map[r.school]=(map[r.school]||0)+Number(r.xp||0)});setRows(Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8));});},[]);return <div className="battle-card"><School/><div><h2>School Vs School</h2>{rows.map(([school,xp])=><p key={school}>{school}: <b>{xp} XP</b></p>)}{!rows.length&&<p>No school battle data yet.</p>}</div></div>;}
function HouseCup({school}){const[rows,setRows]=useState([]);useEffect(()=>{supabase.from("house_leaderboard").select("*").eq("school",school||"").then(({data})=>setRows(data||[]))},[school]);const all=HOUSES.map((h,i)=>rows.find(r=>r.house===h)||{house:h,xp:0,color:["red","blue","green"][i]});return <section className="page house"><h1>🏆 House Cup</h1><p>House points start at 0 and rise when students earn XP.</p>{all.map((h,i)=><div className={`house-row ${["red","blue","green"][i]}`} key={h.house}><Shield/><b>{h.house}</b><span>{h.xp||0} Pts</span></div>)}</section>;}
function Friends({user,friends,reload,notify}){const[query,setQuery]=useState(""),[results,setResults]=useState([]);async function search(){const q=query.trim();if(!q)return;const{data}=await supabase.from("profiles").select("id,username,display_name,school").ilike("username",`%${q}%`).limit(8);setResults((data||[]).filter(p=>p.id!==user.id))}async function add(p){const{error}=await supabase.from("friends").insert({requester:user.id,receiver:p.id,status:"accepted"});if(error){notify(error.message);return}notify(`Added @${p.username}`);setResults([]);setQuery("");reload()}return <section className="page"><h1>Friends</h1><p>Search by username. School is shown so you know who you are adding.</p><div className="inline"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search username, e.g. Baker07"/><button onClick={search}><Search/>Search</button></div>{results.map(p=><div className="friend" key={p.id}><b>@{p.username}</b><span>{p.school}</span><button onClick={()=>add(p)}>Add</button></div>)}<h2>Your Friends</h2>{friends.map(f=><div className="friend" key={f.id}>👥 {f.friend_username?`@${f.friend_username}`:f.friend_email||"Friend"}</div>)}</section>;}
function Shop({profile,reload,notify}){async function buy(item){if(profile?.active_boost){notify("Use Your Current Boost Before Buying Another.");return}const coins=Number(profile?.coins||0),gems=Number(profile?.gems||0);if(item.costType==="coins"&&coins<item.cost){notify("You Don't Have Enough Coins.");return}if(item.costType==="gems"&&gems<item.cost){notify("You Don't Have Enough Gems.");return}const patch={active_boost:item.id};if(item.costType==="coins")patch.coins=coins-item.cost;else patch.gems=gems-item.cost;const{error}=await supabase.from("profiles").update(patch).eq("id",profile.id);if(error){notify(error.message);return}notify(`${item.name} Activated.`);reload()}return <section className="page"><h1>Boost Shop</h1><p>Your Balance: 🪙 {profile?.coins||0} Coins · 💎 {profile?.gems||0} Gems</p>{profile?.active_boost&&<div className="notice good">Active Boost: {boostName(profile.active_boost)}</div>}<div className="shop-grid">{SHOP.map(item=><div className="shop" key={item.id}><span>{item.icon}</span><b>{item.name}</b><p>{item.desc}</p><strong>{item.cost} {titleCase(item.costType)}</strong><button onClick={()=>buy(item)}>Buy And Activate</button></div>)}</div></section>;}
function Character({profile,setProfile,notify}){const[avatar,setAvatar]=useState(profile?.avatar||"🦊"),[pet,setPet]=useState(profile?.pet||"🦊");async function save(){const{data,error}=await supabase.from("profiles").update({avatar,pet}).eq("id",profile.id).select("*").single();if(error){notify(error.message);return}setProfile(data);notify("Character Saved.")}return <section className="page character"><h1>Customise Character</h1><div className="character-preview">{avatar} {pet}</div><h2>Avatar</h2><div className="avatar-grid">{AVATARS.map(a=><button key={a} className={avatar===a?"avatar-choice selected":"avatar-choice"} onClick={()=>setAvatar(a)}>{a}</button>)}</div><h2>Pet</h2><div className="avatar-grid">{PETS.map(a=><button key={a} className={pet===a?"avatar-choice selected":"avatar-choice"} onClick={()=>setPet(a)}>{a}</button>)}</div><button onClick={save}><Palette/>Save Character</button></section>;}
function AI({stats,sessions,profile,subject,courseLevel}){const[q,setQ]=useState(""),[answer,setAnswer]=useState(""),[busy,setBusy]=useState(false);async function ask(prompt){const question=prompt||q||`Make me a ${courseLevel} ${subject} revision plan using my weak topics, quiz score, timer study time and streak.`;setBusy(true);try{const res=await fetch("/api/ai-study-coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,stats,recentSessions:sessions.slice(0,20),profile,subject,level:courseLevel})});const data=await res.json();setAnswer(data.answer||"Try Again.")}catch{setAnswer("AI Could Not Respond Right Now.")}setBusy(false)}return <section className="page ai"><h1>AI Study Coach 🤖</h1><div className="quick"><button onClick={()=>ask(`Make me a ${courseLevel} ${subject} plan based on my weakest quiz scores.`)}>Revision Plan</button><button onClick={()=>ask("Which topic should I improve next?")}>Weak Topics</button><button onClick={()=>ask("Make me a 7-day streak plan.")}>Streak Plan</button></div><div className="ai-chat"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask anything about studying..." onKeyDown={e=>{if(e.key==="Enter")ask()}}/><button onClick={()=>ask()}><Send/>Ask</button></div><pre>{busy?"Thinking...":answer||"Ask your AI coach for revision tips."}</pre>{answer&&<button onClick={()=>copyText(answer)}><Copy/>Copy</button>}</section>;}
function Stats({stats,sessions}){return <section className="page"><h1>Progress Stats</h1><div className="stats-grid"><div className="stat-tile"><b>🔥</b><strong>{stats.streak}</strong><span>Streak</span></div><div className="stat-tile"><b>⚡</b><strong>{stats.xp}</strong><span>Total XP</span></div><div className="stat-tile"><b>🎯</b><strong>{stats.avgScore}/10</strong><span>Average Quiz Score</span></div><div className="stat-tile"><b>⏱️</b><strong>{minutesLabel(stats.total)}</strong><span>Total Study Time</span></div></div>{Object.keys(TOPICS).map(s=>{const xp=sessions.filter(x=>x.subject===s).reduce((a,x)=>a+Number(x.xp||0),0);return <div className="subject-stat" key={s}><b>{s}</b><Progress value={Math.min(100,xp/800*100)}/><span>{xp} XP</span></div>})}</section>;}
function SettingsPage({profile,setProfile,notify,theme,setTheme}){const[name,setName]=useState(profile?.display_name||""),[username,setUsername]=useState(profile?.username||""),[school,setSchool]=useState(profile?.school||SCHOOLS[0]),[house,setHouse]=useState(profile?.house||"NITH");async function save(){const{data,error}=await supabase.from("profiles").update({display_name:name,username,school,house}).eq("id",profile.id).select("*").single();if(error){notify(error.message);return}setProfile(data);notify("Settings Saved.")}return <section className="page"><h1>Settings</h1><label>Display Name</label><input value={name} onChange={e=>setName(e.target.value)}/><label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)}/><label>School</label><select value={school} onChange={e=>setSchool(e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select><label>House</label><select value={house} onChange={e=>setHouse(e.target.value)}>{HOUSES.map(h=><option key={h}>{h}</option>)}</select><button onClick={save}>Save</button><button className="plain" onClick={()=>setTheme(theme==="light"?"dark":"light")}>Switch Theme</button></section>;}

createRoot(document.getElementById("root")).render(<App/>);
