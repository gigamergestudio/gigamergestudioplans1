import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg:      "#060610",
  surf:    "#0d0d1f",
  card:    "#11112a",
  border:  "#1c1c3a",
  cyan:    "#00d4ff",
  orange:  "#ff6b35",
  green:   "#00ff88",
  gold:    "#ffd700",
  purple:  "#b66dff",
  red:     "#ff4757",
  text:    "#e2e2f0",
  muted:   "#4a5070",
};

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", icon:"⚡", label:"COMMAND" },
  { id:"calendar",  icon:"📅", label:"CALENDAR" },
  { id:"ai",        icon:"🤖", label:"AI COACH" },
  { id:"pipeline",  icon:"🎯", label:"PIPELINE" },
  { id:"playbook",  icon:"📖", label:"PLAYBOOK" },
  { id:"timer",     icon:"⏱",  label:"FOCUS" },
];

const TIMER_PRESETS = {
  focus:    { label:"DEEP FOCUS",      secs:25*60, color:C.cyan   },
  outreach: { label:"OUTREACH SPRINT", secs:45*60, color:C.orange },
  short:    { label:"SHORT BREAK",     secs: 5*60, color:C.green  },
  long:     { label:"LONG BREAK",      secs:15*60, color:C.purple },
};

const VERTICALS = [
  { name:"Finance YouTubers",  icon:"🏦", color:C.gold,   budget:"$2K–8K/mo" },
  { name:"AI Startups",        icon:"🤖", color:C.cyan,   budget:"$3K–15K/mo" },
  { name:"Podcast Creators",   icon:"🎙️", color:C.purple, budget:"$1.5K–5K/mo" },
  { name:"Agencies (WL)",      icon:"🏢", color:C.orange, budget:"$5K–30K/mo" },
  { name:"Online Coaches",     icon:"🧠", color:C.green,  budget:"$2K–8K/mo" },
  { name:"Real Estate",        icon:"🏠", color:C.red,    budget:"$2K–10K/mo" },
  { name:"Gaming Creators",    icon:"🎮", color:C.orange, budget:"$800–3K/mo" },
  { name:"Exec Brands",        icon:"💼", color:C.gold,   budget:"$3K–12K/mo" },
  { name:"Edu Creators",       icon:"📚", color:C.cyan,   budget:"$1K–5K/mo" },
  { name:"Faceless Channels",  icon:"🎭", color:C.purple, budget:"$800–3K/mo" },
  { name:"Wellness/Fitness",   icon:"🧘", color:C.green,  budget:"$1.5K–4K/mo" },
  { name:"SaaS Companies",     icon:"💻", color:C.cyan,   budget:"$2K–8K/mo" },
];

const PLAYBOOK = [
  { tag:"Day 0", type:"outreach", color:C.cyan, title:"Touch-1 — Value First DM",
    body:`Hey [Name], I've been watching your content on [topic]. Your insights on [specific video] are genuinely different from what everyone else is teaching.

Here's what I noticed that could be costing you watch time: [specific observation — e.g., your hook takes 28 seconds, YouTube's algo drops viewers at 15-sec].

Mentioning it because I thought you'd want to know. Love the channel.` },

  { tag:"Day 3", type:"outreach", color:C.cyan, title:"Touch-2 — Sample Edit Hook",
    body:`Hey again — I actually went ahead and put together a quick sample edit of your [recent video's] first 60 seconds to show what a retention-optimized cut could look like for your style.

Happy to share it — no strings attached. Just want to show you what's possible. Want me to send it over?` },

  { tag:"Day 7", type:"outreach", color:C.purple, title:"Touch-3 — Social Proof",
    body:`Hey [Name] — we recently started working with a [similar niche] creator and their average view duration went from 38% to 61% in two months. They went from 2 videos/month to 8 without any added workload.

Worth a quick 10-minute call to see if we could do the same for your channel?` },

  { tag:"Day 10", type:"outreach", color:C.orange, title:"Touch-4 — Scarcity Frame",
    body:`Hey — we're wrapping up onboarding for this month and have space for one more creator in [their niche].

If the timing isn't right, totally understood. But if it is, I'd love to show you the full system. Just reply "interested" and I'll send over the details.` },

  { tag:"Day 14", type:"outreach", color:C.muted, title:"Touch-5 — Breakup Message",
    body:`Hey [Name] — going to assume the timing isn't right for now. No worries at all.

I'll keep an eye on your channel — if things change and you ever want to explore having a dedicated content team, we're here. Keep crushing it.` },

  { tag:"Agency", type:"email", color:C.gold, title:"Agency White-Label Email",
    body:`Subject: White-label editing partner for your agency

Hey [Agency] team — We work exclusively as a white-label partner for agencies:

✓ Clients get premium editing under YOUR brand
✓ Never miss a deadline again
✓ Scale video capacity without hiring
✓ Professional SOW, monthly billing, one contact

15 minutes this week to show you the system?` },

  { tag:"$1,799/mo", type:"pricing", color:C.green, title:"Momentum Package (Most Popular)",
    body:`$1,799/month — MOMENTUM TIER

• 8 long-form video edits (up to 15 min each)
• 20 short-form clips (Reels/Shorts/TikTok)
• Custom intro/outro templates
• 8 thumbnail designs/month
• Priority 3-day delivery
• Dedicated editor (same person, always)
• Monthly performance review call

Pitch: "This is how you go from inconsistent to unstoppable."` },

  { tag:"LinkedIn", type:"strategy", color:C.orange, title:"Hiring Signal: LinkedIn Jobs",
    body:`Search LinkedIn Jobs: "Video Editor" — filter: last 24 hours.

When a company posts this job, they need an editor RIGHT NOW. That's a hot lead.

Message the hiring manager immediately:

"Hey [Name] — I saw [Company] is looking for a video editor. We work as an outsourced studio — faster to onboard than a full-time hire, scale up/down by volume. Worth a 15-min call before you finalize hiring?"` },
];

