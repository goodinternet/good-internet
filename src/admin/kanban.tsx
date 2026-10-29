// Kanban: docs/admin/BACKLOG.md as lanes, after Autobahn (github.com/rams-design/autobahn).
// Drag a card between lanes, or onto a card to land before it; in dev the file is rewritten.
import { Fragment, useEffect, useRef, useState } from "react";
import source from "../../docs/admin/BACKLOG.md?raw";
import { LANES, SHIPPED, chip, moveCard, newCard, parse, type Card, type Lane } from "./backlog";
import "./kanban.css";

/** Only the dev server can write the file (see the admin-backlog plugin in vite.config.js). */
const WRITABLE = import.meta.env.DEV;

// Writes go out one at a time, so two quick moves land in order.
let queue = Promise.resolve();
const save = (md: string) => queue = queue.then(async () => {
  const res = await fetch("/__admin/backlog", { method: "PUT", body: md });
  if (!res.ok) throw new Error(`Couldn't save the backlog (${res.status})`);
});

/** Bold and code spans, the only inline marks the card grammar uses. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong>
    : part.startsWith("`") && part.endsWith("`") ? <code key={i}>{part.slice(1, -1)}</code>
    : <Fragment key={i}>{part}</Fragment>);
}

/** A card body: paragraphs and "- **Label:** value" lists, the label shown as a small tag. */
function Body({ md }: { md: string }) {
  const blocks: { list: boolean; lines: string[] }[] = [];
  for (const line of md.split("\n")) {
    const last = blocks[blocks.length - 1];
    if (!line.trim()) { if (last?.lines.length) blocks.push({ list: false, lines: [] }); continue; }
    if (/^- /.test(line)) { if (last?.list) last.lines.push(line.slice(2)); else blocks.push({ list: true, lines: [line.slice(2)] }); continue; }
    if (last?.list && /^\s/.test(line)) { last.lines[last.lines.length - 1] += " " + line.trim(); continue; }
    if (last && !last.list) last.lines.push(line.trim()); else blocks.push({ list: false, lines: [line.trim()] });
  }
  return <div className="kb-body">{blocks.filter(b => b.lines.length).map((b, i) => b.list
    ? <ul key={i}>{b.lines.map((l, j) => {
      const kv = l.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
      return <li key={j}>{kv ? <><span className="kb-kv">{kv[1]}</span>{inline(kv[2])}</> : inline(l)}</li>;
    })}</ul>
    : <p key={i}>{inline(b.lines.join(" "))}</p>)}</div>;
}

