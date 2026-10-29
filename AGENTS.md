# Agent guide

Instructions for any coding agent (Cursor, Claude Code, …) working in this repo.

## What this is

The real Good Internet product: "a library you can actually operate". Vite + React + Base UI, deployed to Vercel. The UI is a copy of the **kept-ui** lab (github.com/w-ade/kept-ui), which is the source of truth for how Good Internet looks and behaves. The next job is wiring that UI to a real backend (Supabase).

## Start here

- **Roadmap:** `docs/roadmap/ROADMAP.md`. Every piece of backend work is an issue (`GOOD-INTERNET-n`) with why, approach, and done-when. Open `docs/roadmap/index.html` in a browser for the tracker view.
- **Branch:** the current UI is on `main`. Branch from `main` for new work.

## Working the roadmap

- Pick issues whose `blockedBy` are all done. Don't start an issue that depends on an open decision (`D-n`); ask the owner instead.
- When you start or finish an issue, update its `status` in `docs/roadmap/roadmap.json` (`backlog`, `todo`, `in_progress`, `in_review`, `done`, `canceled`), then run `node scripts/roadmap.mjs` and commit the JSON with the regenerated `ROADMAP.md` and `index.html`.
- Put the issue key in commit messages and PR titles, e.g. `GI-18: collections from Supabase`.
- Never edit `ROADMAP.md` or `index.html` by hand; they're generated.

## Hard rules

- **Never touch kept-ui.** Don't write, install, or build in it. `npm run sync-kept-ui` only reads from it.
- **Known differences from kept-ui** are listed in the README (boxed inputs on Sign in and Request an invite, in `src/good-internet/inputs.css`). Don't "fix" them back, and keep new differences in good-internet-only files like that one, never in the synced `GoodInternet*.tsx` or `good-internet.css`, which the sync overwrites.
- **New UI is designed in kept-ui first** (e.g. the two-factor screen, GI-14), approved by the owner, then synced. Don't invent screens here.
- **Keep the seam.** Screens call `src/good-internet/repository.ts` and `src/good-internet/session.ts`. Keep their function names and return shapes exactly; put the Supabase code behind them.
- **Secrets:** only the Supabase publishable key may be exposed to the browser (`VITE_` vars). The service-role key never goes in client code or a `VITE_` var, and no key is ever committed.
- **The repo is public.** No personal data, home paths, or credentials.
- **Commit when asked; pushing to `main` deploys to production** on Vercel.

## Commands

```sh
npm install
npm run dev              # http://localhost:5173
npm run build            # production build
node scripts/roadmap.mjs # regenerate the roadmap copies
```
