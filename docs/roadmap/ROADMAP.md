# Good Internet roadmap

> Generated from `docs/roadmap/roadmap.json` by `node scripts/roadmap.mjs`. Edit the JSON, not this file.

The direction is [`docs/SOURCE-OF-TRUTH.md`](../SOURCE-OF-TRUTH.md). This roadmap organizes the work under its five stages; where the two disagree, the Source of Truth wins.

Last updated 2026-11-01. **1 of 28 items done.** Nothing below is available to users unless its status says Done.

**Reading the labels.** *Requirement*: something that must be true of the product. *Engineering*: work needed to make a requirement real. *Exploratory*: discussed, not locked. *Stated* means the Source of Truth says it. *Derived* means it follows from a commitment and is proposed for review. *Decided* means the owner added it after the Source of Truth was written.

Stages are a planning structure, not a claim that each is finalized, and not a strict sequence.

## 01 · Define

Product identity, audience, capabilities, and boundaries.

### DEF-1 · Write down the Source of Truth

- **Status:** Done · **Type:** Requirement · stated

One authoritative statement of the product definition, principle, commitments, structure, and planning stages.

**Done when**

- [x] docs/SOURCE-OF-TRUTH.md exists and is dated
- [x] Other docs defer to it

### DEF-2 · Define the audience

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 6

Who Good Internet is for. The stage names audience as part of Define; it has not been written down yet.

### DEF-3 · Write the capability list and the boundaries

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitments 6, 10

What the product does, and what it deliberately does not: no general knowledge management (6), no native iOS or macOS apps (10). Starts from the commitments; adds nothing to them without sign-off.

## 02 · Establish

Brand, website, company foundations, and Cloudflare strategy.

### EST-1 · Settle the visual identity

- **Status:** Planned · **Type:** Requirement · stated

The brand look is still open. This is the design work that comes after the foundation is reconciled.

### EST-2 · Public website: the words, then the page

- **Status:** In progress · **Type:** Requirement · stated · **Serves:** commitment 11

Identity, product introduction, principles, roadmap, and updates. A rebuilt site exists on the marketing-rebuild branch. Next step is the hero copy.

**Note.** Nothing on the site may present planned work as available (commitment 11).

### EST-3 · Keep the public roadmap and status honest

- **Status:** Planned · **Type:** Engineering · derived · **Serves:** commitment 11

The public roadmap page and any status claims must match docs/roadmap/roadmap.json. Anything not built is labeled as not built.

**Done when**

- [ ] Public roadmap reads from, or is checked against, this roadmap
- [ ] No page implies storage, backup, sharing, or AI exists before it ships

### EST-4 · Company foundations

- **Status:** Planned · **Type:** Requirement · stated

Named in the Establish stage. Scope is not yet defined.

### EST-5 · Cloudflare strategy

- **Status:** Waiting · **Type:** Requirement · stated

The Cloudflare for Startups application is pending. Acceptance is not assumed. Proposed priorities: original-file storage, image delivery and processing, intelligent reference organization.

**Note.** A strategy under consideration, not a selected provider. Good Internet development does not depend on the outcome: acceptance is not assumed and nothing in Build waits on it. See choices C-1, C-4.

### EST-6 · Email updates and early-access signup

- **Status:** Planned · **Type:** Requirement · decided

A real signup on the public site, required before the redesigned site is published. It is not account registration. Until it is configured and tested, the site says email signup isn't set up and must not claim otherwise.

**Done when**

- [ ] A submitted address is stored by the provider (or a server), not only in the visitor's browser
- [ ] Sign-up requires explicit consent and says what the person is signing up for
- [ ] An appropriate privacy notice is linked, supplied or approved by the owner
- [ ] Every message has working unsubscribe handling
- [ ] The form has spam and bot protection
- [ ] Success and failure states are verified end to end, including a network failure and a duplicate address

**Note.** Owner decision, November 1, 2026; not in the Source of Truth. Prefer the simplest secure managed integration and no new backend architecture. API secrets never reach the browser. See choice C-9.

## 03 · Build

Cloud storage, authentication, preservation, organization, search, and reliability.

### BLD-1 · Cloud storage for a user's references

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitments 1, 2

References live in the cloud, reachable from the browser, so they don't take up local device storage.

**Done when**

- [ ] A user can add a reference and open it from a different device with nothing kept locally

### BLD-2 · Accounts, with libraries private by default

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 4

Sign-in and a session. Every library is private unless its owner shares it. Access is enforced on the server, not only hidden in the UI.

**Done when**

- [ ] A signed-out or different user cannot read a private library or its files
- [ ] A new library is private without any setting being changed

**Note.** The prototype UI has invite-only access and a two-factor screen. Whether those are product requirements has not been decided.

### BLD-3 · Preserve originals and their metadata

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 3

The uploaded file is stored as it arrived: same bytes, same metadata. It is never replaced by a compressed version.

**Done when**

- [ ] The original downloaded later is byte-identical to the original uploaded
- [ ] Original metadata is retained

### BLD-4 · Optimized previews, kept separate from originals

- **Status:** Planned · **Type:** Engineering · stated · **Serves:** commitment 3

Previews are generated for fast display. They are derived copies that never overwrite or stand in for the original.

**Done when**

- [ ] Deleting or regenerating a preview leaves the original untouched

**Note.** 'Previews are optimized' is part of the core product principle, so the requirement is stated. The 'done when' criterion (previews never overwrite originals) is a proposal for review.

### BLD-5 · Integrity checks

- **Status:** Planned · **Type:** Engineering · stated · **Serves:** commitment 5

