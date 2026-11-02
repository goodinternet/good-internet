// Copy for the one-page marketing site and its nav.
// Everything here describes direction, not shipped features. Keep it that way.
// Detailed status lives here; the homepage is lighter. Authority: docs/SOURCE-OF-TRUTH.md.

export const PRINCIPLES: [term: string, detail: string][] = [
  ['Originals are preserved', 'What you save is kept as it was, not just as a link or a thumbnail.'],
  ['Previews are optimized', 'Fast, lightweight previews for browsing. The original stays untouched behind them.'],
  ['Libraries are private by default', 'Nothing is shared unless you choose to share it.'],
];

export const FEATURES: [term: string, detail: string][] = [
  ['Collect', 'Bring references into one private library, from the browser.'],
  ['Preserve', 'Keep the original file, with its quality and metadata intact.'],
  ['Organize', 'Collections, tags, and notes that work the way you think.'],
  ['Annotate', 'Mark up and comment on what you save.'],
  ['Search', 'Find a reference again without remembering where you put it.'],
  ['Share', 'Send a link to selected collections, with you in control of who sees them.'],
];

export interface Phase {
  number: string;
  name: string;
  short: string; // one line for the nav
  detail: string;
  now?: boolean;
}

export const PHASES: Phase[] = [
  {
    number: '01',
    name: 'Define',
    short: 'Identity, audience, and boundaries.',
    detail: 'Product identity, audience, capabilities, and boundaries.',
    now: true,
  },
  {
    number: '02',
    name: 'Establish',
    short: 'Brand, website, company basics.',
    detail: 'Branding, this public website, company foundations, and our Cloudflare startup strategy.',
    now: true,
  },
  {
    number: '03',
    name: 'Build',
    short: 'Private storage that keeps originals.',
    detail:
      'Private cloud storage, original-file preservation, authentication, organization, search, and reliability.',
  },
  {
    number: '04',
    name: 'Extend',
    short: 'Sharing and annotations.',
    detail: 'Sharing, annotations, and richer reference workflows.',
  },
  {
    number: '05',
    name: 'Explore',
    short: 'Ideas we’re not promising yet.',
    detail: 'Intelligent organization, guest feedback, and other future capabilities.',
  },
];

export const CLOUDFLARE: [term: string, detail: string][] = [
  ['Keep every original', 'Cloud storage and original-file preservation.'],
  ['Make images fast', 'Faster image delivery and processing.'],
  ['Help sort the pile', 'Intelligent reference organization. Exploratory, not promised.'],
];

export const STATUS: string[] = [
  'Good Internet is in early development. Nothing is released and there is no public product yet.',
  'The private workspace you can reach from “Prototype sign-in” is a prototype running on sample data. It is not our storage, preservation, or recovery system, and it isn’t open to the public.',
  'Sharing, annotations, and intelligent organization are not built. There are no native iOS or macOS apps planned right now.',
];
