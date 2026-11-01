// Builds the readable copies of the roadmap from its data.
//
//   node scripts/roadmap.mjs
//
// Source:    docs/roadmap/roadmap.json   (edit this)
// Generated: docs/roadmap/ROADMAP.md     (for agents and GitHub)
//            docs/roadmap/index.html     (a read-only page; open it in a browser)
//
// The product direction lives in docs/SOURCE-OF-TRUTH.md. This roadmap serves it and never overrides it.
// The earlier 72-issue roadmap is in docs/archive/2026-10-supabase-roadmap/.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(resolve(dirname(fileURLToPath(import.meta.url)), '..'), 'docs/roadmap');
const data = JSON.parse(readFileSync(join(dir, 'roadmap.json'), 'utf8'));
const { stages, items, choices } = data;

const STATUS = { done: 'Done', in_progress: 'In progress', planned: 'Planned', waiting: 'Waiting', exploring: 'Exploring' };
const KIND = { requirement: 'Requirement', engineering: 'Engineering', exploratory: 'Exploratory' };
const BASIS = { stated: 'Stated in the Source of Truth', derived: 'Derived from a commitment', decided: 'Decided by the owner after the Source of Truth' };

// Catch typos before they reach either copy.
const keys = new Set(items.map((i) => i.key));
if (keys.size !== items.length) throw new Error('duplicate item key');
for (const i of items) {
  if (!STATUS[i.status]) throw new Error(`${i.key}: unknown status "${i.status}"`);
  if (!KIND[i.kind]) throw new Error(`${i.key}: unknown kind "${i.kind}"`);
  if (!BASIS[i.basis]) throw new Error(`${i.key}: unknown basis "${i.basis}"`);
  if (!stages.some((s) => s.id === i.stage)) throw new Error(`${i.key}: unknown stage "${i.stage}"`);
  for (const n of i.commitments ?? []) if (!(n >= 1 && n <= 11)) throw new Error(`${i.key}: no commitment ${n}`);
}
for (const c of choices) {
  if (c.status !== 'undecided') throw new Error(`${c.key}: record decisions in docs/, then extend this script`);
  for (const k of c.serves) if (!keys.has(k)) throw new Error(`${c.key}: serves unknown ${k}`);
}

const byStage = (s) => items.filter((i) => i.stage === s.id);
const done = items.filter((i) => i.status === 'done').length;
const tag = (i) => `${KIND[i.kind]} · ${i.basis}`;
const refs = (i) => (i.commitments?.length ? `commitment${i.commitments.length > 1 ? 's' : ''} ${i.commitments.join(', ')}` : '');

// ── Markdown ──
const md = [];
md.push('# Good Internet roadmap', '');
md.push('> Generated from `docs/roadmap/roadmap.json` by `node scripts/roadmap.mjs`. Edit the JSON, not this file.', '');
md.push('The direction is [`docs/SOURCE-OF-TRUTH.md`](../SOURCE-OF-TRUTH.md). This roadmap organizes the work under its five stages; where the two disagree, the Source of Truth wins.', '');
md.push(`Last updated ${data.updated}. **${done} of ${items.length} items done.** Nothing below is available to users unless its status says Done.`, '');
md.push('**Reading the labels.** *Requirement*: something that must be true of the product. *Engineering*: work needed to make a requirement real. *Exploratory*: discussed, not locked. *Stated* means the Source of Truth says it. *Derived* means it follows from a commitment and is proposed for review. *Decided* means the owner added it after the Source of Truth was written.', '');
md.push('Stages are a planning structure, not a claim that each is finalized, and not a strict sequence.', '');

for (const s of stages) {
  const list = byStage(s);
  md.push(`## ${s.number} · ${s.name}`, '', s.scope, '');
  for (const i of list) {
    md.push(`### ${i.key} · ${i.title}`, '');
    md.push(`- **Status:** ${STATUS[i.status]} · **Type:** ${tag(i)}${refs(i) ? ` · **Serves:** ${refs(i)}` : ''}`, '');
    md.push(i.summary, '');
    if (i.doneWhen?.length) md.push('**Done when**', '', ...i.doneWhen.map((d) => `- [${i.status === 'done' ? 'x' : ' '}] ${d}`), '');
    if (i.notes) md.push(`**Note.** ${i.notes}`, '');
  }
}

