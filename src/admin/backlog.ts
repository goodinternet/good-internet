// The kanban's data: docs/admin/BACKLOG.md, in Autobahn's grammar (github.com/rams-design/autobahn, FORMAT.md).
// The file is the database. Moves splice whole card blocks, so a moved card is the same bytes in a new place.

export const LANES = ["Now", "Next", "Later"] as const;
export type Lane = (typeof LANES)[number];
/** Derived from Status, never a heading in the file. */
export const SHIPPED = "Shipped";

export type Card = { id: string; prefix: string; title: string; lane: Lane; status: string | null; done: boolean; blocked: boolean; body: string; size: string | null; tags: string | null };
export type Pin = { title: string; body: string };

// A card id is PREFIX-NUMBER for any A-Z prefix (DASH-1, GI-12).
const CARD_ID = /^(([A-Z][A-Z0-9]*)-\d+) · (.+)$/;
const DONE_RE = /\b(SHIPPED|DONE|RETRACTED|RETIRED)\b/;
const DONE_STATUS_RE = /^(done|shipped|resolved|retracted|retired|sent|superseded)\b/i;

const isLane = (text: string): text is Lane => (LANES as readonly string[]).includes(text);

function headings(lines: string[]) {
  const heads: { i: number; text: string }[] = [];
  lines.forEach((l, i) => { if (/^## /.test(l)) heads.push({ i, text: l.slice(3).trim() }); });
  return heads;
}

export function parse(md: string) {
  const lines = md.split("\n");
  const heads = headings(lines);
  const cards: Card[] = [];
  const pins: Pin[] = []; // non-card ## blocks in the first lane, shown above the board
  let lane: Lane | null = null;
  for (const [idx, h] of heads.entries()) {
    if (isLane(h.text)) { lane = h.text; continue; }
    if (!lane) continue; // anything above the first lane is notes for people reading the file
    const end = idx + 1 < heads.length ? heads[idx + 1].i : lines.length;
    const body = lines.slice(h.i + 1, end).join("\n").trim();
    const field = (name: string) => body.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*([^\\n]+)`))?.[1].replace(/\*/g, "").trim() ?? null;
    const status = field("Status");
    const m = h.text.match(CARD_ID);
    if (m) cards.push({
      id: m[1], prefix: m[2], title: m[3], lane, status, body, size: field("Size"), tags: field("Tags"),
      done: DONE_RE.test(h.text) || DONE_RE.test(status ?? "") || DONE_STATUS_RE.test(status ?? ""),
      blocked: /^blocked/i.test(status ?? ""),
    });
    else if (lane === LANES[0]) pins.push({ title: h.text, body });
  }
  return { cards, pins };
}

/** Where a lane's last block ends: the next lane heading, or the end of the file. */
function laneEnd(lines: string[], lane: Lane) {
  const heads = headings(lines);
  const at = heads.findIndex(h => h.text === lane);
  if (at === -1) throw new Error(`No "## ${lane}" heading in the backlog`);
  return heads.slice(at + 1).find(h => isLane(h.text))?.i ?? lines.length;
}

/** Move a card's block before `beforeId`, or to the end of `toLane`. */
export function moveCard(md: string, id: string, toLane: Lane, beforeId?: string) {
  if (beforeId === id) return md;
  const lines = md.split("\n");
  const heads = headings(lines);
  const idx = heads.findIndex(h => h.text.startsWith(id + " ·"));
  if (idx === -1) throw new Error(`${id} isn't in the backlog`);
  const start = heads[idx].i;
  const end = idx + 1 < heads.length ? heads[idx + 1].i : lines.length;
  const block = lines.slice(start, end);
  const rest = [...lines.slice(0, start), ...lines.slice(end)];
  const target = beforeId ? headings(rest).find(h => h.text.startsWith(beforeId + " ·"))?.i : laneEnd(rest, toLane);
  if (target === undefined) throw new Error(`${beforeId} isn't in the backlog`);
  return [...rest.slice(0, target), ...block, ...rest.slice(target)].join("\n");
}

/** Mint the next PREFIX-NNN and append Autobahn's template card to a lane. */
export function newCard(md: string, prefix: string, title: string, lane: Lane) {
  let max = 0;
  for (const m of md.matchAll(new RegExp(`^## ${prefix}-(\\d+)`, "gm"))) max = Math.max(max, Number(m[1]));
  const id = `${prefix}-${String(max + 1).padStart(3, "0")}`;
  const now = new Date(); // local date, not UTC, so an evening card isn't dated tomorrow
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const block = `## ${id} · ${title.trim()}
- **Status:** open (carded ${today} in the admin)
- **Size:** tbd
- **Why:** tbd
- **Spec:** tbd
- **Done means:** tbd
`;
  const lines = md.split("\n");
  const at = laneEnd(lines, lane);
  return { id, md: [...lines.slice(0, at), ...block.split("\n"), ...lines.slice(at)].join("\n") };
}

/** Chip text: the first word, without parentheticals; hidden when tbd or none. */
export function chip(v: string | null) {
  if (!v) return null;
  const t = v.split("(")[0].trim().split(/\s+—/)[0].trim();
  if (!t || /^(tbd|none|n\/a)$/i.test(t)) return null;
  return t.length > 18 ? t.slice(0, 17) + "…" : t;
}
