// Placeholder feed content: a setup checklist for the Good Internet admin, taken from docs/roadmap. Replace with real data once there's a backend.
import type { Row, Suggestion } from "./feed";

export const greeting = { title: "Welcome to the Good Internet admin", sub: "A few things before the backend goes live" };

export const suggestions: Suggestion[] = [
  { id: "decisions", kind: ["note"], title: "Settle the four open decisions", desc: "How usernames sign in, how board images are served, where Supabase lives, and whether the mocks stay as a fallback.",
    why: "Most of the backend work is blocked until these are decided.", cta: "Open the roadmap",
    steps: [{ i: "note", k: "Decisions", v: "D-1 through D-4" }, { i: "folder", k: "Roadmap", v: "docs/roadmap/ROADMAP.md" }] },
  { id: "supabase", kind: ["layers", "code"], title: "Set up Supabase", desc: "Create the project and local setup, then write the schema migration for collections, references, and shares.",
    why: "The library, boards, and invites are all still mocked in the browser.", cta: "Start GI-7",
    steps: [{ i: "layers", k: "Project", v: "GI-7, then the schema in GI-8" }, { i: "code", k: "Seam", v: "repository.ts and session.ts" }] },
  { id: "invites", kind: ["globe"], title: "Review invite requests", desc: "Good Internet is invite-only. Approve the people who asked, so they can sign in.",
    why: "Requests from /request wait here until someone answers them.", cta: "Open People",
    steps: [{ i: "globe", k: "Requests", v: "People → Invite requests" }, { i: "calendar", k: "Schedule", v: "Once a week, to start" }] },
];

export const upNext: Row[] = [
  { title: "Stop the sync script from overwriting the data layer", i: "code", k: "Next", v: "GI-6", tags: ["code"] },
  { title: "Row-level security on every row", i: "play", k: "Later", v: "Owner and two-factor, GI-9", tags: ["code"] },
  { title: "Sign in for the admin", i: "note", k: "Soon", v: "Only staff accounts, with two-factor", tags: ["note"] },
];

export const completed = [
  { title: "Rename Kept to Good Internet", when: "Earlier" },
  { title: "Workspace reference collection", when: "Earlier" },
  { title: "Admin dashboard", when: "Today" },
];
