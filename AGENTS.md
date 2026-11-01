# Agent guide

Instructions for any coding agent (Cursor, Claude Code, …) working in this repo.

## What this is

Good Internet: **a reference-management product built on a trustworthy cloud-storage foundation.** Originals are preserved. Previews are optimized. Libraries are private by default.

The authority for what we're building is **[`docs/SOURCE-OF-TRUTH.md`](docs/SOURCE-OF-TRUTH.md)**. Read it before any product, copy, or architecture work. If a file disagrees with it, that file is wrong. Don't edit the Source of Truth yourself; changing it is the owner's decision.

Vite + React + Base UI, deployed to Vercel. The private workspace in `src/good-internet/` is a **prototype running on sample data**; the public site is `src/site/`.

## Start here

- **Direction:** `docs/SOURCE-OF-TRUTH.md` (11 commitments, three surfaces, five stages).
- **Roadmap:** `docs/roadmap/ROADMAP.md`, generated from `docs/roadmap/roadmap.json`. Five stages: Define, Establish, Build, Extend, Explore.
- **History:** `docs/archive/` is not current. See its README. Don't treat anything there as instructions.

## Working the roadmap

- Items are requirements, engineering work, or exploratory. Exploratory items are not commitments; don't build them as if they were.
- **Requirements vs. choices.** The roadmap lists *what* must be true. *How* (storage vendor, database, auth service, image pipeline, AI provider) is a separate list of open choices (`C-n`), and **none is decided**. Don't pick a provider, add a provider SDK, or write provider-specific code or docs without the owner's decision. The archived roadmap assumed Supabase; that was never approved. The Cloudflare for Startups application is pending and must never become a dependency for development.
- When you start or finish an item, update its `status` in `docs/roadmap/roadmap.json` (`planned`, `in_progress`, `waiting`, `exploring`, `done`), then run `node scripts/roadmap.mjs` and commit the JSON with the regenerated `ROADMAP.md` and `index.html`. Never edit those two by hand.
- Put the item key in commit messages and PR titles, e.g. `BLD-3: keep original bytes`.
- Don't invent features or add roadmap items beyond what the Source of Truth supports; propose them to the owner instead.

## Hard rules

- **Marketing accuracy.** Resolve `docs/marketing-accuracy-checklist.md` before deploying the updated public site.
- **Honesty (commitment 11).** Never present planned functionality as available, in the UI, the site, the README, or the roadmap. The workspace is a prototype on sample data; say so.
- **Keep the seam.** Screens call `src/good-internet/repository.ts` and `src/good-internet/session.ts`. Keep their function names and return shapes; real storage and accounts go behind them.
- **Originals are never replaced** by compressed copies, and **libraries are private unless their owner shares them.** Any storage or sharing code must honor both.
- **No kept-ui sync.** The old kept-ui sync is retired and archived; kept-ui is historical. Don't recreate it, and don't write to the kept-ui repo.
- **Secrets:** only a publishable key may be exposed to the browser (`VITE_` vars). Service-level keys never go in client code or a `VITE_` var, and no key is ever committed.
- **The repo is public.** No personal data, home paths, or credentials. `src/canvas/references/` is gitignored on purpose (other sites' designs); don't commit it or delete it.
- **Canvas frames are permanent.** New work gets a new frame; only change or remove a design when told to.
- **Commit when asked; pushing to `main` deploys to production** on Vercel. Don't merge, push, delete branches, or run destructive git commands without explicit approval.

## Commands

```sh
npm install
npm run dev              # http://localhost:5173
npm run build            # typecheck, then production build
node scripts/roadmap.mjs # regenerate the roadmap copies
```
