// Changelog: every commit on main, read live from GitHub in the browser. A push shows up here within
// POLL_MS with no rebuild. Polls send the last ETag, so unchanged checks are 304s that GitHub doesn't count.
import { useEffect, useRef, useState } from "react";
import { REPO } from "./config";
import "./changelog.css";

const API = `https://api.github.com/repos/${REPO}/commits?sha=main&per_page=60`;
const POLL_MS = 2 * 60_000;

type Entry = { sha: string; title: string; body: string[]; date: Date; author: string; url: string };
type GitHubCommit = { sha: string; html_url: string; author: { login: string } | null; commit: { message: string; author: { name: string; date: string } } };

function toEntry(c: GitHubCommit): Entry {
  const [title, ...rest] = c.commit.message.split("\n");
  // Trailers (Co-Authored-By and the like) are bookkeeping, not changelog.
  const text = rest.join("\n").replace(/^[A-Za-z-]+: .+$/gm, "").trim();
  return {
    sha: c.sha, title, url: c.html_url,
    body: text ? text.split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, " ").trim()) : [],
    date: new Date(c.commit.author.date),
    author: c.author?.login ?? c.commit.author.name,
  };
}

const dayKey = (d: Date) => d.toDateString();
function dayLabel(d: Date, now: Date) {
  const days = Math.round((new Date(dayKey(now)).getTime() - new Date(dayKey(d)).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", ...(d.getFullYear() !== now.getFullYear() && { year: "numeric" }) });
}
const time = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
function ago(d: Date, now: Date) {
  const s = Math.max(0, Math.round((now.getTime() - d.getTime()) / 1000));
  return s < 45 ? "just now" : s < 3600 ? `${Math.round(s / 60)} min ago` : `${Math.round(s / 3600)} h ago`;
}

type State = { entries: Entry[] | null; checked: Date | null; loading: boolean; error: string | null };

/** Fetches on mount, every POLL_MS while the tab is visible, and when the tab comes back. */
function useCommits() {
  const [state, setState] = useState<State>({ entries: null, checked: null, loading: true, error: null });
  const etag = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let last = 0;
    const load = async () => {
      if (inFlight) return;
      inFlight = true;
      setState(s => ({ ...s, loading: true }));
      try {
        const res = await fetch(API, { headers: { Accept: "application/vnd.github+json", ...(etag.current && { "If-None-Match": etag.current }) } });
        if (cancelled) return;
        last = Date.now();
        if (res.status === 304) return setState(s => ({ ...s, loading: false, error: null, checked: new Date() }));
        if (!res.ok) {
          const reset = Number(res.headers.get("X-RateLimit-Reset"));
          const error = res.status === 403 && reset
            ? `GitHub's hourly limit for this network is used up. It resets at ${time(new Date(reset * 1000))}.`
            : `Couldn't reach GitHub (${res.status}).`;
          return setState(s => ({ ...s, loading: false, error, checked: new Date() }));
        }
        etag.current = res.headers.get("ETag");
        const entries = ((await res.json()) as GitHubCommit[]).map(toEntry);
        if (!cancelled) setState({ entries, checked: new Date(), loading: false, error: null });
      } catch {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: "Couldn't reach GitHub. Retrying shortly.", checked: new Date() }));
      } finally {
        inFlight = false;
      }
    };
    load();
    const timer = setInterval(() => { if (!document.hidden) load(); }, POLL_MS);
    const visible = () => { if (!document.hidden && Date.now() - last > POLL_MS / 2) load(); };
    document.addEventListener("visibilitychange", visible);
    return () => { cancelled = true; clearInterval(timer); document.removeEventListener("visibilitychange", visible); };
  }, []);

  return state;
}

/** Re-renders every 30s so "2 min ago" stays true between polls. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function Item({ e }: { e: Entry }) {
  const [open, setOpen] = useState(false);
  return <li className="cl-item">
    <div className="cl-line">
      <span className="cl-time">{time(e.date)}</span>
      <div className="cl-main">
        {e.body.length > 0
          ? <button type="button" className="cl-title" aria-expanded={open} onClick={() => setOpen(o => !o)}>{e.title}</button>
          : <span className="cl-title">{e.title}</span>}
        {open && <div className="cl-body">{e.body.map((p, i) => <p key={i}>{p}</p>)}</div>}
      </div>
      <a className="cl-sha" href={e.url} target="_blank" rel="noreferrer" title={`Open ${e.sha.slice(0, 7)} on GitHub`}>{e.sha.slice(0, 7)}</a>
    </div>
  </li>;
}

export function Changelog() {
  const { entries, checked, loading, error } = useCommits();
  const now = useNow();
  const days: { label: string; list: Entry[] }[] = [];
  for (const e of entries ?? []) {
    const label = dayLabel(e.date, now);
    if (days.at(-1)?.label === label) days.at(-1)!.list.push(e);
    else days.push({ label, list: [e] });
  }

  return <div className="cl">
    <div className="cl-bar">
      <span className="cl-live" data-loading={loading} aria-hidden="true" />
      <span>Live from <a href={`https://github.com/${REPO}/commits/main`} target="_blank" rel="noreferrer">{REPO}</a> · main</span>
      <span className="cl-checked" role="status">{loading && !entries ? "Loading…" : checked ? `Checked ${ago(checked, now)}` : ""}</span>
    </div>
    {error && <p className="cl-error" role="alert">{error}</p>}
    {days.map(d => <section key={d.label} className="cl-day">
      <h3>{d.label}<span>{d.list.length}</span></h3>
      <ol>{d.list.map(e => <Item key={e.sha} e={e} />)}</ol>
    </section>)}
    {entries?.length === 0 && <p className="cl-empty">No commits on main yet.</p>}
  </div>;
}
