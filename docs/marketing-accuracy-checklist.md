# Marketing accuracy checklist

The public website is **marketing language**, not the Source of Truth. It should make people want the product, then be honest that it is being built. The internal authority is [`SOURCE-OF-TRUTH.md`](SOURCE-OF-TRUTH.md); detailed status belongs on the roadmap and status pages, not on every feature. Commitment 11: planned functionality is never presented as available. Roadmap item: `EST-3`.

Found on November 1, 2026. Files: `src/site/content.ts`, `src/site/Site.tsx`, `src/site/landing/content.ts`, `src/config/site.js`.

**Do not deploy the redesigned site until every open item and every launch requirement below is closed.**

## Open

- [ ] **2. "Public website: Live"** (homepage, "Where things stand"). True only once the rebuilt site is deployed. Production still serves the older site.

## Launch requirements

- [ ] **Browser and canvas QA.** Required before deployment: click through every public route, and check that the canvas frames that render the site still look right at their fixed sizes.
- [ ] **Email updates / early-access signup** (roadmap `EST-6`, provider choice `C-9`). Required before publishing the redesigned site. This is **not account registration**. Today the Updates section honestly says signup isn't set up; keep that wording until the form is configured and tested. Do not claim it works before then, and do not choose a paid provider without the owner's approval.
  - [ ] A managed email provider (not a hand-rolled list), chosen by the owner. The simplest secure managed integration; no new backend architecture, and API secrets never in the browser.
  - [ ] Real persistence: a submission is stored with the provider or on a server, not only in the visitor's browser.
  - [ ] Consent: an explicit opt-in, and what they're signing up for is stated.
  - [ ] A privacy notice appropriate to collecting email addresses. Don't invent a legal document; the owner supplies or approves it.
  - [ ] Unsubscribe handling in every message.
  - [ ] Spam and bot protection on the form.
  - [ ] Verified success and failure states (tested end to end, including network failure and a duplicate address), shown honestly.
  - [ ] The Updates section, hero, and any `/request` copy updated to match what actually works.

## Resolved

- [x] **1. Metadata.** Title is now the tagline; the description says we're building it and that the product isn't released.
- [x] **3. Phase 04.** "Better retrieval" removed. Extend is sharing, annotations, and richer reference workflows.
- [x] **4. Audience.** Section kept. The four use cases are reworded as who they're for ("For collecting…"), with no present-tense capability claims; the sharing use case says "in time".
- [x] **5. Cloudflare.** Pending, with personality ("Fingers crossed on Cloudflare"), and states we're building either way. The AI-organization priority is marked exploring. The longer disclaimer stays on the long page only.
- [x] **6. Present-tense capabilities.** The platform section is framed "What we're building" and uses future tense. Sharing and annotation are covered separately under "Also planned".
- [x] **7. "…survives when the web changes."** Replaced with "the original file, with its quality and metadata intact".
- [x] **8. Footer links.** Company and Legal columns removed; only links to pages that exist remain. Add them when the pages exist. No legal documents were invented.
- [x] **9. Origin story.** Confirmed accurate by the owner.
- [x] **10. "Five stages, in order."** Now a planning structure, not a strict sequence.
- [x] **11. Sign-in wording.** "Prototype sign-in" everywhere it appears on the public site.
- [x] **Floating status card.** Removed from the hero composition; the information lives in a quiet "Where things stand" section.

## Checked and fine

- `/status` copy: prototype, sample data, nothing released, sharing and annotations unbuilt, no native apps.
- `public/og.png` is a plain color; no claims.
- `/login`: invite-only, usernames "you were given", matches the prototype.
- `/request` opens the public site's Updates section, which says email signup isn't set up.
- Homepage and long-page links all go to routes that exist.

## Dead screens (not live, wrong if exposed)

- `GoodInternetRequest.tsx` saves a visitor's name and email only in their own browser, then says "You'll hear back there". Nothing routes to it. Remove it before anything links to it, and don't reuse it for the email signup.
- `GoodInternetLanding.tsx` is unrouted but kept because canvas frames `gi-landing-desktop` and `gi-landing-mobile` render it. Its copy is outdated; don't reuse it.