const MARKET_STATS = [
  { label:"Creator Economy 2026", value:"$314B",   color:C.gold   },
  { label:"Creator Economy 2033", value:"$1.34T",  color:C.cyan   },
  { label:"India Creator Economy",value:"$2.5B",   color:C.orange },
  { label:"Influencer Marketing", value:"$40.5B",  color:C.purple },
  { label:"Finance YouTube CPM",  value:"$22/1K",  color:C.green  },
  { label:"India Creators",       value:"100M+",   color:C.cyan   },
  { label:"Video Editing Market", value:"$3.54B",  color:C.gold   },
  { label:"CAGR (2026–2033)",     value:"23.3%",   color:C.orange },
];

const EVENT_COLORS = {
  outreach:"#00d4ff", call:"#ff6b35",
  deadline:"#ff4757", strategy:"#b66dff", personal:"#00ff88",
};

const STAGE_COLORS = {
  "New Lead":"#4a5070",    "Contacted":"#00d4ff",
  "Sample Sent":"#b66dff", "Call Booked":"#ff6b35",
  "Proposal Sent":"#ffd700","Closed Won":"#00ff88",
  "Closed Lost":"#ff4757",
};

const AI_PROMPTS = [
  "Write a cold DM for a finance YouTuber",
  "How do I close an agency on $5K/month?",
  "Best outreach timing for AI startups",
  "Craft a sample-edit pitch message",
  "Handle price objection: 'too expensive'",
  "Top niches in India for 2026",
  "Write a LinkedIn agency outreach email",
  "Explain the hiring-signal strategy",
  "Give me a 30-day revenue plan to $10K",
  "What's the best upsell after month 1?",
];

