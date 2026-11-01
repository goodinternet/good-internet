# Marketing accuracy checklist

Found on November 1, 2026 by checking the public website against [`SOURCE-OF-TRUTH.md`](SOURCE-OF-TRUTH.md) and what is actually built. **Resolve every open item before the updated website is deployed.** Commitment 11: planned functionality is never presented as available. Roadmap item: `EST-3`.

Files: `src/site/content.ts`, `src/site/landing/content.ts`, `src/config/site.js`.

## Open

**Most visible**

- [ ] **1. Meta description and page title** (`src/config/site.js`). Reads "A private place to collect, preserve, organize, annotate, search, and share your references." Present-tense capability; annotate, share, and preserve are not built. Appears in search and social previews.
- [ ] **2. "Public website: Live"** (landing status table). True only once the rebuilt site is deployed; production currently serves the older site.

**Beyond the Source of Truth**

- [ ] **3. "Better retrieval" under Extend** (`content.ts`, Phase 04). Advanced retrieval is exploratory (Explore). Extend is sharing, annotations, and richer workflows.
- [ ] **4. Audience copy** ("Made for people who collect" and four use cases). Audience is still open (`DEF-2`), so this decides it. "Client work" also presents sharing to clients as a use case.
- [ ] **5. Cloudflare priorities on the landing** list "Help sort the pile" (AI organization) beside the two firm priorities. `content.ts` marks it "Exploratory, not promised"; the landing doesn't. Also keep Cloudflare out of any dependency language: acceptance is not assumed and development does not wait on it.

**Present tense for things not built**

- [ ] **6. Platform columns and the Features list** ("Preserve: keep original files intact…", "Retrieve & Share", "Organize… annotations") read as available. Reword as what is being built.
- [ ] **7. "…so a reference survives when the web changes"** implies archiving web pages against link rot. The Source of Truth covers uploaded files.
- [ ] **8. Footer links** "Privacy Policy", "Terms of Service", "About the project", "Development updates" have no pages. Remove them, or label them as coming.
- [ ] **9. Origin story** ("started with a need to organize visual references for a design project"). Owner to confirm it's accurate.

## Checked and fine

- `/status` copy: prototype, sample data, nothing released, sharing and annotations unbuilt, no native apps.
- Cloudflare described as pending and conditional.
- `public/og.png` is a plain color; no claims.
- `/login`: invite-only, usernames "you were given", matches the prototype.
- `/request` opens the public site's Updates section, which says email signup isn't set up.

## Dead screens (not live, wrong if exposed)

- `GoodInternetRequest.tsx` saves a visitor's name and email only in their own browser, then says "You'll hear back there". Nothing routes to it. Remove it before anything links to it.
- `GoodInternetLanding.tsx` is unrouted but kept because canvas frames `gi-landing-desktop` and `gi-landing-mobile` render it. Its copy is outdated; don't reuse it.
