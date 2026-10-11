import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowLeft, BadgeCheck, BatteryFull, BatteryCharging, BookOpen, Check, ChevronRight, Command, Grid2X2, Headphones, Laptop, Mail, Maximize2, Minimize2, Moon, MoreHorizontal, Music2, Pause, Play, Search, SkipBack, SkipForward, Sparkles, Sun, Terminal, X, Minus } from 'lucide-react';
import Projects from './components/Projects';
import Literature from './components/Literature';
import Resume from './components/Resume';
import { HOSTED_PLAYLIST } from './data/playlist';
import { desktopBounds, fitWindow, maximizeWindow, moveWindow, resizeWindow } from './lib/windowGeometry.mjs';
import './style.css';

const APPS = [
  { id: 'about', name: 'About me', short: 'About', description: 'The engineer, founder, and poet behind the desktop', width: 720, height: 610 },
  { id: 'projects', name: 'Projects', short: 'Projects', description: 'FoodFreaky, CIDA, and things I’ve built', width: 920, height: 660 },
  { id: 'literature', name: 'Literature & Poetry', short: 'Poetry', description: 'Poems, prose, and words that linger', width: 880, height: 680 },
  { id: 'music', name: 'Music', short: 'Music', description: 'A soundtrack for your time here', width: 680, height: 620 },
  { id: 'notes', name: 'Notes', short: 'Notes', description: 'A small place for thoughts', width: 620, height: 530 },
  { id: 'terminal', name: 'Terminal', short: 'Terminal', description: 'Explore the world through a few commands', width: 640, height: 420 },
  { id: 'contact', name: 'Contact', short: 'Contact', description: 'Say hello or leave a message', width: 650, height: 650 },
  { id: 'resume', name: 'Résumé', short: 'Résumé', description: 'Experience, education, certifications, and credentials', width: 710, height: 640 },
];
const getApp = id => APPS.find(app => app.id === id);
const MOBILE_DOCK = ['about', 'projects', 'literature', 'music', 'contact'];
function formatTime(seconds) { if (!Number.isFinite(seconds)) return '0:00'; return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; }
function AppIcon({ id, className = '' }) { return <img className={`app-art ${className}`} src={`/icons/${id}.svg`} alt="" draggable="false" />; }

