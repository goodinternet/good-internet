// Copy for the one-page landing and its nav.
// The roadmap detail follows docs/roadmap/ROADMAP.md (the engineering plan), in plain words.

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
  youCan: string[]; // what it means for you
  building: string[]; // how it works
  doneWhen: string[]; // how we'll know it's finished
  note?: string; // how settled the plan is, when it isn't fully specced yet
  now?: boolean;
}

export const PHASES: Phase[] = [
  {
    number: '00',
    name: 'Foundation',
    short: 'Accounts and a home for what you save.',
    detail: 'A working core: accounts, a place to save things, and a clean home for everything you collect.',
    youCan: [
      'Ask for an invite and actually hear back.',
      'Sign in with a username, a password, and a code from an authenticator app.',
      'Make collections and upload images into them.',
      'Open the same library from any browser.',
    ],
    building: [
      'Email and password accounts only. No “Sign in with Google” or other social logins.',
      'Two-factor sign-in on every account. A stolen password alone opens nothing.',
      'A private database where every row is checked against its owner, so no one can read, change, or delete anyone else’s things.',
      'A private image store. Images are only reachable through links that expire, never through a permanent public address.',
      'Images are resized on your device before upload, with location and camera details stripped out.',
      'Invite requests stored on our side, so they reach us instead of sitting in your browser.',
    ],
    doneWhen: [
      'Tests prove one account can’t see, change, or delete another’s rows or images.',
      'A session without the second factor reads nothing.',
      'The library runs on real data at goodinternetwww.com.',
    ],
    now: true,
  },
  {
    number: '01',
    name: 'Capture',
    short: 'Links, images, PDFs, notes, uploads.',
    detail: 'Save links, images, PDFs, notes and uploads from anywhere.',
    youCan: [
      'Upload a batch of images and watch each one land.',
      'Share from Safari, Photos, or Instagram straight into Good Internet on iPhone.',
      'Take a photo or pick from your library inside the app.',
      'Choose which collection something goes into without opening the app.',
    ],
    building: [
      'An iPhone app alongside the web app, sharing the same account and library.',
      'A share extension, so saving works from the apps you already use.',
      'An upload queue that keeps going if you lose signal, switch apps, or close the app, and picks up where it left off.',
      'One bad file fails on its own and tells you so. It never takes the rest of the batch down with it.',
      'Images first. PDFs and plain notes follow once images are solid.',
    ],
    doneWhen: [
      'Twenty photos queued, app closed right away, and all twenty arrive.',
      'A shared link lands with the page it came from kept alongside it.',
      'Sharing ten large photos at once doesn’t crash.',
    ],
  },
  {
    number: '02',
    name: 'Preserve',
    short: 'Originals and snapshots that last.',
    detail:
      'Keep originals and snapshots, not just links, so your collection survives when the web changes. You always know what’s saved, what’s backed up, and who can see it.',
    youCan: [
      'Keep the actual file, not only a link to it.',
      'See at a glance what’s stored, what’s backed up, and who can see it.',
      'Browse what you’ve already opened on iPhone, even offline.',
      'Export everything you’ve saved, and delete your account and all of it, whenever you want.',
    ],
    building: [
      'Originals stored with each reference, plus snapshots of saved pages, so a dead link doesn’t empty your collection.',
      'An on-device cache with a size limit, so your phone doesn’t quietly fill up.',
      'An honest offline state: it shows what’s available and says what isn’t, never an endless spinner.',
      'Account deletion inside the app, not hidden behind an email.',
    ],
    doneWhen: [
      'Airplane mode still shows the collections you’ve browsed.',
      'A link that dies after you saved it still opens your copy.',
      'An export contains every file, note, and tag you added.',
    ],
    note: 'Offline reading and account deletion are planned in detail. Snapshots and export are still being designed.',
  },
  {
    number: '03',
    name: 'Organize',
    short: 'Folders, collections and tags.',
    detail: 'Folders, collections and tags that work the way you think.',
    youCan: [
      'Group things into collections, each with a name and a description.',
      'Tag anything, and use the same tags across every collection.',
      'Rename what you’ve saved instead of living with file names.',
      'Nest collections into folders when one level isn’t enough.',
    ],
    building: [
      'Tags kept once per account, so the same tag means the same thing everywhere.',
      'Each collection gets an address that stays the same, so links to it keep working.',
      'Nothing is sorted or filed for you unless you ask.',
    ],
    doneWhen: [
      'Collections, tags, and titles you change show up the same on web and iPhone.',
      'Renaming something never breaks a link to it.',
    ],
    note: 'Collections and tags are planned in detail. Folders are still being designed.',
  },
  {
    number: '04',
    name: 'Annotate',
    short: 'Notes and highlights on what you save.',
    detail: 'Add notes and highlights right on the things you save, so you never forget why you saved them.',
    youCan: [
      'Write a note on anything you save.',
      'Drop numbered pins on an image, each with its own caption.',
      'Draw a box around the part of an image that matters.',
    ],
    building: [
      'Pins and boxes stored as positions on the image, so they line up at any size, on any screen.',
      'Notes saved with the thing itself, so they travel with it when you share or export.',
      'Everything you write is searchable later (see Retrieve).',
    ],
    doneWhen: [
      'A pin placed on your laptop sits in the same spot on your phone.',
      'Notes, pins, and captions all come back in search.',
    ],
    note: 'Notes and pins are planned in detail. Boxes come after.',
  },
  {
    number: '05',
    name: 'Connect',
    short: 'Link items, ideas and projects.',
    detail:
      'Link items, ideas and projects together. Connections you make are always yours. Suggested connections are clearly labeled as suggestions, and you decide what stays.',
    youCan: [
      'Link two things you saved, and see everything linked to an item.',
      'Gather items and ideas around a project.',
      'Accept or dismiss suggested connections, one by one.',
    ],
    building: [
      'Connections you make are stored as yours and never changed for you.',
      'Suggestions are always labeled as suggestions and never added without you saying yes.',
      'Any connection can be removed at any time.',
    ],
    doneWhen: [
      'Every suggestion can be traced to why it was made.',
      'Turning suggestions off leaves your own connections exactly as they were.',
    ],
    note: 'Still being designed. This entry will get more specific before work starts.',
  },
  {
    number: '06',
    name: 'Retrieve',
    short: 'Find anything fast.',
    detail:
      'Find anything fast: filters and full-text search first, then search by meaning, then answers drawn from your own collection that always link back to the source.',
    youCan: [
      'Filter and search a collection instantly.',
      'Search across titles, notes, tags, and pin captions in one place.',
      'Jump anywhere from the keyboard with a command palette.',
      'Later, search by meaning, and ask questions answered from your own collection.',
    ],
    building: [
      'Plain, predictable search first: the same search gives the same results.',
      'Search by meaning only after plain search is dependable.',
      'Every answer links back to the exact things it came from. No source, no answer.',
      'Answers are drawn from your own collection, not the open web.',
    ],
    doneWhen: [
      'Anything you saved can be found by a word in its title, notes, tags, or captions.',
      'Every answer shows its sources, and each one opens.',
    ],
    note: 'Filters and full-text search are planned in detail. Search by meaning and answers are still being designed.',
  },
  {
    number: '07',
    name: 'Share',
    short: 'Share with clear control.',
    detail: 'Share an item or a whole collection, with clear control over who sees what.',
    youCan: [
      'Publish a collection as a board at its own link.',
      'Send that link to anyone. They don’t need an account to look.',
      'Make a new link, which shuts off the old one right away.',
      'Unpublish whenever you want.',
    ],
    building: [
      'Everything is private until you publish it.',
      'A board shows only what’s on it: no email, no account details, nothing else from your library.',
      'Unpublishing takes effect within about a minute, and images on a board are served through links that expire.',
      'On iPhone, board links open in the app if it’s installed and on the web if it isn’t.',
      'A clean preview when a board link is pasted into a chat.',
    ],
    doneWhen: [
      'A board opens signed out, on someone else’s device, exactly as you see it.',
      'After unpublishing or a new link, the old link shows “This board isn’t available.”',
    ],
  },
];

export const PROMISES = [
  'Your stuff is yours, and you can export it anytime.',
  'Private by default.',
  'Clear about what’s preserved and what isn’t.',
  'No black-box AI deciding things for you.',
];
