import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Beer, Eye, Lock, LogOut, Megaphone, Monitor, Pause, Play, RotateCcw, Sparkles, Trophy, Undo2 } from 'lucide-react';
import { useEventState } from './useEventState';
import './styles.css';

const PASSCODE = import.meta.env.VITE_EVENT_PASSCODE || 'change-this-passcode';
const letters = [
  { letter: 'B', start: 1, end: 15 },
  { letter: 'I', start: 16, end: 30 },
  { letter: 'N', start: 31, end: 45 },
  { letter: 'G', start: 46, end: 60 },
  { letter: 'O', start: 61, end: 75 }
];
const patterns = ['Traditional Bingo', 'Four Corners', 'X Pattern', 'Postage Stamp', 'Blackout', 'Host Choice'];
const hostId = localStorage.getItem('esc-host-id') || crypto.randomUUID();
localStorage.setItem('esc-host-id', hostId);

function letterFor(n) {
  if (!n) return '';
  if (n <= 15) return 'B';
  if (n <= 30) return 'I';
  if (n <= 45) return 'N';
  if (n <= 60) return 'G';
  return 'O';
}
function labelFor(n) { return n ? `${letterFor(n)}-${n}` : 'Ready'; }
function remaining(called) { return Array.from({ length: 75 }, (_, i) => i + 1).filter(n => !called.includes(n)); }
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace('-', ' '));
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function RequirePasscode({ children }) {
  const [ok, setOk] = useState(sessionStorage.getItem('esc-pass-ok') === 'true');
  const [value, setValue] = useState('');
  if (ok) return children;
  return <div className="login-page"><div className="login-card"><img src="/assets/esyp-logo.png"/><h1>Restricted Access</h1><p>Enter the event passcode to continue.</p><input type="password" value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && value===PASSCODE){sessionStorage.setItem('esc-pass-ok','true');setOk(true)}}}/><button onClick={()=>{ if(value===PASSCODE){sessionStorage.setItem('esc-pass-ok','true');setOk(true)} else alert('Incorrect passcode.')}}><Lock size={18}/> Continue</button></div></div>;
}

function Landing() {
  return <div className="landing"><div className="landing-card"><img src="/assets/esyp-logo.png"/><h1>ESC Young Professionals Bingo & Brews</h1><p>Choose a screen to open.</p><div className="landing-actions"><a href="/audience"><Monitor/> Audience Display</a><a href="/host"><Trophy/> Host Controls</a><a href="/admin"><Lock/> Admin Settings</a></div></div></div>;
}

function SponsorStrip({ sponsors }) {
  const names = sponsors?.map(s => `Thank you, ${s.name}!`) || [];
  return <div className="sponsor-strip"><div className="sponsor-scroll">{[...names, ...names].map((n,i)=><span key={i}>{n}</span>)}</div></div>;
}
function TableTicker({ names }) {
  const line = names?.join(' • ') || '';
  return <div className="table-ticker"><div className="ticker-scroll"><span>Table Sponsors: {line}</span><span>Table Sponsors: {line}</span></div></div>;
}
function LogoCloud({ sponsors }) {
  return <div className="logo-cloud">{sponsors?.map(s=><div className="logo-tile" key={s.name}><img src={s.logo}/><small>{s.level}</small></div>)}</div>;
}
function Announcement({ text }) {
  if (!text) return null;
  return <div className="announcement"><Megaphone size={30}/>{text}</div>;
}

