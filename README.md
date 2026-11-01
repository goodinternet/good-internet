# Good Internet

> A reference-management product built on a trustworthy cloud-storage foundation.

**Originals are preserved. Previews are optimized. Libraries are private by default.**

Good Internet is in early development. The authoritative description is [`docs/SOURCE-OF-TRUTH.md`](docs/SOURCE-OF-TRUTH.md): the definition, eleven commitments, three surfaces (public website, private workspace, shared views), and five planning stages. The plan is [`docs/roadmap/ROADMAP.md`](docs/roadmap/ROADMAP.md).

## What exists today

Be precise about this; planned work is not available work.

- **Public website** (`src/site/`): the identity, principles, status, and roadmap. Being rewritten.
- **Private workspace** (`src/good-internet/`): a **prototype on sample data**. Collections, references, notes, tags, search, and sharing screens run against mocks in the browser. It is not our storage, preservation, backup, or recovery system, and nothing a visitor adds is kept on a server.
- **No backend yet.** No storage, authentication, backup, or sharing service has been chosen or built. The earlier plan that assumed Supabase is archived, not approved.
- **Admin** (`src/admin/`): a private operator dashboard, mostly placeholders.

## Routes

- `/`: landing. `/roadmap`, `/principles`, `/status`, `/request`: the public site
- `/login`, `/login/mfa`: sign in and a two-factor step (prototype)
- `/library`, `/library/:collectionId`, `/library/:collectionId/:referenceId`: the workspace prototype
- `/lab`: experiments and exploratory ideas (not commitments)
- `/m/:token`: a shared board (prototype)
- `/settings`: account settings
- `/admin`: operator dashboard. Not linked anywhere, needs a full sign-in, loaded as its own chunk
- `/canvas`: design canvas, development only (dropped from production builds)

## Data

`src/good-internet/repository.ts` and `src/good-internet/session.ts` are mocks (lab account `wade` / `1234`). A real backend replaces them behind the same function names and return shapes; which backend is undecided. Collection images are in `public/collections/` until then.

## Where the code came from

The workspace screens began as a copy of the kept-ui lab. That relationship has ended: the sync is retired and archived, and this repo owns its implementation. See [`docs/archive/README.md`](docs/archive/README.md). Sign in uses boxed inputs (`src/good-internet/inputs.css`), which differ from kept-ui. The old "Request an invite" form is no longer routed (`/request` opens the public site's Updates section, which says email signup isn't set up).

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173, also on your network
npm run build      # typecheck, then build to dist/
```

In dev, Cmd/Ctrl + G toggles a GuideFrame overlay.

Vercel builds with `npm run build` and serves `dist` with a SPA rewrite, so every path loads `index.html`. Pushing to `main` deploys to production.

## Docs

| | |
| --- | --- |
| `docs/SOURCE-OF-TRUTH.md` | The authority. |
| `docs/marketing-accuracy-checklist.md` | Public-copy claims to resolve before the updated site is deployed. |
| `docs/roadmap/` | The active five-stage roadmap (`roadmap.json` is the source; the rest is generated). |
| `docs/admin/BACKLOG.md` | The operator dashboard's Kanban board. |
| `docs/archive/` | History. Not current. |
