import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { ImageFill, SearchIcon } from './parts.tsx';
import type { Reference } from './repository.ts';
import { sourceLabel } from './utils.ts';

type View = 'grid' | 'list';

const VIEW_KEY = 'goodinternet.lab.view';

const sourceMeta = (r: Reference) => sourceLabel(r.captureUrl);

function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
}

// A labeled section of references: Grid / List switch, search, and the grid or ruled list.
// Used by a collection page and by the library's All references.
export function ReferenceBrowser({
  id,
  heading,
  references,
  meta = sourceMeta,
  emptyText = 'Nothing saved here yet.',
  actions,
}: {
  id: string;
  heading: string;
  references: Reference[];
  // Second line under each item: the source site by default
  meta?: (r: Reference) => string;
  emptyText?: string;
  // Extra controls under the heading, e.g. Add images
  actions?: React.ReactNode;
}) {
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState<View>(readView);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return references;
    return references.filter((r) =>
      [r.title, meta(r), sourceLabel(r.captureUrl), r.fileName, r.notes, ...r.tags, ...r.pins.map((p) => p.caption)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [references, query, meta]);

  const changeView = (next: View) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Not remembered; fine.
    }
  };

  const hrefFor = (r: Reference) => `/library/${r.collectionId}/${r.id}`;

  return (
    <section className="GoodInternetContents" aria-labelledby={id}>
      <div className="GoodInternetStack GoodInternetStack-4 GoodInternetCol-label">
        <h2 id={id} className="GoodInternetText2">
          {heading}
        </h2>
        <ToggleGroup
          className="GoodInternetSegmented"
          aria-label={`${heading} view`}
          value={[view]}
          onValueChange={(value) => {
            if (value[0]) changeView(value[0] as View);
          }}
        >
          <Toggle className="GoodInternetSegmentedItem GoodInternetText1" value="grid">
            Grid
          </Toggle>
          <Toggle className="GoodInternetSegmentedItem GoodInternetText1" value="list">
            List
          </Toggle>
        </ToggleGroup>
        {actions}
      </div>

      <div className="GoodInternetCol-wide GoodInternetStack GoodInternetStack-6">
        {references.length > 0 && (
          <Field.Root className="GoodInternetSearch">
            <Field.Label className="bui-sr-only">Search {heading.toLowerCase()}</Field.Label>
            <SearchIcon />
            <Input
              className="GoodInternetText2 GoodInternetInput"
              type="search"
              placeholder="Search titles, tags, notes"
              value={query}
              onValueChange={setQuery}
              autoComplete="off"
              enterKeyHint="search"
            />
          </Field.Root>
        )}

        {references.length === 0 && <p className="GoodInternetText2 GoodInternetMuted">{emptyText}</p>}
        {references.length > 0 && visible.length === 0 && (
          <p className="GoodInternetText2 GoodInternetMuted" role="status">
            No references match “{query.trim()}”.
          </p>
        )}

        {view === 'grid' ? (
          <ul className="GoodInternetFigureGrid" aria-label={heading}>
            {visible.map((r) => (
              <li key={r.id}>
                <a className="GoodInternetFigureLink" href={hrefFor(r)}>
                  <span className="GoodInternetImage" aria-hidden>
                    <ImageFill src={r.thumbUrl} />
                    {r.pins.length > 0 && <span className="GoodInternetImagePinCount">{r.pins.length}</span>}
                  </span>
                  <span className="GoodInternetStack GoodInternetStack-0">
                    <span className="GoodInternetText1 GoodInternetFigureName">{r.title}</span>
                    <span className="GoodInternetText1 GoodInternetMuted GoodInternetTruncate">{meta(r)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="GoodInternetList" aria-label={heading}>
            {visible.map((r) => (
              <li key={r.id}>
                <a className="GoodInternetRefRow" href={hrefFor(r)}>
                  <span className="GoodInternetImage GoodInternetImageThumb" aria-hidden>
                    <ImageFill src={r.thumbUrl} />
                  </span>
                  <span className="GoodInternetText2 GoodInternetFigureName">{r.title}</span>
                  <span className="GoodInternetText1 GoodInternetMuted GoodInternetRefRowMeta GoodInternetTruncate">{meta(r)}</span>
                  <span className="GoodInternetText1 GoodInternetMuted GoodInternetRefRowYear">{r.fileType}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
