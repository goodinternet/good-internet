# Good Internet: Source of Truth

**November 1, 2026.** This is the one authoritative statement of what Good Internet is. If another file in this repo disagrees with it, that file is wrong. Fix the file, not this document. Changing this document is the owner's decision.

Anything under `docs/archive/` is history. It is kept for reference and is not current.

## 01 / Product definition

**Our working definition**

> A reference-management product built on a trustworthy cloud-storage foundation.

**Core product principle**

> Originals are preserved. Previews are optimized. Libraries are private by default.

## 02 / Our commitments

These are established.

1. **Cloud-native, browser-first.** Good Internet is a cloud-based product, not a local-first application.
2. **Storage is foundational.** Freeing up local device storage is one of the original problems Good Internet exists to solve.
3. **Original files matter.** We preserve original quality and metadata rather than replacing files with compressed versions.
4. **Privacy is the default.** A user's references remain private unless they explicitly choose to share them.
5. **Trust must be earned.** Backups, recovery, integrity checks, and exports are essential engineering requirements, not optional polish.
6. **References are the focus.** We're building a reference-management platform, not trying to become another general-purpose knowledge-management system.
7. **Organization should be effortless.** Collections, tags, notes, annotations, and search make stored references useful.
8. **Sharing is intentional.** Users can selectively share collections through links without exposing their private libraries.
9. **Intelligence should assist, not interfere.** AI can help with administrative tasks like tagging and organization without taking control away from users.
10. **The product stays focused.** No native iOS or macOS apps are committed to the current roadmap.
11. **Honesty in development.** Planned functionality must never be presented as something already available.

## 03 / Product structure

Three primary user-facing surfaces:

- **Public website.** The identity, product introduction, principles, roadmap, and updates.
- **Private workspace.** Where users collect, store, organize, annotate, and retrieve references.
- **Shared views.** Controlled, selectively published collections accessible through links.

## 04 / Planning framework

Five stages. This is the agreed planning structure, not a claim that everything in each stage is finalized.

| Stage | Name | Scope |
| --- | --- | --- |
| 01 | **Define** | Product identity, audience, capabilities, and boundaries. |
| 02 | **Establish** | Brand, website, company foundations, and Cloudflare strategy. |
| 03 | **Build** | Cloud storage, authentication, preservation, organization, search, and reliability. |
| 04 | **Extend** | Sharing, annotations, and richer reference workflows. |
| 05 | **Explore** | Intelligent organization, guest feedback, and future capabilities. |

The active roadmap is `docs/roadmap/ROADMAP.md`, generated from `docs/roadmap/roadmap.json`.

## 05 / Still exploratory

Discussed, but **not** locked as product requirements:

- Guest annotations on shared collections
- Automatic AI tagging
- File formats beyond images
- Advanced retrieval
- Pricing
- Storage limits
- Specific backend providers

The Cloudflare for Startups application is **pending**. Acceptance has not been assumed. Three infrastructure priorities were proposed: original-file storage, image delivery and processing, and intelligent reference organization.

## Closing line

> Good Internet should make collecting and working with references feel effortless, while treating the files themselves with care.

This is a synthesis of direction, not an additional locked commitment.

## Where things stand

- The **visual identity is still open.**
- The private workspace that exists today is a **prototype on sample data**. It is not the storage, preservation, or recovery system described above, and nothing in it should be presented as such (commitment 11).
- **No backend provider has been chosen.** Earlier plans that assumed Supabase are archived, not approved. See `docs/archive/`.

## Product requirements vs. implementation choices

Keep these apart. A **requirement** says what must be true (for example, "originals are preserved byte-for-byte"). An **implementation choice** says how (a storage vendor, an auth service, an image pipeline). Requirements come from this document. Choices are made later, by the owner, and recorded as decisions. Until then they are listed as open in the roadmap, and no code or doc should treat one as settled.
