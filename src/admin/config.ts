// Admin sections. Rename, add, or remove rail sections and sidebar items here; nothing else needs to change.
import type { IconKey } from "./icons";

export type Item = { id: string; l: string; i: IconKey; d: string };
export type Group = { h: string; items: Item[] };

export const rail: { id: string; l: string; i: IconKey }[] = [
  { id: "home", l: "Home", i: "home" },
  { id: "kanban", l: "Kanban", i: "list" },
  { id: "library", l: "Library", i: "layers" },
  { id: "people", l: "People", i: "users" },
];

/** Where the admin remembers light or dark mode. */
export const THEME_KEY = "goodinternet.admin.theme";

/** Opened from the avatar menu rather than the rail. */
export const settings = { id: "settings", l: "Settings" };

/** Kanban sections. A section is a card id prefix in docs/admin/BACKLOG.md; add one here to give it a page. */
export const sections: (Item & { prefix: string })[] = [
  { id: "dashboard", l: "Dashboard", i: "grid", prefix: "DASH", d: "What we're building into this admin. Drag a card to move it; the backlog file rewrites." },
];

/** Home's first item renders the feed instead of a page. */
export const FEED = { area: "home", page: "overview" };

export const groups: Record<string, Group[]> = {
  home: [
    { h: "Today", items: [
      { id: "overview", l: "Overview", i: "grid", d: "What needs your attention, picked for today." },
      { id: "activity", l: "Activity", i: "bolt", d: "New references, collections, boards, and sign-ins, newest first." },
      { id: "reports", l: "Reports", i: "chart", d: "References added, boards viewed, and invites sent over time." },
    ] },
  ],
  kanban: [
    { h: "Board", items: [
      { id: "all", l: "All cards", i: "list", d: "Every card in the admin backlog. Drag a card to move it; the backlog file rewrites." },
    ] },
    { h: "Sections", items: sections },
  ],
  library: [
    { h: "Library", items: [
      { id: "references", l: "References", i: "star", d: "Every reference in every account, newest first." },
      { id: "collections", l: "Collections", i: "folder", d: "Every collection, who owns it, and how many references it holds." },
      { id: "boards", l: "Boards", i: "globe", d: "Published share links, who made them, and when they were last rotated." },
    ] },
    { h: "Storage", items: [
      { id: "uploads", l: "Uploads", i: "archive", d: "Image uploads, their sizes, and any that failed." },
    ] },
  ],
  people: [
    { h: "People", items: [
      { id: "members", l: "Members", i: "users", d: "Everyone with an account, and whether two-factor is on." },
      { id: "invites", l: "Invite requests", i: "inbox", d: "Who asked for an invite. Approve or decline each one." },
      { id: "flagged", l: "Flagged", i: "flag", d: "Boards and references someone reported." },
    ] },
  ],
  settings: [
    { h: "Personal settings", items: [
      { id: "profile", l: "Profile", i: "user", d: "Your name, photo, and how you appear to others." },
      { id: "notifications", l: "Notifications", i: "bell", d: "Choose which updates reach you, and where." },
      { id: "security", l: "Security", i: "lock", d: "Your password, two-factor, and active sessions." },
    ] },
    { h: "Workspace", items: [
      { id: "general", l: "General", i: "gear", d: "Site name, invite rules, and defaults." },
      { id: "appearance", l: "Appearance", i: "sun", d: "Theme and accent color." },
      { id: "integrations", l: "Integrations", i: "globe", d: "Connect the tools you already use." },
    ] },
  ],
};
