// Placeholder feed content: a setup checklist for the Good Internet admin, taken from docs/roadmap. Replace with real data once there's a backend.
import type { Row, Suggestion } from "./feed";

export const greeting = { title: "Welcome to the Good Internet admin", sub: "A few things before there is a backend" };

export const suggestions: Suggestion[] = [
  { id: "choices", kind: ["note"], title: "Settle the open implementation choices", desc: "Where original files are stored, what runs the backend, how sign-in works. None of these is chosen yet.",
    why: "Build work (stage 03) can't start until the how is decided.", cta: "Open the roadmap",
    steps: [{ i: "note", k: "Choices", v: "C-1 through C-9" }, { i: "folder", k: "Roadmap", v: "docs/roadmap/ROADMAP.md" }] },
  { id: "define", kind: ["note"], title: "Define the audience and boundaries", desc: "Write down who Good Internet is for and what it deliberately is not.",
    why: "Stage 01 isn't finished: DEF-2 and DEF-3 are still open.", cta: "Open the roadmap",
    steps: [{ i: "note", k: "Items", v: "DEF-2, DEF-3" }, { i: "folder", k: "Source", v: "docs/SOURCE-OF-TRUTH.md" }] },
  { id: "invites", kind: ["globe"], title: "Review invite requests", desc: "Good Internet is invite-only. Approve the people who asked, so they can sign in.",
    why: "Requests from /request wait here until someone answers them.", cta: "Open People",
    steps: [{ i: "globe", k: "Requests", v: "People → Invite requests" }, { i: "calendar", k: "Schedule", v: "Once a week, to start" }] },
];

export const upNext: Row[] = [
  { title: "Write the hero copy for the public site", i: "note", k: "Next", v: "EST-2", tags: ["note"] },
  { title: "Choose where original files are stored", i: "layers", k: "Later", v: "C-1", tags: ["code"] },
  { title: "Sign in for the admin", i: "note", k: "Soon", v: "Only staff accounts, with two-factor", tags: ["note"] },
];

export const completed = [
  { title: "Rename Kept to Good Internet", when: "Earlier" },
  { title: "Workspace reference collection", when: "Earlier" },
  { title: "Admin dashboard", when: "Today" },
];