md.push('## Open implementation choices', '');
md.push('These are *how*, not *what*. None has been decided, and no provider is approved. Do not build as if one were.', '');
md.push('| Choice | Serves | Status | Note |', '| --- | --- | --- | --- |');
for (const c of choices) md.push(`| **${c.key}** ${c.title} | ${c.serves.join(', ') || '—'} | Undecided | ${c.note || '—'} |`);
md.push('');
writeFileSync(join(dir, 'ROADMAP.md'), md.join('\n'));

// ── HTML ──
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const body = stages.map((s) => `
<section>
  <h2><span>${s.number}</span> ${esc(s.name)}</h2>
  <p class="scope">${esc(s.scope)}</p>
  ${byStage(s).map((i) => `<article>
    <h3><code>${i.key}</code> ${esc(i.title)}</h3>
    <p class="meta"><b class="st ${i.status}">${STATUS[i.status]}</b> ${esc(tag(i))}${refs(i) ? ` · ${esc(refs(i))}` : ''}</p>
    <p>${esc(i.summary)}</p>
    ${i.doneWhen?.length ? `<ul>${i.doneWhen.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
    ${i.notes ? `<p class="note">${esc(i.notes)}</p>` : ''}
  </article>`).join('')}
</section>`).join('');
const choiceRows = choices.map((c) => `<tr><td><code>${c.key}</code> ${esc(c.title)}</td><td>${esc(c.serves.join(', ') || '—')}</td><td>${esc(c.note || '—')}</td></tr>`).join('');

writeFileSync(join(dir, 'index.html'), `<!doctype html>
<!-- Generated by scripts/roadmap.mjs from roadmap.json. Edit that, not this file. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Good Internet roadmap</title>
<style>
  :root { color-scheme: light dark; --bg:#fafaf9; --ink:#1a1a19; --ink2:#5d5d59; --line:#e4e4e0; --card:#fff; }
  @media (prefers-color-scheme: dark) { :root { --bg:#141413; --ink:#ededeb; --ink2:#9a9a95; --line:#2a2a28; --card:#1b1b1a; } }
  body { margin:0; background:var(--bg); color:var(--ink); font:15px/1.55 system-ui, sans-serif; }
  main { max-width:760px; margin:0 auto; padding:48px 16px 96px; }
  h1 { font-size:28px; margin:0 0 8px; } h2 { font-size:20px; margin:48px 0 4px; } h2 span { color:var(--ink2); font-weight:400; }
  h3 { font-size:15px; margin:0 0 4px; } p { margin:6px 0; } code { font:13px ui-monospace, monospace; color:var(--ink2); }
  .lede, .scope, .meta, .note { color:var(--ink2); } .meta { font-size:13px; }
  article { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:14px 16px; margin:10px 0; }
  ul { margin:6px 0; padding-left:20px; color:var(--ink2); }
  .st { font-weight:600; color:var(--ink); } .st.done { color:#2f7a2f; }
  table { width:100%; border-collapse:collapse; font-size:14px; } td { border-top:1px solid var(--line); padding:8px 8px 8px 0; vertical-align:top; }
</style>
</head>
<body>
<main>
  <h1>Good Internet roadmap</h1>
  <p class="lede">Direction: docs/SOURCE-OF-TRUTH.md. Updated ${esc(data.updated)}. ${done} of ${items.length} items done. Nothing here is available to users unless it says Done.</p>
  ${body}
  <section>
    <h2>Open implementation choices</h2>
    <p class="scope">How, not what. None is decided; no provider is approved.</p>
    <table>${choiceRows}</table>
  </section>
</main>
</body>
</html>
`);

console.log(`roadmap: ${items.length} items in ${stages.length} stages, ${choices.length} open choices, ${done} done`);
