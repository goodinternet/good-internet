// All copy for the landing page.

export const lead = {
  title: "Good Internet",
  body: "A place to collect, organize, and preserve the things worth keeping.",
};

export const summary = [
  "We\u2019re building a private, cloud-based home for your references: original files preserved, optimized previews for browsing, and collections and search to bring it all together.",
  "The idea is simple: your references should be easy to keep, easy to find, and yours to control.",
  "Good Internet is in early development and the product isn\u2019t released yet. The workspace is a prototype running on sample data, and storage, backup, recovery, and sharing are being built or planned.",
];

// Detailed roadmap, shown under the "Roadmap" header on the landing page: each stage has a
// one-line summary, a list of work areas, and a status badge.
export const roadmap = [
  {
    n: "01",
    name: "Define",
    status: "In progress",
    color: "blue",
    text: "Product identity, audience, capabilities, and boundaries.",
    items: ["The Source of Truth is written", "Audience", "Capabilities and boundaries"],
  },
  {
    n: "02",
    name: "Establish",
    status: "In progress",
    color: "blue",
    text: "Brand, this public website, company foundations, and our Cloudflare startup strategy.",
    items: ["Visual identity", "Public website", "Company foundations", "Cloudflare strategy (application pending)"],
  },
  {
    n: "03",
    name: "Build",
    status: "Planned",
    color: "gray",
    text: "The private cloud foundation Good Internet needs before it holds anyone\u2019s files.",
    items: [
      "Cloud storage and accounts, private by default",
      "Original-file preservation and optimized previews",
      "Backups, recovery, and export",
      "Collections, tags, notes, and search",
    ],
  },
  {
    n: "04",
    name: "Extend",
    status: "Planned",
    color: "gray",
    text: "Sharing, annotations, and richer reference workflows.",
    items: ["Share a collection by link", "Annotations", "Revoke shared access"],
  },
  {
    n: "05",
    name: "Explore",
    status: "Exploring",
    color: "violet",
    text: "Ideas we\u2019re looking into, not promising yet.",
    items: ["Intelligent organization", "Guest feedback on shared collections", "File formats beyond images"],
  },
];