function App() {
  const [entered, setEntered] = useState(false);
  const [windows, setWindows] = useState([]);
  const [active, setActive] = useState(null);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [clock, setClock] = useState(new Date());
  const [softSky, setSoftSky] = useState(false);
  const [battery, setBattery] = useState(null);
  const [batteryOpen, setBatteryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState(() => [...HOSTED_PLAYLIST]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState('');
  const [messageReady, setMessageReady] = useState(false);
  const [history, setHistory] = useState(['Welcome to Manav’s World.', 'Type help to see where you can go.']);
  const [command, setCommand] = useState('');
  const audio = useRef(null);
  const fileInput = useRef(null);
  const playlist = useRef(null);
  const searchInput = useRef(null);
  const searchDialog = useRef(null);
  const searchTrigger = useRef(null);
  const batteryPanel = useRef(null);
  const gesture = useRef(null);
  const boundsRef = useRef(desktopBounds(viewport));
  const urls = useRef([]);
  const track = tracks[trackIndex];
  const mobile = viewport.width < 700;
  const visibleWindows = windows.filter(win => !win.minimized);
  const activeWindow = visibleWindows.find(win => win.id === active);
  const musicVisible = visibleWindows.some(win => win.id === 'music') && (!mobile || active === 'music');
  const playbackIntent = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 15000);
    return () => { clearInterval(timer); urls.current.forEach(url => URL.revokeObjectURL(url)); };
  }, []);
  useEffect(() => {
    const update = () => {
      const next = { width: window.innerWidth, height: window.innerHeight };
      const bounds = desktopBounds(next); boundsRef.current = bounds; setViewport(next);
      setWindows(items => items.map(win => fitWindow(win.maximized ? { ...win, x: 16, y: 16, width: bounds.width, height: bounds.height } : win, bounds)));
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    let alive = true, manager;
    const update = () => { if (alive) setBattery({ percent: Math.round(manager.level * 100), charging: manager.charging }); };
    if (navigator.getBattery) navigator.getBattery().then(result => {
      if (!alive) return; manager = result; update();
      manager.addEventListener('levelchange', update); manager.addEventListener('chargingchange', update);
    }).catch(() => {});
    return () => { alive = false; if (manager) { manager.removeEventListener('levelchange', update); manager.removeEventListener('chargingchange', update); } };
  }, []);
  useEffect(() => {
    const cfToken = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN;
    const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    const umamiSrc = import.meta.env.VITE_UMAMI_SCRIPT_URL;
    if (!cfToken && !(umamiId && umamiSrc)) return;
    const script = document.createElement('script'); script.defer = true;
    if (cfToken) { script.src = 'https://static.cloudflareinsights.com/beacon.min.js'; script.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken })); }
    else { script.src = umamiSrc; script.dataset.websiteId = umamiId; script.dataset.domains = window.location.hostname; }
    document.head.appendChild(script); return () => script.remove();
  }, []);

  const focusWindow = id => requestAnimationFrame(() => document.querySelector(`[data-window="${id}"]`)?.focus({ preventScroll: true }));
  const focusDock = id => requestAnimationFrame(() => {
    const appButton = document.querySelector(`.dock [data-launch="${id}"]`);
    const target = appButton?.offsetParent ? appButton : document.querySelector('.dock-launcher');
    target?.focus({ preventScroll: true });
  });
  const bringForward = id => {
    setActive(id);
    setWindows(items => items.at(-1)?.id === id ? items : [...items.filter(win => win.id !== id), ...items.filter(win => win.id === id)]);
  };
  const openApp = (id, section) => {
    const app = getApp(id); if (!app) return;
    setEntered(true); setActive(id); setSearchOpen(false); setBatteryOpen(false);
    setWindows(items => {
      const existing = items.find(win => win.id === id);
      const bounds = boundsRef.current;
      const offset = (items.filter(win => !win.minimized).length % 3) * 20;
      const sectionOverride = id === 'resume' && section ? { section } : {};
      const win = existing ? { ...existing, ...sectionOverride, minimized: false } : fitWindow({ id, ...sectionOverride, minimized: false, maximized: false, width: app.width, height: app.height, x: (bounds.width - app.width) / 2 + offset, y: (bounds.height - app.height) / 2 + offset }, bounds);
      return [...items.filter(item => item.id !== id), win];
    });
    focusWindow(id);
  };
  const dismissWindow = (id, minimize = false) => {
    setWindows(items => {
      const next = minimize ? items.map(win => win.id === id ? { ...win, minimized: true } : win) : items.filter(win => win.id !== id);
      const nextActive = next.filter(win => !win.minimized).at(-1)?.id || null;
      setActive(nextActive);
      return next;
    });
    focusDock(id);
  };
  const toggleMaximize = id => setWindows(items => items.map(win => win.id === id ? maximizeWindow(win, boundsRef.current) : win));
  const centerWindow = id => setWindows(items => items.map(win => win.id === id ? fitWindow({ ...win, maximized: false, x: (boundsRef.current.width - win.width) / 2, y: (boundsRef.current.height - win.height) / 2 }, boundsRef.current) : win));
  const presetSize = (id, factor) => setWindows(items => items.map(win => win.id === id ? fitWindow({ ...win, maximized: false, width: win.width * factor, height: win.height * factor }, boundsRef.current) : win));
  const showDesktop = () => { setWindows(items => items.map(win => ({ ...win, minimized: true }))); setActive(null); setBatteryOpen(false); };

  const startGesture = (event, win, edge) => {
    if (mobile || win.maximized || (!edge && event.target.closest('button, a, input, textarea, summary, details'))) return;
    event.preventDefault(); event.stopPropagation(); bringForward(win.id);
    gesture.current = { id: win.id, start: { ...win }, edge, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  useEffect(() => {
    const move = event => {
      const current = gesture.current; if (!current || current.pointerId !== event.pointerId) return;
      event.preventDefault();
      const dx = event.clientX - current.x, dy = event.clientY - current.y;
      const next = current.edge ? resizeWindow(current.start, current.edge, dx, dy, boundsRef.current) : moveWindow(current.start, dx, dy, boundsRef.current);
      setWindows(items => items.map(win => win.id === current.id ? next : win));
    };
    const finish = () => { gesture.current = null; };
    window.addEventListener('pointermove', move, { passive: false }); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish); };
  }, []);
  useEffect(() => {
    const key = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (!searchOpen) searchTrigger.current = document.activeElement; setSearchOpen(value => !value); }
      if (event.key === 'Escape') { setSearchOpen(false); setBatteryOpen(false); }
      if (!searchOpen && event.altKey && event.key === 'ArrowUp' && active) { event.preventDefault(); toggleMaximize(active); }
      if (!searchOpen && event.altKey && event.key === 'ArrowDown' && active) { event.preventDefault(); dismissWindow(active, true); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [active, searchOpen]);
  useEffect(() => {
    if (!searchOpen) { setQuery(''); return; }
    searchInput.current?.focus({ preventScroll: true });
    const key = event => {
      if (event.key !== 'Tab') return;
      const controls = [...searchDialog.current.querySelectorAll('button, input')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus({ preventScroll: true }); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({ preventScroll: true }); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); searchTrigger.current?.focus?.({ preventScroll: true }); };
  }, [searchOpen]);
  useEffect(() => {
    if (!batteryOpen) return;
    const close = event => { if (!batteryPanel.current?.contains(event.target) && !event.target.closest('.battery-toggle')) setBatteryOpen(false); };
    document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close);
  }, [batteryOpen]);

  const playbackError = item => item?.source === 'hosted' ? 'This song is unavailable right now. Try another track.' : 'This file could not be played. Try another audio file.';
  const playTrack = async item => {
    setAudioError(''); setLoadingAudio(true);
    try {
      await audio.current.play();
      if (audio.current.getAttribute('src') === item.url) setLoadingAudio(false);
    } catch (error) {
      // A source change or a pause cancels the old play request; it is not a failure of the new song.
      if (error.name === 'AbortError' || audio.current.getAttribute('src') !== item.url || !playbackIntent.current) return;
      playbackIntent.current = false; setLoadingAudio(false); setAudioError(playbackError(item)); setPlaying(false);
    }
  };
  const togglePlayback = () => {
    if (!track) return;
    if (playing || playbackIntent.current) { playbackIntent.current = false; setLoadingAudio(false); audio.current.pause(); return; }
    playbackIntent.current = true; playTrack(track);
  };
  const selectTrack = index => { if (index === trackIndex) return; setTrackIndex(index); setPlaying(false); setLoadingAudio(playbackIntent.current); setElapsed(0); setDuration(0); setAudioError(''); };
  const nextTrack = (direction = 1) => selectTrack((trackIndex + direction + tracks.length) % tracks.length);
  useEffect(() => {
    if (!track || !audio.current) return;
    if (playbackIntent.current) playTrack(track);
  }, [track?.url]);
  useEffect(() => {
    if (!musicVisible) return;
    const list = playlist.current;
    const selected = list?.querySelector('[aria-current="true"]');
    if (!selected) return;
    const top = selected.offsetTop, bottom = top + selected.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }, [trackIndex, musicVisible]);
  const chooseFiles = event => {
    const files = [...event.target.files].filter(file => file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name));
    if (!files.length) return;
    const additions = files.map(file => { const url = URL.createObjectURL(file); urls.current.push(url); return { title: file.name.replace(/\.[^.]+$/, ''), artist: 'Local file', source: 'local', url }; });
    if (!tracks.length) selectTrack(0);
    setTracks(items => [...items, ...additions]); event.target.value = '';
  };
  const seek = value => { audio.current.currentTime = Number(value); setElapsed(Number(value)); };
  const runCommand = event => {
    event.preventDefault(); const value = command.trim().toLowerCase();
    const reply = value === 'help' ? 'Explore: about, projects, literature, music, notes, contact, resume\nOther commands: whoami, clear, desktop' : value === 'whoami' ? 'Manav Mehta · backend engineer, FoodFreaky co-founder, poet.' : value === 'desktop' ? 'Back to the stars.' : getApp(value) ? `Opening ${getApp(value).name}…` : 'That command is a little outside this universe. Try help.';
    if (value === 'clear') setHistory([]); else setHistory(items => [...items, `manav ~ ❯ ${command}`, reply]);
    if (getApp(value)) openApp(value); if (value === 'desktop') showDesktop(); setCommand('');
  };
  const openSearch = event => { searchTrigger.current = event.currentTarget; setSearchOpen(true); setBatteryOpen(false); };
  const openSearchResult = app => openApp(app.id, app.id === 'resume' && /cert|credential/i.test(query) ? 'certifications' : undefined);
  const setResumeSection = section => setWindows(items => items.map(win => win.id === 'resume' ? { ...win, section } : win));

  const renderContent = (id, win) => {
    if (id === 'projects') return <Projects />;
    if (id === 'literature') return <Literature />;
    if (id === 'about') return <div className="about-view">
      <div className="about-top"><AppIcon id="about" /><span className="overline">A LITTLE INTRODUCTION</span><span className="about-orbit" aria-hidden="true">✦</span></div>
      <h1>Hey, I’m Manav<span>.</span></h1><p className="about-headline">I build systems.<br />And write between the lines.</p>
      <p className="about-bio">A backend engineer at Infosys, a co-founder of FoodFreaky, and a poet with a playlist for almost everything.</p>
      <div className="about-details"><div><span className="detail-label">CURRENTLY</span><p>Java & Spring Boot<br /><strong>Infosys</strong></p></div><div><span className="detail-label">BUILT FROM AN IDEA</span><p>Campus food delivery<br /><strong>FoodFreaky</strong></p></div><div><span className="detail-label">AFTER HOURS</span><p>A few words.<br /><strong>A favourite song.</strong></p></div></div>
      <div className="about-actions"><button className="button-primary" onClick={() => openApp('projects')}>Explore my work <ArrowUpRight size={16} /></button><button className="button-subtle" onClick={() => openApp('contact')}>Say hello <ArrowRight size={16} /></button><button className="button-subtle" onClick={() => openApp('resume', 'certifications')}>Certifications <BadgeCheck size={16} /></button></div>
      <div className="about-bottom"><span><i /> Based in India</span><button onClick={() => openApp('literature')}>There’s a quieter side to me <BookOpen size={14} /></button></div>
    </div>;
    if (id === 'music') return <div className="music-view">
      <div className="music-heading"><div><span className="overline">THE SOUNDTRACK</span><h1>A little music.<br />A little escape.</h1></div><Headphones size={24} strokeWidth={1.4} /></div>
      <div className="music-layout">
        <div className="record-side">
          <div className={`vinyl ${playing ? 'is-playing' : ''}`}><div className="vinyl-label"><span>m.</span><small>MANAV’S WORLD</small><i /></div></div>
          <div className="track-details"><h2>{track?.title || 'Your soundtrack goes here'}</h2><p>{track?.artist || 'A few of my favourite songs.'}</p></div>
          <div className="playback-controls">
            <button disabled={tracks.length < 2} aria-label="Previous track" onClick={() => nextTrack(-1)}><SkipBack size={19} /></button>
            <button className="play-main" disabled={!track} aria-label={loadingAudio ? 'Cancel loading music' : playing ? 'Pause music' : 'Play music'} onClick={togglePlayback}>{playing || loadingAudio ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
            <button disabled={tracks.length < 2} aria-label="Next track" onClick={() => nextTrack(1)}><SkipForward size={19} /></button>
          </div>
          {track && <div className="track-progress"><input type="range" aria-label="Song position" disabled={!duration} min="0" max={duration || 0} step="1" value={Math.min(elapsed, duration || 0)} onChange={event => seek(event.target.value)} /><div><span>{formatTime(elapsed)}</span><span>{duration ? formatTime(duration) : '—'}</span></div></div>}
          {loadingAudio && <p className="music-loading" role="status">Loading your song…</p>}
        </div>
        <div className="playlist-side">
          <div className="playlist-title"><h2>My favourites</h2><span>{tracks.length} songs to stay a little longer</span></div>
          <div className="playlist" ref={playlist}>{tracks.map((item, index) => <button key={item.url} className={index === trackIndex ? 'selected' : ''} aria-current={index === trackIndex ? 'true' : undefined} onClick={() => selectTrack(index)}><span className="playlist-number">{index === trackIndex && playing ? <Music2 size={14} /> : String(index + 1).padStart(2, '0')}</span><span className="playlist-info"><b>{item.title}</b><small>{item.artist}</small></span>{index === trackIndex && <i />}</button>)}</div>
          <button className="button-subtle song-picker" onClick={() => fileInput.current.click()}><span>＋</span> Add local songs</button>
          <small className="music-local-note">Press play, then make yourself at home.</small>
          {audioError && <p className="form-status" role="alert">{audioError}</p>}
        </div>
      </div>
    </div>;
    if (id === 'notes') return <div className="notes-view"><span className="overline">A PLACE FOR THOUGHTS</span><h1>Notes to the universe.</h1><p className="view-intro">A small corner for the things worth remembering.</p><article className="thought-note"><span>01 / A THOUGHT FOR TONIGHT</span><blockquote>“Somewhere, something incredible is waiting to be built.”</blockquote><small>Sample note · Personal notes coming soon</small></article><article className="thought-note lilac"><span>02 / A QUIET REMINDER</span><blockquote>“Stay curious. Leave room for wonder.”</blockquote><small>Sample note</small></article><button className="button-subtle" onClick={() => openApp('literature')}>Read my poems <ArrowRight size={16} /></button></div>;
    if (id === 'terminal') return <div className="terminal-view"><div className="terminal-welcome"><Terminal size={18} /><span>manav@world</span><small>Make yourself at home.</small></div><div className="terminal-history" role="log" aria-live="polite">{history.map((line, index) => <div className={line.startsWith('manav ~') ? 'terminal-command' : ''} key={index}>{line}</div>)}</div><form onSubmit={runCommand}><label htmlFor="command-input">manav ~ ❯</label><input id="command-input" aria-label="Terminal command" value={command} onChange={event => setCommand(event.target.value)} autoComplete="off" spellCheck="false" /></form></div>;
    if (id === 'contact') return <div className="contact-view"><span className="overline">TRANSMISSIONS ARE OPEN</span><h1>Let’s make something<br />worth making.</h1><p className="view-intro">An idea, an opportunity, or a simple hello.<br />I’d love to hear from you.</p><div className="contact-links">{[['Email', 'mailto:mmanavp10@gmail.com', 'mmanavp10@gmail.com'], ['LinkedIn', 'https://linkedin.com/in/manavaa', 'Let’s connect'], ['GitHub', 'https://github.com/manava10', 'See what I’m building']].map(([name, url, label]) => <a key={name} href={url} target={name === 'Email' ? undefined : '_blank'} rel="noreferrer"><span><b>{name}</b><small>{label}</small></span><ArrowUpRight size={18} /></a>)}</div><section className="message-section"><h2>Leave me a message</h2><form onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const subject = `A hello from ${data.get('name')}`; const body = `${data.get('message')}\n\nFrom: ${data.get('name')}\nReply to: ${data.get('email')}`; window.location.href = `mailto:mmanavp10@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; setMessageReady(true); }}><div className="form-row"><label>Your name<input name="name" required maxLength={100} autoComplete="name" placeholder="What should I call you?" /></label><label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label></div><label>Your message<textarea name="message" required maxLength={5000} rows={4} placeholder="Tell me what’s on your mind…" /></label><button className="button-primary" type="submit">Open email draft <ArrowUpRight size={16} /></button><small>Review and send from your email app.</small>{messageReady && <p className="form-status" role="status">Email draft requested. If your email app didn’t open, write to mmanavp10@gmail.com.</p>}</form></section></div>;
    if (id === 'resume') return <Resume section={win.section || 'overview'} onSectionChange={setResumeSection} />;
  };

  return <main className={`world ${softSky ? 'soft-sky' : ''} ${entered ? 'has-entered' : ''}`}>
    <div className="sky" aria-hidden="true"><div className="sky-glow" /><div className="horizon" />{Array.from({ length: 85 }, (_, index) => <i key={index} style={{ left: `${(index * 73.31) % 100}%`, top: `${(index * 37.67) % 100}%`, '--star-size': index % 9 === 0 ? '2px' : '1px', '--star-delay': `${index % 9}s` }} />)}<div className="sky-constellation"><span /><span /><span /><span /><span /></div></div>
    <header className="desktop-menu"><div className="menu-identity"><button className="world-mark" aria-label="Open About Me" onClick={() => openApp('about')}>✦</button><b>Manav’s World</b><span className="current-app">{activeWindow ? getApp(activeWindow.id).name : 'Desktop'}</span></div><div className="menu-tools"><button aria-label="Search apps" title="Search apps (⌘K)" onClick={openSearch}><Search size={16} /></button><button aria-label={softSky ? 'Use night sky' : 'Use softer sky'} onClick={() => setSoftSky(value => !value)}>{softSky ? <Sun size={16} /> : <Moon size={16} />}</button>{entered && <button className="desktop-toggle" aria-label="Show desktop" onClick={showDesktop}><Laptop size={17} /></button>}<button className="battery-toggle" aria-label="Battery status" aria-expanded={batteryOpen} onClick={() => setBatteryOpen(value => !value)}>{battery?.charging ? <BatteryCharging size={20} /> : <BatteryFull size={20} />}<span>{battery ? `${battery.percent}%` : '—'}</span></button><time dateTime={clock.toISOString()}><span className="clock-date">{clock.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span><span>{clock.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span></time></div></header>
    {batteryOpen && <aside className="status-panel" ref={batteryPanel} aria-label="Device status"><div className="status-title"><b>This device</b><button aria-label="Close battery status" onClick={() => setBatteryOpen(false)}><X size={15} /></button></div>{battery ? <><div className="status-battery"><BatteryFull size={27} /><strong>{battery.percent}%</strong></div><p>{battery.charging ? 'Connected to power' : 'Running on battery'}</p><div className="battery-meter" role="progressbar" aria-label="Battery level" aria-valuenow={battery.percent} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${battery.percent}%` }} /></div></> : <p>Your browser doesn’t share battery information.</p>}<div className="status-divider" /><span className="detail-label">APPEARANCE</span><button className="status-theme" onClick={() => setSoftSky(value => !value)}>{softSky ? <Moon size={16} /> : <Sun size={16} />}{softSky ? 'Midnight sky' : 'Softer sky'}<ChevronRight size={14} /></button></aside>}
    {!entered ? <section className="welcome"><div className="welcome-emblem"><AppIcon id="about" /><span>✦</span></div><span className="welcome-overline">MANAV MEHTA / ENGINEER, FOUNDER & POET</span><h1>Welcome to<br />my little world<span>.</span></h1><p>A few things I’ve built. A few words I’ve written.<br />A soundtrack for everything in between.</p><button className="enter-world" onClick={() => openApp('about')}>Step inside <ArrowRight size={18} /></button><button className="welcome-work" onClick={() => openApp('projects')}>Here for the work? Start with Projects <ArrowUpRight size={13} /></button><div className="welcome-bottom"><span>Made of code, curiosity, and a little stardust.</span><span>✦</span></div></section> : <>
      <div className="desktop-stage"><div className={`desktop-intro ${visibleWindows.length ? 'is-covered' : ''}`}><span className="desktop-overline">YOUR OWN PACE. YOUR OWN ORBIT.</span><h1>A little curiosity.<br />An entire universe.</h1><p>Build something. Read something. Stay a little.</p><button onClick={() => openApp('projects')}>Explore my work <ArrowUpRight size={15} /></button></div><aside className="desktop-shortcuts" aria-label="Desktop shortcuts">{['projects', 'literature', 'resume'].map(id => <button key={id} data-launch={id} onClick={() => openApp(id)}><AppIcon id={id} /><span>{getApp(id).short}</span></button>)}</aside>
      {windows.map(win => <section key={win.id} hidden={win.minimized} inert={win.minimized || undefined} className={`app-window window-${win.id} ${win.id === active ? 'is-active' : ''} ${win.maximized ? 'is-maximized' : ''}`} role="dialog" aria-label={getApp(win.id).name} tabIndex={-1} data-window={win.id} style={{ left: win.x, top: win.y, width: win.width, height: win.height, zIndex: 10 + windows.indexOf(win) }} onPointerDown={event => { if (!event.target.closest('.window-lights')) bringForward(win.id); }} onFocusCapture={() => { if (active !== win.id) bringForward(win.id); }} onKeyDown={event => { if (event.key === 'Escape') { const menu = event.currentTarget.querySelector('.window-options'); if (menu) menu.open = false; } }}>
        <div className="window-titlebar" onPointerDown={event => startGesture(event, win)} onDoubleClick={event => { if (!event.target.closest('button,details')) toggleMaximize(win.id); }}><div className="window-lights" onPointerDown={event => event.stopPropagation()}><button className="light-close" aria-label="Close window" onClick={() => dismissWindow(win.id)}><X size={8} strokeWidth={3} /></button><button className="light-minimize" aria-label="Minimise window" onClick={() => dismissWindow(win.id, true)}><Minus size={8} strokeWidth={3} /></button><button className="light-maximize" aria-label={win.maximized ? 'Restore window' : 'Maximize window'} onClick={() => toggleMaximize(win.id)}>{win.maximized ? <Minimize2 size={8} strokeWidth={2.5} /> : <Maximize2 size={8} strokeWidth={2.5} />}</button></div><div className="window-title"><AppIcon id={win.id} /><span>{getApp(win.id).name}</span></div><details className="window-options"><summary aria-label="Window options"><MoreHorizontal size={17} /></summary><div><button onClick={event => { centerWindow(win.id); event.currentTarget.closest('details').open = false; }}>Center window</button><button onClick={event => { presetSize(win.id, 1.15); event.currentTarget.closest('details').open = false; }}>Make larger</button><button onClick={event => { presetSize(win.id, .85); event.currentTarget.closest('details').open = false; }}>Make smaller</button><button onClick={event => { toggleMaximize(win.id); event.currentTarget.closest('details').open = false; }}>{win.maximized ? 'Restore size' : 'Maximize window'}</button></div></details></div>
        <div className="window-content">{renderContent(win.id, win)}</div>{!mobile && !win.maximized && <>{['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(edge => <div key={edge} className={`resize-handle resize-${edge}`} aria-hidden="true" onPointerDown={event => startGesture(event, win, edge)} />)}<span className="resize-grip" aria-hidden="true">◢</span></>}
      </section>)}</div>
      <div className="desktop-footnote"><span>MANAV MEHTA</span><i /> ENGINEER · FOUNDER · POET</div>
      {track && <div className="now-playing"><button className="now-track" onClick={() => openApp('music')}><span className={`now-vinyl ${playing ? 'is-playing' : ''}`}>♪</span><span><small>{audioError ? 'SONG UNAVAILABLE' : loadingAudio ? 'LOADING YOUR SONG' : playing ? 'NOW PLAYING' : 'YOUR SOUNDTRACK'}</small><b>{track.title}</b></span></button><button aria-label={loadingAudio ? 'Cancel loading soundtrack' : playing ? 'Pause soundtrack' : 'Play soundtrack'} onClick={togglePlayback}>{playing || loadingAudio ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button></div>}
      <nav className="dock" aria-label="Desktop apps">{APPS.map(app => <button key={app.id} className={`dock-app ${MOBILE_DOCK.includes(app.id) ? '' : 'dock-extra'} ${active === app.id ? 'current' : ''}`} aria-label={app.name} data-launch={app.id} onClick={() => openApp(app.id)}><span className="dock-label">{app.name}</span><AppIcon id={app.id} /><span className={`dock-dot ${windows.some(win => win.id === app.id) ? 'is-running' : ''}`} /></button>)}<span className="dock-separator" /><button className="dock-launcher" aria-label="All apps" onClick={openSearch}><span className="dock-label">All apps</span><span className="launcher-icon"><Grid2X2 size={23} strokeWidth={1.5} /></span><span className="dock-dot" /></button></nav>
    </>}
    <input ref={fileInput} className="visually-hidden" type="file" multiple accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" tabIndex={-1} onChange={chooseFiles} />
    <audio ref={audio} src={track?.url} preload="none" onPlaying={() => { setPlaying(true); setLoadingAudio(false); }} onWaiting={() => { if (playbackIntent.current) { setPlaying(false); setLoadingAudio(true); } }} onPause={() => setPlaying(false)} onTimeUpdate={() => setElapsed(audio.current.currentTime)} onLoadedMetadata={() => setDuration(Number.isFinite(audio.current.duration) ? audio.current.duration : 0)} onEnded={() => { if (trackIndex < tracks.length - 1) { playbackIntent.current = true; selectTrack(trackIndex + 1); } else { playbackIntent.current = false; setPlaying(false); } }} onError={() => { if (track) { playbackIntent.current = false; setLoadingAudio(false); setAudioError(playbackError(track)); setPlaying(false); } }} />
    {searchOpen && <div className="search-shade" onPointerDown={event => { if (event.target === event.currentTarget) setSearchOpen(false); }}><section className="app-search" role="dialog" aria-modal="true" aria-label="Find an app" ref={searchDialog}><div className="search-field"><Search size={22} strokeWidth={1.5} /><input ref={searchInput} aria-label="Search apps" placeholder="Where do you want to go?" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); const result = APPS.find(app => `${app.name} ${app.description}`.toLowerCase().includes(query.toLowerCase())); if (result) openSearchResult(result); } }} /><button aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={16} /></button></div><div className="search-results">{APPS.filter(app => `${app.name} ${app.description}`.toLowerCase().includes(query.toLowerCase())).map(app => <button key={app.id} onClick={() => openSearchResult(app)}><AppIcon id={app.id} /><span><b>{app.name}</b><small>{app.description}</small></span><ArrowUpRight size={16} /></button>)}{!APPS.some(app => `${app.name} ${app.description}`.toLowerCase().includes(query.toLowerCase())) && <p className="search-empty">No app found. Try “poetry”, “projects”, or “music”.</p>}</div><div className="search-footer"><span>YOUR LITTLE UNIVERSE</span><span><Command size={11} /> K to open · Esc to close</span></div></section></div>}
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
