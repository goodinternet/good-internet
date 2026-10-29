import { ArrowLink, Separator } from './parts.tsx';

const ACTIONS = [
  ['Capture', 'URLs, images, PDFs, notes, uploads.'],
  ['Preserve', 'Original content where supported, with clear retention and backup behavior.'],
  ['Organize', 'Folders, collections, tags, metadata.'],
  ['Annotate', 'Notes, highlights, comments tied to resources.'],
  ['Connect', 'Relationships between items, ideas, and projects.'],
  ['Retrieve', 'Fast filtering and full-text search, then semantic search.'],
  ['Share', 'Controlled access to resources or collections.'],
];

const PROJECT = [
  ['Storage', 'Your information lives somewhere reliable.'],
  ['Knowledge', 'It gains context, relationships, and meaning.'],
  ['Retrieval', 'You can find it and work with it again.'],
];

export function GoodInternetLanding() {
  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">The workspace for the collectors, the researchers, the organizers, and the makers.</h1>
      </section>

      <section className="GoodInternetContents">
        <p className="GoodInternetText2 GoodInternetCol-body">
          A cloud-based personal knowledge workspace, built around collecting, preserving, organizing, and connecting information.
        </p>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-access">
        <h2 id="gi-access" className="GoodInternetText2 GoodInternetCol-label">
          Access
        </h2>
        <div className="GoodInternetStack GoodInternetStack-4 GoodInternetCol-body">
          <p className="GoodInternetText2">Good Internet is in early development.</p>
          <ul className="GoodInternetList GoodInternetListFill">
            <li className="GoodInternetListItem">
              <span className="GoodInternetText2">Members</span>
              <span className="GoodInternetText2">
                <ArrowLink href="/login">Sign in</ArrowLink>
              </span>
            </li>
            <li className="GoodInternetListItem">
              <span className="GoodInternetText2">Roadmap</span>
              <span className="GoodInternetText2">
                <ArrowLink href="/roadmap">See what’s being built</ArrowLink>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-actions">
        <h2 id="gi-actions" className="GoodInternetText2 GoodInternetCol-label">
          Fundamental actions
        </h2>
        <div className="GoodInternetCol-body">
          <ul className="GoodInternetList">
            {ACTIONS.map(([term, detail]) => (
              <li key={term} className="GoodInternetListItem">
                <span className="GoodInternetText2">{term}</span>
                <span className="GoodInternetText2">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-project">
        <h2 id="gi-project" className="GoodInternetText2 GoodInternetCol-label">
          The project
        </h2>
        <div className="GoodInternetCol-body">
          <ul className="GoodInternetList">
            {PROJECT.map(([term, detail]) => (
              <li key={term} className="GoodInternetListItem">
                <span className="GoodInternetText2">{term}</span>
                <span className="GoodInternetText2">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
