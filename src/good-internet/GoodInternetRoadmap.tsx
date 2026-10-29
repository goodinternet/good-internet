import { ArrowLink, Separator } from './parts.tsx';

interface RoadmapSection {
  id: string;
  label: string;
  items: [title: string, detail: string][];
}

const PHASES: RoadmapSection = {
  id: 'phases',
  label: 'The phases',
  items: [
    ['Phase 0: Foundation', 'A working core: accounts, a place to save things, and a clean home for everything you collect.'],
    ['Phase 1: Capture', 'Save links, images, PDFs, notes and uploads from anywhere.'],
    [
      'Phase 2: Preserve',
      'Keep originals and snapshots, not just links, so your collection survives when the web changes. You always know what’s saved, what’s backed up, and who can see it.',
    ],
    ['Phase 3: Organize', 'Folders, collections and tags that work the way you think.'],
    ['Phase 4: Annotate', 'Add notes and highlights right on the things you save, so you never forget why you saved them.'],
    [
      'Phase 5: Connect',
      'Link items, ideas and projects together. Connections you make are always yours. Suggested connections are clearly labeled as suggestions, and you decide what stays.',
    ],
    [
      'Phase 6: Retrieve',
      'Find anything fast: filters and full-text search first, then search by meaning, then answers drawn from your own collection that always link back to the source.',
    ],
    ['Phase 7: Share', 'Share an item or a whole collection, with clear control over who sees what.'],
  ],
};

const PROMISES = [
  'Your stuff is yours, and you can export it anytime.',
  'Private by default.',
  'Clear about what’s preserved and what isn’t.',
  'No black-box AI deciding things for you.',
];

export function GoodInternetRoadmap() {
  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">Roadmap</h1>
      </section>

      <section className="GoodInternetContents">
        <div className="GoodInternetCol-body GoodInternetStack GoodInternetStack-4">
          <p className="GoodInternetText2">
            Good Internet is a cloud-based personal knowledge workspace, built around collecting, preserving,
            organizing, and connecting information.
          </p>
          <p className="GoodInternetText1 GoodInternetMuted">
            The workspace for the collectors, the researchers, the organizers, and the makers.
          </p>
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-roadmap-approach">
        <h2 id="gi-roadmap-approach" className="GoodInternetText2 GoodInternetCol-label">
          How we’re building it
        </h2>
        <p className="GoodInternetText2 GoodInternetCol-body">
          Reliability first. Storage is the foundation; connection and retrieval are what make it useful. Not
          everything has to be AI. Folders, notes, manual connections and dependable search come first, and
          intelligence makes them better, never unpredictable.
        </p>
      </section>

      <RoadmapList section={PHASES} />

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-roadmap-hood">
        <div className="GoodInternetStack GoodInternetStack-0 GoodInternetCol-label">
          <h2 id="gi-roadmap-hood" className="GoodInternetText2">Under the hood</h2>
          <span className="GoodInternetText1 GoodInternetMuted">Storage remembers. Compute works.</span>
        </div>
        <p className="GoodInternetText2 GoodInternetCol-body">
          Every saved item follows one path: secure file storage, a structured record with its details and
          connections, background processing that reads and indexes it, then fast search and retrieval.
        </p>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-roadmap-promises">
        <h2 id="gi-roadmap-promises" className="GoodInternetText2 GoodInternetCol-label">
          Our promises
        </h2>
        <div className="GoodInternetCol-body">
          <ul className="GoodInternetList">
            {PROMISES.map((promise) => (
              <li key={promise} className="GoodInternetListItem GoodInternetListSingle">
                <span className="GoodInternetText2">{promise}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-roadmap-access">
        <h2 id="gi-roadmap-access" className="GoodInternetText2 GoodInternetCol-label">
          Get early access
        </h2>
        <div className="GoodInternetCol-body">
          <ArrowLink href="/request">Join the list</ArrowLink>
        </div>
      </section>
    </>
  );
}

function RoadmapList({ section }: { section: RoadmapSection }) {
  const headingId = `gi-roadmap-${section.id}`;
  return (
    <>
      <Separator />
      <section className="GoodInternetContents" aria-labelledby={headingId}>
        <h2 id={headingId} className="GoodInternetText2 GoodInternetCol-label">
          {section.label}
        </h2>
        <div className="GoodInternetCol-body">
          <ul className="GoodInternetList">
            {section.items.map(([title, detail]) => (
              <li key={title} className="GoodInternetListItem GoodInternetListSingle">
                <span className="GoodInternetStack GoodInternetStack-0">
                  <span className="GoodInternetText2">{title}</span>
                  <span className="GoodInternetText1 GoodInternetMuted">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