const WEEKLY_DATA = [
  {day:"Mon",outreach:8,replies:2,calls:0},
  {day:"Tue",outreach:12,replies:4,calls:1},
  {day:"Wed",outreach:6,replies:3,calls:1},
  {day:"Thu",outreach:15,replies:5,calls:2},
  {day:"Fri",outreach:10,replies:4,calls:1},
  {day:"Sat",outreach:5,replies:2,calls:0},
  {day:"Sun",outreach:3,replies:1,calls:0},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const pad  = n => String(n).padStart(2,"0");
const fmt  = secs => `${pad(Math.floor(secs/60))}:${pad(secs%60)}`;
const today = () => new Date().toISOString().split("T")[0];
const daysInMonth  = (y,m) => new Date(y,m+1,0).getDate();
const firstOfMonth = (y,m) => new Date(y,m,1).getDay();

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight:"100vh", background:C.bg,
    fontFamily:"'Exo 2',sans-serif", color:C.text,
    display:"flex", flexDirection:"column", overflow:"hidden",
  },
  header: {
    background:`linear-gradient(90deg,#0a0a1e,#0d0d25)`,
    borderBottom:`1px solid ${C.border}`,
    padding:"10px 24px", display:"flex",
    alignItems:"center", justifyContent:"space-between", flexShrink:0,
  },
  logo: {
    fontFamily:"'Rajdhani',sans-serif", fontSize:"20px",
    fontWeight:700, color:C.cyan, letterSpacing:"4px",
  },
  clock: {
    fontFamily:"'JetBrains Mono',monospace", fontSize:"30px",
    fontWeight:600, color:C.cyan, textShadow:`0 0 24px ${C.cyan}55`,
  },
  layout: { display:"flex", flex:1, overflow:"hidden", height:"calc(100vh - 58px)" },
  sidebar: {
    width:"68px", background:"#09091a",
    borderRight:`1px solid ${C.border}`,
    display:"flex", flexDirection:"column",
    alignItems:"center", padding:"12px 0", gap:"4px", flexShrink:0,
  },
  content: {
    flex:1, overflow:"auto", padding:"20px",
    scrollbarWidth:"thin", scrollbarColor:`${C.border} transparent`,
  },
  card: (accent) => ({
    background:C.card, border:`1px solid ${accent ? accent+"30" : C.border}`,
    borderRadius:"14px", padding:"18px",
  }),
  cardTitle: {
    fontFamily:"'Rajdhani',sans-serif", fontSize:"11px",
    fontWeight:600, color:C.muted, letterSpacing:"2px",
    textTransform:"uppercase", marginBottom:"8px",
  },
  statVal: (color) => ({
    fontFamily:"'Rajdhani',sans-serif",
    fontSize:"36px", fontWeight:700, color, lineHeight:1,
  }),
  tag: (color) => ({
    background:`${color}20`, border:`1px solid ${color}40`, color,
    padding:"2px 8px", borderRadius:"4px",
    fontSize:"10px", fontFamily:"'JetBrains Mono',monospace", fontWeight:600,
    whiteSpace:"nowrap",
  }),
  btn: (color=C.cyan) => ({
    background:`${color}15`, border:`1px solid ${color}40`, color,
    padding:"7px 14px", borderRadius:"8px", cursor:"pointer",
    fontFamily:"'Exo 2',sans-serif", fontSize:"12px", fontWeight:600,
    display:"inline-flex", alignItems:"center", gap:"5px", transition:"all .2s",
  }),
  solid: (color=C.cyan) => ({
    background:color, border:"none", color:"#000",
    padding:"8px 16px", borderRadius:"8px", cursor:"pointer",
    fontFamily:"'Exo 2',sans-serif", fontSize:"13px", fontWeight:700,
  }),
  input: {
    background:"#181830", border:`1px solid ${C.border}`,
    borderRadius:"8px", color:C.text, padding:"8px 12px",
    fontFamily:"'Exo 2',sans-serif", fontSize:"12px",
    outline:"none", width:"100%",
  },
  grid: (cols,gap=16) => ({
    display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap,
  }),
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GigaMerge() {
  // fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;600&family=Exo+2:wght@300;400;600;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  },[]);

  // ── state ──────────────────────────────────────────────────────────────────
  const [tab,    setTab]    = useState("dashboard");
  const [now,    setNow]    = useState(new Date());
  const [toasts, setToasts] = useState([]);

  // Calendar
  const [calMonth,     setCalMonth]     = useState(new Date());
  const [events,       setEvents]       = useState([]);
  const [showEvtModal, setShowEvtModal] = useState(false);
  const [selDate,      setSelDate]      = useState(null);
  const [newEvt, setNewEvt] = useState({title:"",time:"",type:"outreach",note:""});

  // Tasks
  const [tasks, setTasks] = useState([
    {id:1,text:"Send 10 Touch-1 DMs to Finance YouTubers",done:false,priority:"high"},
    {id:2,text:"Create sample edits for top 3 leads",done:false,priority:"high"},
    {id:3,text:"Set up Apollo.io for email finding",done:false,priority:"medium"},
    {id:4,text:"Post before/after reel on Instagram",done:false,priority:"medium"},
    {id:5,text:"Join 3 Discord creator servers",done:false,priority:"low"},
    {id:6,text:"Monitor r/NewTubers for editor requests",done:false,priority:"low"},
  ]);
  const [newTask,         setNewTask]         = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");

  // Pipeline
  const [pipeline, setPipeline] = useState([
    {id:1,name:"Finance Bro Channel",vertical:"Finance YouTubers",stage:"Contacted",value:3200,notes:"Sent Touch-1 DM"},
    {id:2,name:"NexusAI Startup",vertical:"AI Startups",stage:"Sample Sent",value:4500,notes:"Sample edit shared"},
    {id:3,name:"ContentPro Agency",vertical:"Agencies (WL)",stage:"Call Booked",value:8000,notes:"Call Friday 3PM"},
  ]);
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({name:"",vertical:"Finance YouTubers",stage:"New Lead",value:"",notes:""});

  // Stats
  const [stats, setStats] = useState({revenue:7300,clients:2,outreach:24,calls:3});

  // AI
  const [msgs, setMsgs] = useState([
    {role:"assistant", content:"🎯 GigaMerge AI Strategist is online.\n\nI'm trained on your complete acquisition playbook — creator economy data, outreach scripts, pricing psychology, and market intelligence.\n\nAsk me anything. Let's build your empire."}
  ]);
  const [aiInput,   setAiInput]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEnd = useRef(null);

  // Timer
  const [tMode,    setTMode]    = useState("focus");
  const [tSecs,    setTSecs]    = useState(TIMER_PRESETS.focus.secs);
  const [tRunning, setTRunning] = useState(false);
  const [tDone,    setTDone]    = useState(false);
  const tRef = useRef(null);

  // Revenue chart data
  const [revenueData] = useState([
    {month:"Jan",rev:0},{month:"Feb",rev:799},{month:"Mar",rev:1800},
    {month:"Apr",rev:3600},{month:"May",rev:7300},
  ]);

  // ── effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  },[]);

  // reminder check every 30s
  useEffect(() => {
    const check = () => {
      const n = Date.now();
      events.forEach(ev => {
        if (!ev.time || ev.reminded) return;
        const d = new Date(ev.date);
        const [h,m] = ev.time.split(":").map(Number);
        d.setHours(h,m,0,0);
        const diff = d - n;
        if (diff > 0 && diff <= 5*60*1000) {
          toast(`⏰ "${ev.title}" in ${Math.ceil(diff/60000)} min!`, "warning");
          setEvents(p => p.map(e => e.id===ev.id ? {...e,reminded:true} : e));
        } else if (diff <= 0 && diff > -60000 && !ev.reminded) {
          toast(`🚨 "${ev.title}" is NOW!`, "urgent");
          setEvents(p => p.map(e => e.id===ev.id ? {...e,reminded:true} : e));
        }
      });
    };
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  },[events]);

  // timer
  useEffect(() => {
    if (tRunning) {
      tRef.current = setInterval(() => {
        setTSecs(p => {
          if (p <= 1) {
            clearInterval(tRef.current);
            setTRunning(false); setTDone(true);
            playBeep(); toast(`🎯 ${TIMER_PRESETS[tMode].label} COMPLETE!`, "urgent");
            return 0;
          }
          return p-1;
        });
      }, 1000);
    } else { clearInterval(tRef.current); }
    return () => clearInterval(tRef.current);
  },[tRunning, tMode]);

  // scroll chat
  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  // persist
  useEffect(() => {
    (async () => { try { await window.storage.set("gm_events",   JSON.stringify(events));   } catch{} })();
  },[events]);
  useEffect(() => {
    (async () => { try { await window.storage.set("gm_tasks",    JSON.stringify(tasks));    } catch{} })();
  },[tasks]);
  useEffect(() => {
    (async () => { try { await window.storage.set("gm_pipeline", JSON.stringify(pipeline)); } catch{} })();
  },[pipeline]);
  useEffect(() => {
    (async () => { try { await window.storage.set("gm_stats",    JSON.stringify(stats));    } catch{} })();
  },[stats]);

  // load
  useEffect(() => {
    (async () => {
      try {
        const ev = await window.storage.get("gm_events");
        if (ev) setEvents(JSON.parse(ev.value));
        const tk = await window.storage.get("gm_tasks");
        if (tk) setTasks(JSON.parse(tk.value));
        const pp = await window.storage.get("gm_pipeline");
        if (pp) setPipeline(JSON.parse(pp.value));
        const st = await window.storage.get("gm_stats");
        if (st) setStats(JSON.parse(st.value));
      } catch{}
    })();
  },[]);

  // ── helpers ────────────────────────────────────────────────────────────────
  function toast(msg, type="info") {
    const id = Date.now();
    setToasts(p => [...p, {id,msg,type}]);
    setTimeout(() => setToasts(p => p.filter(t=>t.id!==id)), 6000);
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      [[880,0],[1100,.25],[1320,.5]].forEach(([f,t]) => {
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value=f; o.type="sine";
        g.gain.setValueAtTime(0.3,ctx.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.3);
        o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.4);
      });
    } catch{}
  }

  function addEvent() {
    if (!newEvt.title||!selDate) return;
    const ev = { id:Date.now(), ...newEvt,
      date: `${selDate.getFullYear()}-${pad(selDate.getMonth()+1)}-${pad(selDate.getDate())}`,
      reminded:false };
    setEvents(p=>[...p,ev]);
    setNewEvt({title:"",time:"",type:"outreach",note:""});
    setShowEvtModal(false);
    toast(`✅ "${ev.title}" added!`, "success");
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks(p=>[...p,{id:Date.now(),text:newTask,done:false,priority:newTaskPriority}]);
    setNewTask("");
  }

  function addLead() {
    if (!newLead.name) return;
    setPipeline(p=>[...p,{id:Date.now(),...newLead,value:Number(newLead.value)||0}]);
    setNewLead({name:"",vertical:"Finance YouTubers",stage:"New Lead",value:"",notes:""});
    setShowAddLead(false);
    toast(`🎯 "${newLead.name}" added to pipeline!`, "success");
  }

  function setTimerMode(m) {
    setTMode(m); setTSecs(TIMER_PRESETS[m].secs);
    setTRunning(false); setTDone(false);
  }

  async function sendAI() {
    if (!aiInput.trim()||aiLoading) return;
    const userMsg = {role:"user",content:aiInput};
    const history = [...msgs, userMsg];
    setMsgs(history); setAiInput(""); setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are GigaMerge Studio's elite AI Growth Strategist. GigaMerge is a premium video editing and content studio targeting creators, AI startups, agencies, coaches, and businesses worldwide.

Your expertise: client acquisition systems, outreach psychology, pricing strategy, closing techniques, creator economy market intelligence, and scaling agency revenue.

Key facts you operate with:
• Creator economy: $252B in 2025 → $1.34T by 2033 (23.3% CAGR)
• Finance YouTube CPM: $22/1000 views (highest niche)
• India creator economy: $2.5B → $5B by 2027; 100M+ creators
• Influencer marketing: $40.5B in 2026
• GigaMerge pricing: Launchpad $799/mo | Momentum $1,799/mo | Dominance $3,499/mo | Enterprise $5K–20K/mo
• 5-touch outreach sequence over 14 days
• Best verticals: Finance YouTubers, AI Startups, Agencies (white-label), Online Coaches

Your style: Think Alex Hormozi meets McKinsey. Be hyper-specific. Give copy-paste scripts when asked. Every word earns its place. Use bullet structure for clarity. Max 380 words per response.`,
          messages: history.map(m=>({role:m.role,content:m.content}))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c=>c.text||"").join("") || "Error — try again.";
      setMsgs(p=>[...p,{role:"assistant",content:reply}]);
    } catch {
      setMsgs(p=>[...p,{role:"assistant",content:"⚠️ Connection error. Check network and retry."}]);
    }
    setAiLoading(false);
  }

  // ── calendar helpers ────────────────────────────────────────────────────────
  const cy = calMonth.getFullYear(), cm = calMonth.getMonth();
  const eventsOnDay = d => {
    const ds = `${cy}-${pad(cm+1)}-${pad(d)}`;
    return events.filter(e=>e.date===ds);
  };

  // ── TABS ───────────────────────────────────────────────────────────────────

  /* ─── DASHBOARD ─── */
  const Dashboard = () => (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {/* KPI row */}
      <div style={S.grid(4)}>
        {[
          {label:"Monthly Revenue",  v:`$${stats.revenue.toLocaleString()}`, color:C.gold,   icon:"💰", sub:"+$2,800 this week"},
          {label:"Active Clients",   v:stats.clients,                        color:C.cyan,   icon:"👥", sub:"2 closing soon"},
          {label:"Outreach Sent",    v:stats.outreach,                       color:C.purple, icon:"📤", sub:`Today: ${Math.floor(Math.random()*5)+3} sent`},
          {label:"Calls Booked",     v:stats.calls,                          color:C.green,  icon:"📞", sub:"Next: Friday 3PM"},
        ].map((s,i)=>(
          <div key={i} style={{...S.card(s.color)}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={S.cardTitle}>{s.label}</div>
                <div style={S.statVal(s.color)}>{s.v}</div>
              </div>
              <div style={{fontSize:26}}>{s.icon}</div>
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:6}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Edit stats (clickable) */}
      <div style={{...S.card(), display:"flex", gap:16, alignItems:"center", flexWrap:"wrap"}}>
        <div style={{fontSize:13,color:C.muted}}>Quick Update:</div>
        {[
          {k:"revenue",label:"MRR $",type:"number"},
          {k:"clients",label:"Clients",type:"number"},
          {k:"outreach",label:"Outreach",type:"number"},
          {k:"calls",label:"Calls",type:"number"},
        ].map(f=>(
          <div key={f.k} style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,color:C.muted}}>{f.label}</span>
            <input type={f.type} value={stats[f.k]}
              onChange={e=>setStats(p=>({...p,[f.k]:Number(e.target.value)}))}
              style={{...S.input,width:90,padding:"4px 8px",fontSize:12}}/>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={S.grid(2)}>
        <div style={S.card()}>
          <div style={S.cardTitle}>Revenue Growth (MRR)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a38"/>
              <XAxis dataKey="month" stroke={C.muted} tick={{fontSize:11}}/>
              <YAxis stroke={C.muted} tick={{fontSize:11}}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8}}/>
              <Line type="monotone" dataKey="rev" stroke={C.gold} strokeWidth={2.5}
                dot={{fill:C.gold,r:4}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card()}>
          <div style={S.cardTitle}>Weekly Outreach Activity</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a38"/>
              <XAxis dataKey="day" stroke={C.muted} tick={{fontSize:11}}/>
              <YAxis stroke={C.muted} tick={{fontSize:11}}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8}}/>
              <Bar dataKey="outreach" fill={C.cyan}   radius={[4,4,0,0]}/>
              <Bar dataKey="replies"  fill={C.purple} radius={[4,4,0,0]}/>
              <Bar dataKey="calls"    fill={C.orange} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:14,marginTop:6}}>
            {[["Outreach",C.cyan],["Replies",C.purple],["Calls",C.orange]].map(([l,c])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.muted}}>
                <div style={{width:8,height:8,borderRadius:2,background:c}}/>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks + Verticals */}
      <div style={S.grid(2)}>
        {/* Tasks */}
        <div style={S.card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={S.cardTitle}>Daily Mission</div>
            <div style={S.tag(C.cyan)}>{tasks.filter(t=>t.done).length}/{tasks.length} done</div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            <input value={newTask} onChange={e=>setNewTask(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addTask()}
              placeholder="Add mission..." style={{...S.input,flex:1}}/>
            <select value={newTaskPriority} onChange={e=>setNewTaskPriority(e.target.value)}
              style={{...S.input,width:80}}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Med</option>
              <option value="low">🟢 Low</option>
            </select>
            <button onClick={addTask} style={S.solid(C.cyan)}>+</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:240,overflowY:"auto"}}>
            {tasks.map(t=>(
              <div key={t.id} onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))}
                style={{
                  display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                  background:t.done?"#0d0d1e":"#171730",borderRadius:8,cursor:"pointer",
                  border:`1px solid ${t.done?C.border:C.border}`,opacity:t.done?.5:1,
                  transition:"all .2s",
                }}>
                <div style={{
                  width:16,height:16,borderRadius:4,flexShrink:0,
                  border:`2px solid ${t.priority==="high"?C.red:t.priority==="medium"?C.orange:C.green}`,
                  background:t.done?C.cyan:"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,
                }}>{t.done&&"✓"}</div>
                <span style={{fontSize:12,flex:1,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
                <div style={S.tag(t.priority==="high"?C.red:t.priority==="medium"?C.orange:C.green)}>
                  {t.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verticals */}
        <div style={S.card()}>
          <div style={S.cardTitle}>Target Verticals — Budget Range</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:296,overflowY:"auto"}}>
            {VERTICALS.map((v,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:10,padding:"8px 12px",
                background:"#171730",borderRadius:8,border:`1px solid ${C.border}`,
              }}>
                <span style={{fontSize:18}}>{v.icon}</span>
                <span style={{flex:1,fontSize:12}}>{v.name}</span>
                <div style={S.tag(v.color)}>{v.budget}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── CALENDAR ─── */
  const Calendar = () => {
    const days   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const total  = daysInMonth(cy,cm);
    const first  = firstOfMonth(cy,cm);
    const mnName = calMonth.toLocaleString("default",{month:"long",year:"numeric"});
    const td     = today();

    return (
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:18}}>
        <div style={S.card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <button onClick={()=>setCalMonth(new Date(cy,cm-1))} style={S.btn()}>‹</button>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:22,fontWeight:700,color:C.cyan}}>{mnName}</div>
            <button onClick={()=>setCalMonth(new Date(cy,cm+1))} style={S.btn()}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
            {days.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:C.muted,fontFamily:"'JetBrains Mono',monospace",padding:4}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {Array.from({length:first},(_,i)=><div key={`e${i}`} style={{height:68}}/>)}
            {Array.from({length:total},(_,i)=>{
              const day=i+1;
              const ds=`${cy}-${pad(cm+1)}-${pad(day)}`;
              const evs=eventsOnDay(day);
              const isToday=ds===td;
              return (
                <div key={day} onClick={()=>{setSelDate(new Date(cy,cm,day));setShowEvtModal(true);}}
                  style={{
                    height:68,background:isToday?`${C.cyan}12`:"#171730",
                    border:`1px solid ${isToday?C.cyan:C.border}`,borderRadius:8,
                    padding:6,cursor:"pointer",overflow:"hidden",transition:"all .2s",
                  }}>
                  <div style={{fontSize:13,fontWeight:isToday?700:400,color:isToday?C.cyan:C.text,marginBottom:3}}>{day}</div>
                  {evs.slice(0,2).map(ev=>(
                    <div key={ev.id} style={{
                      fontSize:9,color:EVENT_COLORS[ev.type]||C.cyan,
                      background:`${EVENT_COLORS[ev.type]||C.cyan}20`,
                      borderRadius:3,padding:"1px 4px",marginBottom:2,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                    }}>{ev.time&&`${ev.time} `}{ev.title}</div>
                  ))}
                  {evs.length>2&&<div style={{fontSize:9,color:C.muted}}>+{evs.length-2}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={S.card()}>
            <div style={S.cardTitle}>Upcoming Events</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:300,overflowY:"auto"}}>
              {events.length===0
                ? <div style={{color:C.muted,fontSize:12,textAlign:"center",padding:"20px 0"}}>No events yet.<br/>Click any date to add one.</div>
                : [...events].sort((a,b)=>a.date.localeCompare(b.date))
                    .filter(e=>e.date>=today())
                    .slice(0,12)
                    .map(ev=>(
                    <div key={ev.id} style={{
                      padding:"10px 12px",background:"#171730",borderRadius:8,
                      border:`1px solid ${EVENT_COLORS[ev.type]||C.cyan}30`,
                      borderLeft:`3px solid ${EVENT_COLORS[ev.type]||C.cyan}`,
                    }}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                        <div style={{fontSize:12,fontWeight:600}}>{ev.title}</div>
                        <div style={S.tag(EVENT_COLORS[ev.type]||C.cyan)}>{ev.type}</div>
                      </div>
                      <div style={{fontSize:10,color:C.muted,marginTop:4}}>
                        {ev.date}{ev.time&&` @ ${ev.time}`}
                      </div>
                      {ev.note&&<div style={{fontSize:11,color:C.text,marginTop:3}}>{ev.note}</div>}
                    </div>
                  ))
              }
            </div>
          </div>
          <div style={S.card()}>
            <div style={S.cardTitle}>Event Types</div>
            {Object.entries(EVENT_COLORS).map(([type,color])=>(
              <div key={type} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}>
                <div style={{width:10,height:10,borderRadius:3,background:color}}/>
                <span style={{fontSize:12,textTransform:"capitalize"}}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Modal */}
        {showEvtModal&&(
          <div style={{
            position:"fixed",inset:0,background:"rgba(0,0,0,.75)",
            backdropFilter:"blur(5px)",display:"flex",alignItems:"center",
            justifyContent:"center",zIndex:200,
          }}>
            <div style={{...S.card(C.cyan),width:380}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:700,color:C.cyan,marginBottom:16}}>
                Add Event — {selDate?.toLocaleDateString("en-US",{month:"long",day:"numeric"})}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <input value={newEvt.title} onChange={e=>setNewEvt(p=>({...p,title:e.target.value}))}
                  placeholder="Event title..." style={S.input}/>
                <input type="time" value={newEvt.time} onChange={e=>setNewEvt(p=>({...p,time:e.target.value}))}
                  style={S.input}/>
                <select value={newEvt.type} onChange={e=>setNewEvt(p=>({...p,type:e.target.value}))} style={S.input}>
                  <option value="outreach">📤 Outreach</option>
                  <option value="call">📞 Client Call</option>
                  <option value="deadline">🚨 Deadline</option>
                  <option value="strategy">🧠 Strategy</option>
                  <option value="personal">✅ Personal</option>
                </select>
                <input value={newEvt.note} onChange={e=>setNewEvt(p=>({...p,note:e.target.value}))}
                  placeholder="Notes (optional)..." style={S.input}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addEvent} style={{...S.solid(C.cyan),flex:1}}>Add Event</button>
                  <button onClick={()=>setShowEvtModal(false)} style={{...S.btn(C.muted),flex:1}}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ─── AI COACH ─── */
  const AICoach = () => (
    <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:18,height:"calc(100vh - 140px)"}}>
      <div style={{...S.card(),display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{
            width:42,height:42,borderRadius:"50%",flexShrink:0,
            background:`linear-gradient(135deg,${C.cyan},${C.purple})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
          }}>🤖</div>
          <div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:17,fontWeight:700,color:C.cyan}}>GigaMerge AI Strategist</div>
            <div style={{fontSize:11,color:C.green}}>● Online — Trained on your full playbook</div>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:14,paddingRight:4}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{
                maxWidth:"82%",padding:"11px 15px",
                borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                background:m.role==="user"?`${C.cyan}18`:"#181830",
                border:`1px solid ${m.role==="user"?C.cyan+"30":C.border+"50"}`,
                fontSize:13,lineHeight:1.65,whiteSpace:"pre-wrap",
              }}>{m.content}</div>
            </div>
          ))}
          {aiLoading&&(
            <div style={{display:"flex",gap:5,padding:"6px 14px"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{
                  width:8,height:8,borderRadius:"50%",background:C.cyan,
                  animation:`pulse 1s ${i*.2}s infinite ease-in-out`,
                }}/>
              ))}
            </div>
          )}
          <div ref={chatEnd}/>
        </div>

        <div style={{display:"flex",gap:8}}>
          <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendAI()}
            placeholder="Ask for scripts, strategy, market intel, pricing advice..."
            style={{...S.input,flex:1}}/>
          <button onClick={sendAI} disabled={aiLoading}
            style={{...S.solid(C.cyan),padding:"8px 20px",opacity:aiLoading?.5:1}}>
            {aiLoading?"...":"→"}
          </button>
        </div>
      </div>

      <div style={S.card()}>
        <div style={S.cardTitle}>Quick Strategy Prompts</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {AI_PROMPTS.map((p,i)=>(
            <button key={i} onClick={()=>setAiInput(p)}
              style={{...S.btn(C.purple),textAlign:"left",fontSize:11,padding:"8px 10px",lineHeight:1.35}}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── PIPELINE ─── */
  const Pipeline = () => {
    const stages=["New Lead","Contacted","Sample Sent","Call Booked","Proposal Sent","Closed Won"];
    const totalVal=pipeline.reduce((s,l)=>s+Number(l.value||0),0);
    const closedVal=pipeline.filter(l=>l.stage==="Closed Won").reduce((s,l)=>s+Number(l.value||0),0);

    return (
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <div style={S.grid(3)}>
          {[
            {label:"Total Pipeline",v:`$${totalVal.toLocaleString()}`,color:C.gold},
            {label:"Active Leads",v:pipeline.filter(l=>!["Closed Won","Closed Lost"].includes(l.stage)).length,color:C.cyan},
            {label:"Closed Revenue",v:`$${closedVal.toLocaleString()}`,color:C.green},
          ].map((s,i)=>(
            <div key={i} style={S.card(s.color)}>
              <div style={S.cardTitle}>{s.label}</div>
              <div style={{...S.statVal(s.color),fontSize:28}}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={S.card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={S.cardTitle}>Manage Pipeline</div>
            <button onClick={()=>setShowAddLead(p=>!p)} style={S.btn(C.cyan)}>+ Add Lead</button>
          </div>
          {showAddLead&&(
            <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 2fr 1fr 1fr auto",gap:8,marginTop:12}}>
              <input value={newLead.name} onChange={e=>setNewLead(p=>({...p,name:e.target.value}))}
                placeholder="Lead / company name..." style={S.input}/>
              <select value={newLead.vertical} onChange={e=>setNewLead(p=>({...p,vertical:e.target.value}))} style={S.input}>
                {VERTICALS.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
              </select>
              <select value={newLead.stage} onChange={e=>setNewLead(p=>({...p,stage:e.target.value}))} style={S.input}>
                {stages.map(s=><option key={s}>{s}</option>)}
              </select>
              <input type="number" value={newLead.value} onChange={e=>setNewLead(p=>({...p,value:e.target.value}))}
                placeholder="$/mo" style={S.input}/>
              <input value={newLead.notes} onChange={e=>setNewLead(p=>({...p,notes:e.target.value}))}
                placeholder="Notes..." style={S.input}/>
              <button onClick={addLead} style={S.solid(C.cyan)}>Add</button>
            </div>
          )}
        </div>

        <div style={S.grid(3,12)}>
          {stages.map(stage=>{
            const sl=pipeline.filter(l=>l.stage===stage);
            const color=STAGE_COLORS[stage]||C.muted;
            return (
              <div key={stage} style={{...S.card(color),minHeight:120}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{...S.cardTitle,marginBottom:0}}>{stage}</div>
                  <div style={S.tag(color)}>{sl.length}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {sl.map(lead=>(
                    <div key={lead.id} style={{
                      padding:10,background:"#171730",borderRadius:8,
                      border:`1px solid ${color}20`,
                    }}>
                      <div style={{fontSize:12,fontWeight:600}}>{lead.name}</div>
                      <div style={{fontSize:10,color:C.muted}}>{lead.vertical}</div>
                      <div style={{fontSize:12,color:C.gold,marginTop:4}}>${Number(lead.value).toLocaleString()}/mo</div>
                      {lead.notes&&<div style={{fontSize:10,color:C.muted,marginTop:3,fontStyle:"italic"}}>{lead.notes}</div>}
                    </div>
                  ))}
                  {!sl.length&&<div style={{fontSize:11,color:C.muted,textAlign:"center",padding:"12px 0"}}>Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ─── PLAYBOOK ─── */
  const Playbook = () => (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={S.grid(2)}>
        {PLAYBOOK.map((s,i)=>(
          <div key={i} style={{...S.card(s.color)}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,fontWeight:700,color:s.color,flex:1}}>{s.title}</div>
              <div style={{...S.tag(s.color),marginLeft:8}}>{s.tag}</div>
            </div>
            <div style={{
              fontSize:11,lineHeight:1.75,color:C.text,
              background:"#0d0d1e",padding:12,borderRadius:8,
              border:`1px solid ${C.border}`,whiteSpace:"pre-wrap",
              fontFamily:"'JetBrains Mono',monospace",maxHeight:160,overflowY:"auto",
            }}>{s.body}</div>
            <button onClick={()=>{
              navigator.clipboard?.writeText(s.body);
              toast("📋 Script copied!","success");
            }} style={{...S.btn(s.color),marginTop:10,fontSize:11}}>
              Copy Script
            </button>
          </div>
        ))}
      </div>

      <div style={S.card()}>
        <div style={S.cardTitle}>Market Intelligence — Live Numbers</div>
        <div style={S.grid(4,10)}>
          {MARKET_STATS.map((s,i)=>(
            <div key={i} style={{
              padding:14,background:"#171730",borderRadius:10,
              border:`1px solid ${s.color}20`,textAlign:"center",
            }}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:s.color}}>{s.value}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:5,lineHeight:1.4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── FOCUS TIMER ─── */
  const FocusTimer = () => {
    const cfg = TIMER_PRESETS[tMode];
    const circ = 2*Math.PI*118;
    const prog = tSecs/cfg.secs;
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28,paddingTop:16}}>
        {/* Mode tabs */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
          {Object.entries(TIMER_PRESETS).map(([k,v])=>(
            <button key={k} onClick={()=>setTimerMode(k)}
              style={{
                ...S.btn(tMode===k?v.color:C.muted),
                background:tMode===k?`${v.color}20`:"transparent",
                padding:"9px 18px",
              }}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Circle */}
        <div style={{position:"relative",width:268,height:268}}>
          <svg width="268" height="268" viewBox="0 0 268 268"
            style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
            <circle cx="134" cy="134" r="118" fill="none" stroke={C.border} strokeWidth="8"/>
            <circle cx="134" cy="134" r="118" fill="none"
              stroke={tDone?C.green:cfg.color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ*(1-prog)}
              style={{transition:"stroke-dashoffset 1s linear,stroke .5s"}}/>
          </svg>
          <div style={{
            position:"absolute",inset:0,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          }}>
            {tDone
              ? <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:28,fontWeight:800,color:C.green,textAlign:"center"}}>✅<br/>TIME'S UP!</div>
              : <>
                  <div style={{
                    fontFamily:"'JetBrains Mono',monospace",fontSize:54,fontWeight:700,
                    color:cfg.color,textShadow:`0 0 28px ${cfg.color}55`,lineHeight:1,
                  }}>{fmt(tSecs)}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:C.muted,letterSpacing:3,marginTop:8}}>
                    {cfg.label}
                  </div>
                </>
            }
          </div>
        </div>

        {/* Controls */}
        <div style={{display:"flex",gap:14}}>
          <button onClick={()=>{setTDone(false);setTRunning(p=>!p);}}
            style={{...S.solid(tRunning?C.orange:cfg.color),padding:"13px 36px",fontSize:15,borderRadius:12}}>
            {tRunning?"⏸ PAUSE":"▶ START"}
          </button>
          <button onClick={()=>{setTRunning(false);setTDone(false);setTSecs(cfg.secs);}}
            style={{...S.btn(C.muted),padding:"13px 22px",fontSize:15,borderRadius:12}}>↺ RESET</button>
        </div>

        {/* Tips card */}
        <div style={{...S.card(),maxWidth:480,width:"100%"}}>
          <div style={S.cardTitle}>Focus Session Playbook</div>
          {[
            {tip:"Outreach Sprint (45 min): Send 15 Touch-1 DMs. Phone away, notifications off.",color:C.orange},
            {tip:"Deep Focus (25 min): Create sample edits for your top 3 leads only.",color:C.cyan},
            {tip:"Short Break (5 min): Check replies, log new leads, drink water.",color:C.green},
            {tip:"Long Break (15 min): Research one new vertical. Add 10 leads to your list.",color:C.purple},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:10}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:item.color,marginTop:6,flexShrink:0}}/>
              <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{item.tip}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes slideIn{ from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar       { width:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#1c1c3a; border-radius:4px }
        input,select { color-scheme:dark; }
        button { transition:opacity .2s; }
        button:hover { opacity:.85 }
      `}</style>

      <div style={S.app}>
        {/* ── HEADER ────────────────────────────────── */}
        <div style={S.header}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={S.logo}>⬡ GigaMerge</div>
            <div style={S.tag(C.green)}>● LIVE</div>
          </div>

          <div style={{textAlign:"center"}}>
            <div style={S.clock}>
              {now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </div>
            <div style={{fontSize:10,color:C.muted,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>
              {now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>

          <div style={{display:"flex",gap:22,alignItems:"center"}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:C.muted}}>Creator Economy 2026</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,color:C.gold,fontWeight:700}}>$314B Market</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:C.muted}}>Your MRR</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,color:C.green,fontWeight:700}}>
                ${stats.revenue.toLocaleString()}
              </div>
            </div>
            {tRunning&&(
              <div style={{
                background:`${C.orange}15`,border:`1px solid ${C.orange}40`,
                borderRadius:8,padding:"5px 12px",textAlign:"center",
              }}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,color:C.orange}}>{fmt(tSecs)}</div>
                <div style={{fontSize:9,color:C.muted}}>FOCUS RUNNING</div>
              </div>
            )}
          </div>
        </div>

        {/* ── MAIN LAYOUT ───────────────────────────── */}
        <div style={S.layout}>
          {/* Sidebar */}
          <div style={S.sidebar}>
            {NAV.map(item=>(
              <div key={item.id} onClick={()=>setTab(item.id)}
                style={{
                  width:52,height:52,borderRadius:12,cursor:"pointer",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  background:tab===item.id?`${C.cyan}15`:"transparent",
                  border:`1px solid ${tab===item.id?C.cyan+"45":"transparent"}`,
                  transition:"all .2s",gap:2,
                }}>
                <span style={{fontSize:20}}>{item.icon}</span>
                <span style={{fontSize:"7.5px",color:tab===item.id?C.cyan:C.muted,
                  fontFamily:"'JetBrains Mono',monospace",letterSpacing:.5}}>
                  {item.label}
                </span>
              </div>
            ))}
            <div style={{flex:1}}/>
            {/* mini timer in sidebar */}
            <div onClick={()=>setTab("timer")} style={{
              width:52,background:tRunning?`${C.orange}15`:"#0d0d1a",
              border:`1px solid ${tRunning?C.orange:C.border}`,
              borderRadius:10,padding:"6px 4px",textAlign:"center",cursor:"pointer",
            }}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:tRunning?C.orange:C.muted}}>
                {fmt(tSecs)}
              </div>
              <div style={{fontSize:8,color:C.muted}}>TIMER</div>
            </div>
          </div>

          {/* Content area */}
          <div style={S.content}>
            {tab==="dashboard" && <Dashboard/>}
            {tab==="calendar"  && <Calendar/>}
            {tab==="ai"        && <AICoach/>}
            {tab==="pipeline"  && <Pipeline/>}
            {tab==="playbook"  && <Playbook/>}
            {tab==="timer"     && <FocusTimer/>}
          </div>
        </div>

        {/* ── TOAST STACK ───────────────────────────── */}
        <div style={{position:"fixed",top:70,right:18,display:"flex",flexDirection:"column",gap:8,zIndex:999}}>
          {toasts.map(t=>(
            <div key={t.id} onClick={()=>setToasts(p=>p.filter(x=>x.id!==t.id))}
              style={{
                background:t.type==="urgent"?C.red:t.type==="warning"?C.orange:t.type==="success"?C.green:C.cyan,
                color:"#000",padding:"11px 18px",borderRadius:10,fontSize:13,fontWeight:700,
                maxWidth:320,boxShadow:"0 4px 24px rgba(0,0,0,.5)",
                animation:"slideIn .3s ease",cursor:"pointer",
              }}>
              {t.msg}
            </div>
          ))}
        </div>

        {/* ── TIMER DONE OVERLAY ────────────────────── */}
        {tDone&&(
          <div style={{
            position:"fixed",inset:0,background:"rgba(0,0,0,.88)",
            backdropFilter:"blur(10px)",display:"flex",alignItems:"center",
            justifyContent:"center",zIndex:1000,
          }}>
            <div style={{
              ...S.card(C.green),textAlign:"center",padding:"48px 52px",
              boxShadow:`0 0 80px ${C.green}25`,maxWidth:420,
            }}>
              <div style={{fontSize:72,marginBottom:12}}>⏰</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:36,fontWeight:800,color:C.green}}>
                TIME'S UP!
              </div>
              <div style={{fontSize:15,color:C.muted,margin:"14px 0 28px",lineHeight:1.7}}>
                <strong style={{color:C.text}}>{TIMER_PRESETS[tMode].label}</strong> session complete.<br/>
                Take a breath. Log your progress. Go again.
              </div>
              <button onClick={()=>{setTDone(false);setTSecs(TIMER_PRESETS[tMode].secs);}}
                style={{...S.solid(C.green),padding:"13px 36px",fontSize:15,borderRadius:12}}>
                Start Next Session →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
