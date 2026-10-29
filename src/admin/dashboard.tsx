import { useEffect, useState, type ReactNode } from "react";
import type { IconKey } from "./icons";
import { FEED, THEME_KEY, groups, rail, settings } from "./config";
import { ProfileMenu } from "./profile-menu";
import { IntegrationsList } from "./integrations";
import { OverviewFeed } from "./feed";
import { completed, greeting, suggestions, upNext } from "./feed-data";

/** `initial` opens on a specific section and page (defaults to Home → first item). */
export function Dashboard({ icons: I, initial }: { icons: Record<IconKey, ReactNode>; initial?: { area: string; page?: string } }) {
  const [area, setArea] = useState(initial?.area ?? "home");
  const [page, setPage] = useState<Record<string, string>>(() => ({ ...Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, g[0].items[0].id])), ...(initial?.page ? { [initial.area]: initial.page } : {}) }));
  const [open, setOpen] = useState(true);
  // No server render here, so read the theme AdminApp already applied instead of syncing it after paint.
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("ds-dark"));
  const toggleTheme = () => { const d = !dark; setDark(d); document.documentElement.classList.toggle("ds-dark", d); try { localStorage.setItem(THEME_KEY, d ? "dark" : "light"); } catch {} };

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "[" && !(e.target instanceof HTMLInputElement)) setOpen(o => !o); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);

  const section = area === settings.id ? settings : rail.find(r => r.id === area)!;
  const go = (id: string) => { if (id === area) setOpen(o => !o); else { setArea(id); setOpen(true); } };
  const show = (id: string, pg?: string) => { setArea(id); setOpen(true); if (pg) setPage(p => ({ ...p, [id]: pg })); };
  const list = groups[area] ?? [];
  const cur = list.flatMap(g => g.items).find(it => it.id === page[area]);
  const title = cur?.l ?? section.l;
  const feed = area === FEED.area && page[FEED.area] === FEED.page;

  return <div className="db">
    <div className="db-shell">
      <aside className="db-rail">
        <div className="db-logo" aria-hidden="true" />
        <nav aria-label="Primary">
          {rail.map(r => <button key={r.id} type="button" aria-label={r.l} title={r.l} aria-current={r.id === area ? "page" : undefined}
            onClick={() => go(r.id)}>{I[r.i]}</button>)}
        </nav>
        <button type="button" className="db-theme" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"} onClick={toggleTheme}>
          <span data-on={!dark}>{I.moon}</span><span data-on={dark}>{I.sun}</span>
        </button>
        <ProfileMenu icons={I} onNavigate={show} dark={dark} onToggleTheme={toggleTheme} />
      </aside>

      <aside className="db-side" data-open={open} aria-hidden={!open}>
        <div className="db-side-head">
          <h2>{section.l}</h2>
          <button type="button" className="db-icon-btn" aria-label="Collapse sidebar" title="Collapse sidebar  [" onClick={() => setOpen(false)}>{I.panel}</button>
        </div>
        {list.length ? list.map(g => <div key={g.h} className="db-group">
          <h3>{g.h}</h3>
          {g.items.map(it => <button key={it.id} type="button" aria-current={page[area] === it.id ? "page" : undefined}
            onClick={() => setPage(p => ({ ...p, [area]: it.id }))}>{I[it.i]}{it.l}</button>)}
        </div>) : <p className="db-empty">Nothing here yet.</p>}
      </aside>

      {feed ? <main className="db-main db-main-feed">
        {!open && <button type="button" className="db-icon-btn db-feed-expand" aria-label="Expand sidebar" onClick={() => setOpen(true)} style={{ transform: "scaleX(-1)" }}>{I.panel}</button>}
        <OverviewFeed I={I} greeting={greeting} suggestions={suggestions} upNext={upNext} completed={completed} />
      </main> : <main className="db-main">
        <div className="db-main-head">
          {!open && <button type="button" className="db-icon-btn" aria-label="Expand sidebar" onClick={() => setOpen(true)} style={{ transform: "scaleX(-1)" }}>{I.panel}</button>}
          <h1>{title}</h1>
        </div>
        <p>{cur?.d}</p>
        {area === settings.id && page[area] === "integrations" ? <IntegrationsList I={I} /> : <div className="db-blank">Content coming soon</div>}
      </main>}
    </div>
  </div>;
}