function CardFace({ c, onOpen, drag }: { c: Card; onOpen: () => void; drag: { start: () => void; over: boolean; enter: () => void; leave: () => void; drop: () => void } | null }) {
  const size = chip(c.size), tags = chip(c.tags);
  return <div className="kb-card" role="button" tabIndex={0} data-done={c.done} data-over={drag?.over || undefined} draggable={!!drag}
    onClick={onOpen} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
    onDragStart={e => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", c.id); drag?.start(); }}
    onDragOver={drag ? e => { e.preventDefault(); e.stopPropagation(); drag.enter(); } : undefined}
    onDragLeave={drag?.leave}
    onDrop={drag ? e => { e.preventDefault(); e.stopPropagation(); drag.drop(); } : undefined}>
    <div className="kb-chips">
      <span className="kb-id" data-blocked={c.blocked}>{c.id}{c.blocked && " · Blocked"}</span>
      {size && <span className="kb-chip">{size}</span>}
      {tags && <span className="kb-chip">{tags}</span>}
    </div>
    <h4>{c.title}</h4>
    {c.status && <p className="kb-status">{c.status}</p>}
  </div>;
}

// A native modal dialog: it traps focus, closes on Esc, and hands focus back to the card on close.
function Lightbox({ c, onMove, onClose }: { c: Card; onMove: ((lane: Lane) => void) | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  // Guarded because Strict Mode runs effects twice in dev.
  useEffect(() => { if (!ref.current?.open) ref.current?.showModal(); }, []);
  const close = () => ref.current?.close();
  return <dialog ref={ref} className="kb-lb" aria-labelledby="kb-lb-title" onClose={onClose}
    onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="kb-lb-panel">
      <button type="button" className="kb-lb-close" aria-label="Close" onClick={close}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
      <div className="kb-lb-head"><span className="kb-id">{c.id}</span><h2 id="kb-lb-title">{c.title}</h2></div>
      <p className="kb-lb-lane">{c.done ? `Shipped · filed in ${c.lane}` : c.lane}</p>
      {/* Touch screens can't drag, so the lanes are buttons here too. */}
      {onMove && !c.done && <div className="kb-move" role="group" aria-label="Move to">
        {LANES.map(l => <button key={l} type="button" aria-pressed={l === c.lane} disabled={l === c.lane} onClick={() => onMove(l)}>{l}</button>)}
      </div>}
      <Body md={c.body} />
    </div>
  </dialog>;
}

/** `prefix` limits the board to one section's cards; without it every card shows. */
export function Kanban({ prefix }: { prefix?: string }) {
  const [md, setMd] = useState(source);
  // Hand edits to the file arrive as a new `source` through hot reload; adopt them.
  const [seen, setSeen] = useState(source);
  if (source !== seen) { setSeen(source); setMd(source); }
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null); // a lane name or a card id
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { cards: all, pins } = parse(md);
  const cards = prefix ? all.filter(c => c.prefix === prefix) : all;
  const open = all.find(c => c.id === openId);

  const write = (next: string) => {
    const prev = md;
    setMd(next); setError(null);
    save(next).catch((e: Error) => { setMd(prev); setError(e.message); });
  };
  const move = (id: string, lane: Lane, beforeId?: string) => {
    try { write(moveCard(md, id, lane, beforeId)); } catch (e) { setError((e as Error).message); }
  };
  const endDrag = () => { setDragId(null); setOver(null); };
  const add = (title: string) => {
    if (!prefix || !title.trim()) return;
    const made = newCard(md, prefix, title, LANES[1]);
    write(made.md); setAdding(false); setOpenId(made.id);
  };

  return <div className="kb" onDragEnd={endDrag}>
    <div className="kb-bar">
      <code>docs/admin/BACKLOG.md</code>
      {!WRITABLE && <span>Read-only here. Run the dev server to move cards.</span>}
      {error && <span className="kb-error" role="alert">{error}</span>}
      {WRITABLE && prefix && (adding
        ? <form className="kb-new" onSubmit={e => { e.preventDefault(); add(new FormData(e.currentTarget).get("title") as string); }}>
          <input name="title" aria-label={`New card title, added to ${LANES[1]}`} placeholder={`New card in ${LANES[1]}`} autoFocus
            onKeyDown={e => { if (e.key === "Escape") setAdding(false); }} onBlur={e => { if (!e.currentTarget.value) setAdding(false); }} />
          <button type="submit">Add</button>
        </form>
        : <button type="button" className="kb-newbtn" onClick={() => setAdding(true)}>New card</button>)}
    </div>

    {pins.length > 0 && <div className="kb-pins">{pins.map(p => <div key={p.title} className="kb-pin"><h3>{p.title}</h3><Body md={p.body} /></div>)}</div>}

    <div className="kb-lanes">
      {[...LANES, SHIPPED].map(lane => {
        const shipped = lane === SHIPPED;
        const list = cards.filter(c => shipped ? c.done : c.lane === lane && !c.done);
        const droppable = WRITABLE && !shipped && dragId !== null;
        return <section key={lane} className="kb-lane" aria-label={lane} data-over={droppable && over === lane || undefined}
          onDragOver={droppable ? e => { e.preventDefault(); setOver(lane); } : undefined}
          onDrop={droppable ? e => { e.preventDefault(); if (dragId) move(dragId, lane as Lane); endDrag(); } : undefined}>
          <h3>{lane}<span>{list.length}</span></h3>
          {list.map(c => <CardFace key={c.id} c={c} onOpen={() => setOpenId(c.id)}
            drag={WRITABLE && !c.done ? {
              start: () => setDragId(c.id),
              over: over === c.id && dragId !== c.id,
              enter: () => setOver(c.id),
              leave: () => setOver(o => o === c.id ? null : o),
              drop: () => { if (dragId) move(dragId, c.lane, c.id); endDrag(); },
            } : null} />)}
        </section>;
      })}
    </div>

    {open && <Lightbox c={open} onClose={() => setOpenId(null)} onMove={WRITABLE ? lane => move(open.id, lane) : null} />}
  </div>;
}