function Audience() {
  const { game, settings } = useEventState();
  const current = game.called?.[game.called.length - 1];
  const recent = [...(game.called || [])].slice(-7).reverse();
  const mode = game.mode || 'live';
  return <div className="audience-shell">
    <div className="screen-frame">
      <AudienceHeader settings={settings}/>
      <Announcement text={game.announcement}/>
      {mode === 'beer' && <BeerBreak settings={settings}/>} 
      {mode === 'hold' && <HoldCards settings={settings}/>} 
      {mode === 'thanks' && <Thanks settings={settings}/>} 
      {mode === 'live' && <div className="live-grid">
        <section className="current-panel"><p>Current Call</p><div className="call-ball">{labelFor(current)}</div><div className="recent"><b>Recent Calls</b>{recent.length ? recent.map(n=><span key={n}>{labelFor(n)}</span>) : <span>No calls yet</span>}</div><div className="pattern">Pattern: <strong>{settings.pattern}</strong></div></section>
        <BingoBoard called={game.called || []} current={current}/>
      </div>}
      <SponsorStrip sponsors={settings.sponsors}/>
      <TableTicker names={settings.tableSponsors}/>
    </div>
  </div>
}
function AudienceHeader({ settings }) {
  return <header className="audience-header"><div className="brand-left"><img src="/assets/esyp-logo.png"/><div><h1>{settings.eventTitle}</h1><p>Presented by {settings.presentedBy}</p></div></div><div className="benefit"><span>Benefiting</span><img src="/assets/united-way.png"/><small>{settings.beneficiary}</small></div></header>
}
function BingoBoard({ called, current }) {
  return <section className="board">{letters.map(col=><div className="board-col" key={col.letter}><div className="board-letter">{col.letter}</div>{Array.from({length:15},(_,i)=>col.start+i).map(n=><div key={n} className={`board-num ${called.includes(n)?'called':''} ${current===n?'current':''}`}>{n}</div>)}</div>)}</section>
}
function BeerBreak({ settings }) {
  return <section className="special beer-screen" style={{backgroundImage:`linear-gradient(90deg, rgba(13,23,65,.88), rgba(13,23,65,.62)), url(${settings.beerBreakImage})`}}><div><p className="eyebrow"><Beer/> Beer Break</p><h2>Grab another drink.</h2><p>Purchase raffle tickets. Visit our sponsors. Thank you for supporting United Way.</p></div></section>
}
function HoldCards({ settings }) {
  return <section className="special hold-screen"><div><p className="eyebrow"><Trophy/> Bingo Called</p><h2>Hold your cards!</h2><p>Please wait while we verify the winner.</p><LogoCloud sponsors={settings.sponsors}/></div></section>
}
function Thanks({ settings }) {
  return <section className="special thanks-screen"><div><p className="eyebrow"><Sparkles/> Thank You</p><h2>Thank you for joining us.</h2><p>Because of your support tonight, ESC Young Professionals and United Way can continue making an impact in our community.</p><LogoCloud sponsors={settings.sponsors}/></div></section>
}

