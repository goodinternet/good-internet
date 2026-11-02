// The homepage's copy, from Landing Page Map 01. Links point at real destinations; there are no links
// to pages that don't exist. This is marketing language: it leads with what Good Internet is for, and
// keeps unbuilt things in the future tense ("will", "being built"). Detailed status lives on /roadmap and
// /status. The internal authority is docs/SOURCE-OF-TRUTH.md; the open accuracy items are in
// docs/marketing-accuracy-checklist.md.

const links = [
  { label: 'Overview', href: '/#platform' },
  { label: 'Principles', href: '/principles' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Status', href: '/status' },
];

export const nav = { brand: 'Good Internet', links, utility: { label: 'Prototype sign-in', href: '/login' } };

export const hero = {
  eyebrow: 'GOOD INTERNET',
  title: ['Your references,', 'kept whole and kept private.'],
  text: "We're building a private, cloud-based home for collecting, organizing, and preserving the things worth keeping.",
  note: 'In development · Product not yet released.',
  primary: { label: 'Explore the roadmap', href: '/roadmap' },
  secondary: { label: 'Our principles', href: '/principles' },
};

export const platform = {
  eyebrow: "What we're building",
  title: 'A better home for your references.',
  text: 'Good Internet is being built to keep your original files safe in the cloud, while making the references themselves easier to organize, explore, and find again.',
  columns: [
    { label: '01', title: 'Collect', text: "You'll bring your references together in one private library, reachable from any browser." },
    { label: '02', title: 'Preserve', text: 'Your original files will be kept as they came, with optimized previews to keep browsing fast.' },
    { label: '03', title: 'Organize', text: 'Collections, tags, and notes will give each reference the context that makes it useful later.' },
    { label: '04', title: 'Retrieve', text: 'Search will help you find what you need again, without remembering where you put it.' },
  ],
  // Planned, and kept apart from the four columns above.
  also: {
    title: 'Also planned',
    text: "Sharing chosen collections through a link you control, and marking up what you've saved with annotations.",
  },
  cta: { label: 'Our principles', href: '/principles' },
};

export const audience = {
  title: 'Made for people who collect.',
  text: "Good Internet started with a simple need to organize visual references for a design project. We're building it for people whose work and interests depend on collecting things worth returning to.",
};

// Who it's for, not what it does today: no capability claims.
export const useCases = [
  { title: 'Design references', text: 'For collecting visual inspiration and keeping ideas organized across projects.' },
  { title: 'Client work', text: 'For gathering references into collections to review, and in time, share with clients.' },
  { title: 'Research libraries', text: 'For keeping source material close and easy to find again.' },
  { title: 'Personal collections', text: 'For a private archive of the things that interest you.' },
];

// A quiet section in place of the old floating card. Detail lives on /status and /roadmap.
export const status = {
  title: 'Where things stand',
  text: "Good Internet is in development and the product isn't released yet.",
  rows: [
    { label: 'Public website', value: 'Live' },
    { label: 'Private workspace', value: 'Prototype on sample data' },
    { label: 'Storage, backup, and recovery', value: 'Planned' },
    { label: 'Sharing and annotations', value: 'Planned' },
  ],
  link: { label: 'See the full status', href: '/status' },
};

// Footer links only point at pages that exist. Add Company and Legal columns when those pages do.
export const footer: { brand: string; description: string; columns: { title: string; links: { label: string; href?: string }[] }[] } = {
  brand: 'Good Internet',
  description: "We're building a private home for the things worth keeping.",
  columns: [{ title: 'Product', links }],
};

export const cloudflare = {
  title: 'Fingers crossed on Cloudflare.',
  text: "Our Cloudflare for Startups application is pending, and we're building either way. If it comes through, it'd help give your originals a proper home and make images fast.",
  priorities: ['Preserve original files', 'Make images fast', 'Help sort the pile · exploring'],
};

export const legal = { left: '© 2026 Good Internet', right: 'In development' };
