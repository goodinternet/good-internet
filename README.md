# Good Internet

> The workspace for the collectors, the researchers, the organizers, and the makers.

Good Internet is a cloud-based personal knowledge workspace, built around collecting, preserving,
organizing, and connecting information. It's made of three layers:

- **Storage:** your information lives somewhere reliable.
- **Knowledge:** it gains context, relationships, and meaning.
- **Retrieval:** you can find it and work with it again.

It's in early development. Today it's a library for visual references; links, PDFs, notes and the rest
of the phases are on the public roadmap at [`/roadmap`](https://goodinternetwww.com/roadmap).

## Where the UI comes from

The UI is a copy of the [kept-ui](https://github.com/w-ade/kept-ui) lab, which is the source of
truth for how Good Internet looks and behaves. Its UI spec is `docs/ui.html` in that repo. The lab uses
`#/kept/...` hash routes; here the same screens run on real paths.

`scripts/sync-kept-ui.mjs` copies `src/good-internet` and the imported collection images out of a local
kept-ui checkout and rewrites its hash routes into paths. It only reads from kept-ui.

```sh
npm run sync-kept-ui              # expects kept-ui at ../../Labs/kept-ui
npm run sync-kept-ui -- ../path/to/kept-ui
```

Files that exist only here: `src/good-internet/tokens.css` (the tokens and base layers from kept-ui's
`src/docs.css`, without the lab shell), `src/good-internet/navigate.ts` (history navigation) and `src/App.tsx`, plus `src/good-internet/inputs.css` and the admin in `src/admin/`.

### Where good-internet differs from kept-ui

- **Sign in and Request an invite use boxed inputs** (outlined Base UI inputs) instead of kept-ui's
  ruled rows. The styling is in `src/good-internet/inputs.css`, keyed off `data-gi-route`, which `App.tsx` sets
  on `<html>`, so `npm run sync-kept-ui` doesn't overwrite it. Every other screen still matches kept-ui
  pixel for pixel; expect these two routes to differ in a screenshot diff.
- Share links are real paths (`/m/<token>`), not `#/kept/m/<token>`.

## Routes

- `/`: landing
- `/roadmap`: the public roadmap
- `/login`, `/login/mfa`, `/request`: sign in, two-factor (placeholder), request an invite
- `/library`: collections and All references
- `/lab`: the lab, references and experiments for what Good Internet builds next
- `/library/:collectionId`, `/library/:collectionId/:referenceId`: a collection, one reference
- `/m/:token`: a published board (no sign-in)
- `/map`, `/ios`: system map, Good Internet on iOS plan
- `/todo`, `/settings`, `/referral`: account pages
- `/admin`: the in-house dashboard (`src/admin/`, from madeofparts). Not linked anywhere, needs a full sign-in, loaded as its own chunk. Most pages are placeholders. Its Kanban tab renders `docs/admin/BACKLOG.md` in [Autobahn](https://github.com/rams-design/autobahn)'s card grammar; in `npm run dev`, dragging a card rewrites that file (prefixes are sections, e.g. `DASH` = Dashboard).

## Data

Still mocked: `src/good-internet/repository.ts` (collections, references, shares, invite requests) and
`src/good-internet/session.ts` (lab account `wade` / `1234`). The real backend swaps in behind the same
functions. Collection images are synced into `public/collections/` and git-ignored until the
backend serves them.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173, also on your network
npm run build      # typecheck, then build to dist/
```

In dev, Cmd/Ctrl + G toggles a GuideFrame overlay set to Good Internet's 8-column page grid.

Vercel builds with `npm run build` and serves `dist` with a SPA rewrite, so every path loads
`index.html`.
