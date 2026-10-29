import { Separator } from './parts.tsx';

interface RoadmapSection {
  id: string;
  label: string;
  description: string;
  items: [title: string, detail: string][];
}

const SECTIONS: RoadmapSection[] = [
  {
    id: 'now',
    label: 'NOW',
    description: 'Building the core.',
    items: [
      ['Reference library', 'A reliable place to save, browse, and manage visual references.'],
      ['Reference detail', 'A dedicated view for understanding and working with an individual reference.'],
      ['Metadata', 'Store useful context such as titles, sources, notes, tags, dates, and related information.'],
      ['Annotations', 'Add notes directly to specific points or regions of an image.'],
      ['Search', 'Find references through titles, notes, tags, boards, sources, and other saved context.'],
      ['Boards', 'Organize references into focused collections for projects, research, and visual exploration.'],
      ['Secure access', 'Private authentication and additional account protection for personal libraries.'],
      ['Production release', 'Bring the working Good Internet experience to goodinternetwww.com.'],
    ],
  },
  {
    id: 'next',
    label: 'NEXT',
    description: 'Expanding the workflow.',
    items: [
      ['Capture from anywhere', 'Save references from more places with less friction.'],
      ['Save from a link', 'Add a URL and let Good Internet capture the reference and preserve its source.'],
      ['Duplicate detection', 'Catch references that have already been saved.'],
      ['Bulk actions', 'Select multiple references and organize or edit them together.'],
      ['Smart collections', 'Create saved collections that update automatically based on rules.'],
      ['Color search and filtering', 'Use colors extracted from references as another way to browse the library.'],
      ['Reference comparison', 'View references side by side for critique and visual analysis.'],
      ['Improved board layouts', 'Let references retain their natural proportions inside boards.'],
      ['Resurfacing', 'Bring forgotten references back into view when they may be useful again.'],
      ['Faster search access', 'Open search from anywhere in Good Internet.'],
    ],
  },
  {
    id: 'later',
    label: 'LATER',
    description: 'Extending Good Internet beyond the core library.',
    items: [
      ['Native iOS experience', 'A dedicated mobile experience for capturing and working with references.'],
      ['Share extension', 'Send images, links, and other references directly into Good Internet from iOS.'],
      ['Native capture', 'Quickly keep references from Photos, Safari, and other apps.'],
      ['Public and shared boards', 'Create collections that can be selectively shared with other people.'],
      ['Exports', 'Export references and boards into portable formats and visual contact sheets.'],
      ['Automatic metadata', 'Suggest useful tags, descriptions, and other context during capture.'],
      ['Text extraction', 'Make visible text inside references searchable.'],
      ['Semantic search', 'Find references based on meaning rather than exact words.'],
      ['Visual similarity', 'Discover references that look or feel related.'],
      ['Related references', 'Surface meaningful connections across the library.'],
      ['Provenance', 'Track where references came from and how they connect to sources, projects, and one another.'],
    ],
  },
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
            Good Internet is being built in small, deliberate stages. This roadmap shows the major
            capabilities currently being developed, what comes next, and the longer-term direction
            of the product.
          </p>
          <p className="GoodInternetText1 GoodInternetMuted">Priorities may change as the product evolves.</p>
        </div>
      </section>

      {SECTIONS.map((section) => (
        <RoadmapList key={section.id} section={section} />
      ))}

      <Separator />
      <section className="GoodInternetContents">
        <p className="GoodInternetText1 GoodInternetMuted GoodInternetCol-body">
          Good Internet is actively evolving. The roadmap reflects current priorities and may change as the
          product develops.
        </p>
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
        <div className="GoodInternetStack GoodInternetStack-0 GoodInternetCol-label">
          <h2 id={headingId} className="GoodInternetText2">{section.label}</h2>
          <span className="GoodInternetText1 GoodInternetMuted">{section.description}</span>
        </div>
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