Detect a stored original that no longer matches what was uploaded.

**Done when**

- [ ] Each original has a recorded fingerprint taken at upload
- [ ] Stored files are verified against it, and a mismatch is surfaced rather than ignored

**Note.** Named in commitment 5 as an engineering requirement. The 'done when' criteria are proposals for review.

### BLD-6 · Backups

- **Status:** Planned · **Type:** Engineering · stated · **Serves:** commitment 5

Originals and library data are backed up so one failure cannot lose them.

**Done when**

- [ ] Backups run on a schedule and their success is checked

**Note.** Named in commitment 5 as an engineering requirement. The 'done when' criteria are proposals for review.

### BLD-7 · Recovery, tested

- **Status:** Planned · **Type:** Engineering · stated · **Serves:** commitment 5

A written and rehearsed way to restore from backup. A backup that has never been restored is not yet trusted.

**Done when**

- [ ] A restore has been performed end to end from a backup, and the result verified against BLD-5

**Note.** Named in commitment 5 as an engineering requirement. The 'done when' criteria are proposals for review.

### BLD-8 · Export

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitments 5, 3

A user can take their references with them: originals and their organization, not only previews.

**Done when**

- [ ] An export contains the original files, metadata, and collection/tag/note information

### BLD-9 · Organization: collections, tags, notes

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 7

Collections, tags, and notes on stored references. The prototype UI has these on sample data.

### BLD-10 · Search

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 7

Find stored references again. The prototype UI has a search on sample data.

### BLD-11 · Replace the prototype's sample data with the real thing

- **Status:** Planned · **Type:** Engineering · derived · **Serves:** commitments 1, 11

The private workspace UI currently runs on mock data behind src/good-internet/repository.ts and session.ts. Real storage and accounts go behind those same functions. Until then the workspace is labeled a prototype.

**Note.** Depends on choices C-1 to C-3.

## 04 · Extend

Sharing, annotations, and richer reference workflows.

### EXT-1 · Share a collection by link

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitments 8, 4

Users selectively share collections through links without exposing the rest of their library.

**Done when**

- [ ] A link shows only the chosen collection
- [ ] Nothing else in the owner's library is reachable through it

**Note.** Ending a share is EXT-4. Sharing does not exist today; the prototype's share screens run on sample data.

### EXT-2 · Annotations

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 7

Annotations on references, listed in commitment 7 and in the Extend stage. Guest annotations are separate and exploratory (XPL-2).

### EXT-3 · Richer reference workflows

- **Status:** Planned · **Type:** Requirement · stated · **Serves:** commitment 6

Named in the Extend stage. What 'richer' means has not been defined, and is not to be invented here.

**Note.** Undefined placeholder. It does not authorize any additional feature; defining one needs a separate decision.

### EXT-4 · Revoke shared access

- **Status:** Planned · **Type:** Engineering · derived · **Serves:** commitments 8, 4

The owner can end a share so its link stops working. Required whenever link sharing is implemented, so that sharing stays intentional (8) and the library stays private (4). Applies only once EXT-1 exists.

**Done when**

- [ ] After a share is revoked, its old link no longer shows the collection
- [ ] Revoking one share leaves the owner's other shares and private library unaffected

## 05 · Explore

Intelligent organization, guest feedback, and future capabilities.

### XPL-1 · Intelligent organization

- **Status:** Exploring · **Type:** Exploratory · stated · **Serves:** commitment 9

AI help with administrative work such as tagging and organizing. It assists and does not take control away from the user. Automatic AI tagging is not a locked requirement.

### XPL-2 · Guest feedback and annotations on shared collections

- **Status:** Exploring · **Type:** Exploratory · stated · **Serves:** commitment 8

Discussed, not locked.

### XPL-3 · File formats beyond images

- **Status:** Exploring · **Type:** Exploratory · stated

Discussed, not locked. The product is images today.

### XPL-4 · Advanced retrieval

- **Status:** Exploring · **Type:** Exploratory · stated · **Serves:** commitment 7

Discussed, not locked. Basic search is BLD-10.

## Open implementation choices

These are *how*, not *what*. None has been decided, and no provider is approved. Do not build as if one were.

| Choice | Serves | Status | Note |
| --- | --- | --- | --- |
| **C-1** Where original files are stored | BLD-1, BLD-3, BLD-5, BLD-6, BLD-7 | Undecided | Cloudflare is under consideration (EST-5), but acceptance is not a dependency for development. No provider is selected. |
| **C-2** Backend and database platform | BLD-2, BLD-9, BLD-10, BLD-11 | Undecided | Supabase was assumed by the archived October roadmap. It was never approved and is not ruled out. |
| **C-3** Authentication approach | BLD-2 | Undecided | Includes whether the prototype's invite-only access and two-factor become requirements. |
| **C-4** Image processing and delivery | BLD-4 | Undecided | Named as a proposed Cloudflare priority. Not selected, and not dependent on the application. |
| **C-5** How backup and recovery are done | BLD-6, BLD-7 | Undecided | — |
| **C-6** How search is done | BLD-10, XPL-4 | Undecided | — |
| **C-7** AI provider and approach for assisted organization | XPL-1 | Undecided | — |
| **C-8** Pricing and storage limits | — | Undecided | Exploratory per the Source of Truth. Not a roadmap item until decided. |
| **C-9** Email updates provider and integration | EST-6 | Undecided | Prefer the simplest secure managed integration. No provider is chosen and no paid plan is approved. Any API key stays server-side and is never a VITE_ variable. |
