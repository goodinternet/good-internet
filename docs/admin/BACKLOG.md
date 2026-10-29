# Admin backlog

The Good Internet admin's kanban. The Kanban tab in `/admin` renders this file as lanes, and
dragging a card there (in `npm run dev`) rewrites it. Edit it by hand any time.

The grammar is Autobahn's (github.com/rams-design/autobahn, FORMAT.md): `## Now`, `## Next`,
`## Later` open lanes, every `## PREFIX-N · Title` under them is a card, and a Status starting
with done / shipped / resolved / retired moves the card to Shipped.

Sections are card prefixes: `DASH` is the Dashboard section. Add a section in
`src/admin/config.ts`.

## Now

## Next

## DASH-001 · Invite queue
- **Status:** open
- **Size:** tbd
- **Why:** tbd
- **Spec:** tbd
- **Done means:** tbd

## DASH-002 · Site health
- **Status:** open
- **Size:** tbd
- **Why:** tbd
- **Spec:** tbd
- **Done means:** tbd

## DASH-003 · Feature switches
- **Status:** open
- **Size:** tbd
- **Why:** tbd
- **Spec:** tbd
- **Done means:** tbd

## DASH-004 · Activity log
- **Status:** open
- **Size:** tbd
- **Why:** tbd
- **Spec:** tbd
- **Done means:** tbd

## DASH-005 · Costs and storage
- **Status:** open
- **Size:** tbd
- **Why:** tbd
- **Spec:** tbd
- **Done means:** tbd

## Later
