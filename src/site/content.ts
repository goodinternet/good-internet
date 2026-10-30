// Copy for the one-page landing and its nav.

export const PROJECT: [term: string, detail: string][] = [
  ['Storage', 'Your information lives somewhere reliable.'],
  ['Knowledge', 'It gains context, relationships, and meaning.'],
  ['Retrieval', 'You can find it and work with it again.'],
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
    number: '00',
    short: 'Accounts and a home for what you save.',
    name: 'Foundation',
    detail: 'A working core: accounts, a place to save things, and a clean home for everything you collect.',
    now: true,
  },
  { number: '01', short: 'Links, images, PDFs, notes, uploads.', name: 'Capture', detail: 'Save links, images, PDFs, notes and uploads from anywhere.' },
  {
    number: '02',
    short: 'Originals and snapshots that last.',
    name: 'Preserve',
    detail:
      'Keep originals and snapshots, not just links, so your collection survives when the web changes. You always know what’s saved, what’s backed up, and who can see it.',
  },
  { number: '03', short: 'Folders, collections and tags.', name: 'Organize', detail: 'Folders, collections and tags that work the way you think.' },
  {
    number: '04',
    short: 'Notes and highlights on what you save.',
    name: 'Annotate',
    detail: 'Add notes and highlights right on the things you save, so you never forget why you saved them.',
  },
  {
    number: '05',
    short: 'Link items, ideas and projects.',
    name: 'Connect',
    detail:
      'Link items, ideas and projects together. Connections you make are always yours. Suggested connections are clearly labeled as suggestions, and you decide what stays.',
  },
  {
    number: '06',
    short: 'Find anything fast.',
    name: 'Retrieve',
    detail:
      'Find anything fast: filters and full-text search first, then search by meaning, then answers drawn from your own collection that always link back to the source.',
  },
  { number: '07', short: 'Share with clear control.', name: 'Share', detail: 'Share an item or a whole collection, with clear control over who sees what.' },
];

export const PROMISES = [
  'Your stuff is yours, and you can export it anytime.',
  'Private by default.',
  'Clear about what’s preserved and what isn’t.',
  'No black-box AI deciding things for you.',
];