function Host() { return <RequirePasscode><HostInner/></RequirePasscode> }
function HostInner() {
  const { game, settings, setGame, setSettings, online } = useEventState();
  const [auto, setAuto] = useState(false);
  const [seconds, setSeconds] = useState(8);
  const [announcement, setAnnouncement] = useState('');
  const lockedByOther = game.hostLock && game.hostLock.id !== hostId;
  useEffect(()=>{ if(!game.hostLock) setGame(g=>({...g, hostLock:{id:hostId, at:Date.now()}})); }, [game.hostLock]);
  useEffect(()=>{ if(!auto || lockedByOther || game.mode !== 'live') return; const t=setTimeout(()=>callNext(), seconds*1000); return ()=>clearTimeout(t); }, [auto, game.called, seconds, lockedByOther, game.mode]);
  async function callNext(){ const rem=remaining(game.called||[]); if(!rem.length) return; const next=rem[Math.floor(Math.random()*rem.length)]; await setGame(g=>({...g, called:[...(g.called||[]), next], mode:'live'})); speak(labelFor(next)); }
  async function undo(){ await setGame(g=>({...g, called:(g.called||[]).slice(0,-1)})); }
  async function reset(){ if(confirm('Start a new round and clear all called numbers?')) await setGame(g=>({...g, called:[], mode:'live', announcement:''})); }
  async function release(){ await setGame(g=>({...g, hostLock:null})); sessionStorage.removeItem('esc-pass-ok'); location.href='/'; }
  return <div className="host-page"><aside><img src="/assets/esyp-logo.png"/><h1>Host Controls</h1><p>{online?'Firebase sync ready.':'Local preview mode.'}</p><a href="/audience" target="_blank"><Eye/> Open Audience Display</a><button onClick={release}><LogOut/> Log out / release host</button></aside><main>{lockedByOther ? <div className="locked"><h2>Another host is active.</h2><p>Only one host can control the game at a time.</p></div> : <><div className="host-grid"><button className="primary" onClick={callNext}>Call Next Number</button><button onClick={()=>setAuto(!auto)}>{auto?<Pause/>:<Play/>}{auto?'Pause Auto Call':'Start Auto Call'}</button><button onClick={undo}><Undo2/> Undo Last Call</button><button onClick={()=>setGame(g=>({...g, mode:'hold'}))}><Trophy/> Bingo Called</button><button onClick={()=>setGame(g=>({...g, mode:'beer'}))}><Beer/> Beer Break</button><button onClick={()=>setGame(g=>({...g, mode:'thanks'}))}><Sparkles/> Thank You Screen</button><button onClick={()=>setGame(g=>({...g, mode:'live'}))}><Monitor/> Live Bingo</button><button onClick={reset}><RotateCcw/> New Round</button></div><section className="control-card"><label>Auto-call speed: {seconds} seconds</label><input type="range" min="4" max="20" value={seconds} onChange={e=>setSeconds(Number(e.target.value))}/></section><section className="control-card"><label>Pattern</label><select value={settings.pattern} onChange={e=>setSettings(s=>({...s, pattern:e.target.value}))}>{patterns.map(p=><option key={p}>{p}</option>)}</select></section><section className="control-card"><label>Announcement Banner</label><div className="announce-row"><input value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="Last chance for raffle tickets!"/><button onClick={()=>setGame(g=>({...g, announcement}))}>Push</button><button onClick={()=>{setAnnouncement(''); setGame(g=>({...g, announcement:''}))}}>Clear</button></div></section><section className="status-card"><h2>{labelFor((game.called||[]).at(-1))}</h2><p>{(game.called||[]).length} numbers called • {remaining(game.called||[]).length} remaining</p></section></>}</main></div>
}

function Admin() { return <RequirePasscode><AdminInner/></RequirePasscode> }
function AdminInner() {
  const { settings, setSettings } = useEventState();
  const [draft, setDraft] = useState(settings);
  useEffect(()=>setDraft(settings), [settings]);
  const sponsorsText = (draft.sponsors||[]).map(s=>`${s.name}|${s.level}|${s.logo}`).join('\n');
  const tablesText = (draft.tableSponsors||[]).join('\n');
  const messagesText = (draft.breakMessages||[]).join('\n');
  function updateSponsors(text){ setDraft(d=>({...d, sponsors:text.split('\n').filter(Boolean).map(line=>{const [name, level, logo]=line.split('|'); return {name:name?.trim(), level:level?.trim()||'', logo:logo?.trim()||''}})})); }
  return <div className="admin-page"><div className="admin-card"><h1>Admin Settings</h1><p>Update yearly event content here. Sponsor format: Name | Level | Logo URL</p><label>Event title</label><input value={draft.eventTitle} onChange={e=>setDraft({...draft,eventTitle:e.target.value})}/><label>Presented by</label><input value={draft.presentedBy} onChange={e=>setDraft({...draft,presentedBy:e.target.value})}/><label>Beneficiary</label><input value={draft.beneficiary} onChange={e=>setDraft({...draft,beneficiary:e.target.value})}/><label>Sponsors</label><textarea rows="8" value={sponsorsText} onChange={e=>updateSponsors(e.target.value)}/><label>Table sponsors, one per line</label><textarea rows="7" value={tablesText} onChange={e=>setDraft({...draft,tableSponsors:e.target.value.split('\n').filter(Boolean)})}/><label>Beer Break messages, one per line</label><textarea rows="5" value={messagesText} onChange={e=>setDraft({...draft,breakMessages:e.target.value.split('\n').filter(Boolean)})}/><div className="admin-actions"><button onClick={()=>setSettings(draft)}>Save Settings</button><a href="/host">Back to Host</a></div></div></div>
}
function App(){ const path=window.location.pathname; if(path.startsWith('/audience')) return <Audience/>; if(path.startsWith('/host')) return <Host/>; if(path.startsWith('/admin')) return <Admin/>; return <Landing/> }

createRoot(document.getElementById('root')).render(<App/>);
