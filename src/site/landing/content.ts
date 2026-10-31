// The homepage's copy, from Landing Page Map 01. Links point at real destinations; the footer rows
// without an href have none yet and render as plain text.

const links = [
  { label: 'Overview', href: '/#platform' },
  { label: 'Principles', href: '/principles' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Status', href: '/status' },
];

export const nav = { brand: 'Good Internet', links, utility: { label: 'Sign in', href: '/login' } };

export const hero = {
  eyebrow: 'GOOD INTERNET / EARLY DEVELOPMENT',
  title: ['Your references,', 'kept whole and kept private.'],
  text: "We're building a private, cloud-based home for collecting, preserving, organizing, and working with your references.",
  primary: { label: 'Explore the roadmap', href: '/roadmap' },
  secondary: { label: 'Our principles', href: '/principles' },
};

export const status = {
  eyebrow: 'GOOD INTERNET',
  title: 'Early development',
  rows: [
    { label: 'Public website', value: 'Live' },
    { label: 'Reference workspace', value: 'Prototype' },
    { label: 'Cloud infrastructure', value: 'Planned' },
  ],
  link: { label: 'View roadmap →', href: '/roadmap' },
};

export const platform = {
  eyebrow: 'The platform',
  title: 'A better home for your references.',
  text: 'Good Internet is being built to preserve original files in the cloud while making the references themselves easier to organize, explore, and retrieve.',
  columns: [
    { label: '01', title: 'Collect', text: 'Bring your references together in one private library, accessible through the browser.' },
    { label: '02', title: 'Preserve', text: 'Keep original files intact while optimized previews make browsing fast.' },
    { label: '03', title: 'Organize', text: 'Give references context through collections, tags, notes, and annotations.' },
    { label: '04', title: 'Retrieve & Share', text: 'Find what you need and selectively share collections through controlled links.' },
  ],
  cta: { label: 'Our principles', href: '/principles' },
};

export const audience = {
  title: 'Made for people who collect.',
  text: "Good Internet started with a simple need to organize visual references for a design project. We're building it for people whose work and interests depend on collecting things worth returning to.",
};

export const useCases = [
  { title: 'Design references', text: 'Collect visual inspiration, track ideas, and organize references across projects.' },
  { title: 'Client work', text: 'Prepare collections for review and selectively share them with clients.' },
  { title: 'Research libraries', text: 'Keep source material organized, annotated, and easy to rediscover.' },
  { title: 'Personal collections', text: 'Build a private archive of the things that interest you.' },
];

export const footer: { brand: string; description: string; columns: { title: string; links: { label: string; href?: string }[] }[] } = {
  brand: 'Good Internet',
  description: 'A private home for the things worth keeping.',
  columns: [
    { title: 'Product', links },
    { title: 'Company', links: [{ label: 'About the project' }, { label: 'Development updates' }] },
    { title: 'Legal', links: [{ label: 'Privacy Policy' }, { label: 'Terms of Service' }] },
  ],
};

export const cloudflare = {
  title: 'The game plan when Cloudflare says yes.',
  text: 'Our Cloudflare for Startups application is pending. If approved, eligible infrastructure credits would help us develop private storage, faster image delivery, and intelligent reference organization.',
  priorities: ['Preserve original files', 'Make images fast', 'Help sort the pile'],
};

export const legal = { left: '© 2026 Good Internet', right: 'Early development' };
