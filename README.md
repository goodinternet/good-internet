# Good Internet

Good Internet is a personal reference database: a structured system for collecting,
organizing, contextualizing, and retrieving visual references.

> A library you can actually operate.

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
- `/login`, `/login/mfa`, `/request`: sign in, two-factor (placeholder), request an invite
- `/library`: collections and All references
- `/library/:collectionId`, `/library/:collectionId/:referenceId`: a collection, one reference
- `/m/:token`: a published board (no sign-in)
- `/map`, `/ios`: system map, Good Internet on iOS plan
- `/todo`, `/settings`, `/referral`: account pages
- `/admin`: the in-house dashboard (`src/admin/`, from madeofparts). Not linked anywhere, needs a full sign-in, loaded as its own chunk. Pages are placeholders.

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
