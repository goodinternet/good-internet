import { useEffect, useRef, useState } from 'react';
import { LinkButton } from '@cloudflare/kumo/components/button';
import { createGradient } from './lava/engine/gradient';
import { firstLoad } from './lava/first-load';
import type { Recipe } from './lava/engine/recipe';
import { getTheme, setTheme } from '../../good-internet/theme';
import type { Theme } from '../../good-internet/theme';
import 'gen-interface-jp/display-400.css';
import 'gen-interface-jp/display-700.css';
import './minimal.css';

const cards = [
  ['Collect', 'Bring the references that matter into one private, browser-based library.'],
  ['Preserve', 'Keep original files intact, with optimized previews for browsing.'],
  ['Organize', 'Give everything context through collections, tags, and notes.'],
  ['Retrieve', "Find the things you've kept when you need them again."],
];
const palettes: Recipe['stops'][] = [
  firstLoad.stops,
  [[0,[254,185,210]],[.165,[255,186,121]],[.87,[250,237,145]],[1,[238,248,168]]],
  [[0,[178,221,254]],[.165,[147,232,211]],[.87,[219,246,151]],[1,[247,245,174]]],
  [[0,[186,190,254]],[.165,[230,166,238]],[.87,[255,193,166]],[1,[255,224,171]]],
];

function LavaCard({ index }: { index: number }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const recipe = { ...firstLoad, stops: palettes[index], seed: firstLoad.seed + index * 917, angle: 78 + index * 27 };
    const lava = createGradient(host.current, recipe);
    return () => lava.destroy();
  }, [index]);
  return <article className={`minimal-card minimal-card-${index}`}>
    <div className="minimal-lava" ref={host} aria-hidden="true" />
    <h3>{cards[index][0]}</h3><p>{cards[index][1]}</p>
  </article>;
}

export function Landing() {
  const rail = useRef<HTMLDivElement>(null);
  const [theme, updateTheme] = useState<Theme>(getTheme);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const node = rail.current!;
    const measure = () => setEdges({ start: node.scrollLeft < 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    node.addEventListener('scroll', measure, { passive: true });
    measure();
    return () => { observer.disconnect(); node.removeEventListener('scroll', measure); };
  }, []);
  function move(direction: number) {
    const node = rail.current!;
    const card = node.firstElementChild as HTMLElement;
    node.scrollBy({ left: direction * (card.offsetWidth + 14), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <div className="minimal-site">
    <header className="minimal-nav minimal-container">
      <a className="minimal-brand" href="#overview">Good Internet</a>
      <nav aria-label="Main navigation"><a href="#overview">Overview</a><a href="#platform">Platform</a><a href="#status">Status</a></nav>
      <div className="minimal-nav-end"><LinkButton className="minimal-signin" variant="secondary" href="/login">Prototype sign-in</LinkButton>
        <label className="minimal-theme"><span className="minimal-sr">Appearance</span><select aria-label="Appearance" value={theme} onChange={e => { const next = e.target.value as Theme; updateTheme(next); setTheme(next); }}><option value="system">System ◐</option><option value="light">Light ☼</option><option value="dark">Dark ☾</option></select></label>
      </div>
    </header>
    <main>
      <section id="overview" className="minimal-intro minimal-container">
        <p className="minimal-label">GOOD INTERNET / IN DEVELOPMENT</p>
        <h1>Your references, kept whole and kept private.</h1>
        <p className="minimal-description">We're building a private, cloud-based home for collecting, organizing, and preserving the things worth keeping.</p>
      </section>
      <section id="platform" className="minimal-platform minimal-container" aria-labelledby="platform-title">
        <div className="minimal-section-heading"><div><h2 id="platform-title">The platform</h2><p>What we're building · Intended capabilities</p></div><div className="minimal-arrows"><button type="button" aria-label="Previous capability" disabled={edges.start} onClick={() => move(-1)}>‹</button><button type="button" aria-label="Next capability" disabled={edges.end} onClick={() => move(1)}>›</button></div></div>
        <div className="minimal-rail" ref={rail} tabIndex={0} role="region" aria-label="Planned platform capabilities">{cards.map(([title], index) => <LavaCard key={title} index={index} />)}</div>
      </section>
      <section id="status" className="minimal-status minimal-container"><h2>Where things stand</h2><p>Good Internet is currently in development. The reference workspace is a prototype, and cloud storage, backup, recovery, and sharing are being built or planned.</p></section>
    </main>
    <footer className="minimal-footer minimal-container"><div><strong>Good Internet</strong><p>Independent software · In development</p></div><p>© 2026 Good Internet</p></footer>
  </div>;
}
