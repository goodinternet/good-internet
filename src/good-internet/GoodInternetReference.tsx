import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import {
  ArrowIcon,
  BackLink,
  ImageFill,
  Separator,
} from './parts.tsx';
import {
  getCollection,
  listReferences,
  updateReference,
  type Collection,
  type Pin,
  type Reference,
} from './repository.ts';
import { formatBytes, formatDate, fullImageStyle, useDocumentTitle } from './utils.ts';
import { navigate } from './navigate.ts';

// /library/:collectionId/:referenceId: one reference with its details, notes, tags and pins.
export function GoodInternetReference({
  collectionId,
  referenceId,
}: {
  collectionId: string;
  referenceId: string;
}) {
  const [collection, setCollection] = React.useState<Collection | null>(null);
  const [references, setReferences] = React.useState<Reference[] | null>(null);
  const [reference, setReference] = React.useState<Reference | null>(null);

  React.useEffect(() => {
    let ignore = false;
    Promise.all([getCollection(collectionId), listReferences(collectionId)]).then(([c, refs]) => {
      if (ignore) return;
      setCollection(c ?? null);
      setReferences(refs);
      setReference(refs.find((r) => r.id === referenceId) ?? null);
    });
    return () => {
      ignore = true;
    };
  }, [collectionId, referenceId]);

  useDocumentTitle(reference ? `${reference.title} · GOOD INTERNET` : undefined);

  const index = references && reference ? references.findIndex((r) => r.id === reference.id) : -1;
  const hrefFor = (r: Reference | undefined) =>
    r ? `/library/${collectionId}/${r.id}` : undefined;
  const prevHref = references ? hrefFor(references[index - 1]) : undefined;
  const nextHref = references ? hrefFor(references[index + 1]) : undefined;
  const collectionHref = `/library/${collectionId}`;

  // ← / → step through the collection, Escape goes back to it (never while typing).
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;
      const href =
        event.key === 'ArrowLeft'
          ? prevHref
          : event.key === 'ArrowRight'
            ? nextHref
            : event.key === 'Escape'
              ? collectionHref
              : undefined;
      if (href) {
        event.preventDefault();
        navigate(href);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [prevHref, nextHref, collectionHref]);

  if (!references) return null;
  if (!collection || !reference) {
    return (
      <section className="GoodInternetContents">
        <div className="GoodInternetCol-hero GoodInternetHeading">
          <BackLink href={collection ? collectionHref : '/library'}>
            {collection?.name ?? 'Library'}
          </BackLink>
          <h1 className="GoodInternetDisplay">Reference not found</h1>
        </div>
      </section>
    );
  }

  const save = (patch: Partial<Pick<Reference, 'notes' | 'tags' | 'pins'>>) => {
    setReference((current) => (current ? { ...current, ...patch } : current));
    void updateReference(collectionId, reference.id, patch);
  };

  return (
    <PinFocusProvider>
      <section className="GoodInternetContents">
        <div className="GoodInternetCol-hero GoodInternetHeading">
          <nav className="GoodInternetCrumbs" aria-label="Breadcrumb">
            <a className="GoodInternetLink GoodInternetText1" href="/library">
              Library
            </a>
            <span className="GoodInternetText1 GoodInternetMuted" aria-hidden>
              /
            </span>
            <a className="GoodInternetLink GoodInternetText1" href={collectionHref}>
              {collection.name}
            </a>
          </nav>
          <h1 className="GoodInternetDisplay">{reference.title}</h1>
        </div>
      </section>

      <section className="GoodInternetContents">
        <div className="GoodInternetCol-body GoodInternetPager">
          <span className="GoodInternetText2 GoodInternetMuted">
            {index + 1} of {references.length}
          </span>
          <span className="GoodInternetPagerLinks">
            <PagerLink href={prevHref} direction="prev">
              Previous
            </PagerLink>
            <PagerLink href={nextHref} direction="next">
              Next
            </PagerLink>
          </span>
        </div>
      </section>

      {/* Meaning first */}
      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-image">
        <div className="GoodInternetStack GoodInternetStack-4 GoodInternetCol-label">
          <h2 id="gi-image" className="GoodInternetText2">
            Image
          </h2>
          <p className="GoodInternetText1 GoodInternetMuted">Tap the image to drop a pin.</p>
        </div>
        <div className="GoodInternetCol-body">
          <PinCanvas
            reference={reference}
            pins={reference.pins}
            onAdd={(pin) => save({ pins: [...reference.pins, pin] })}
          />
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-notes">
        <h2 id="gi-notes" className="GoodInternetText2 GoodInternetCol-label">
          Notes
        </h2>
        <Field.Root className="GoodInternetCol-body GoodInternetNotes">
          <Field.Label className="bui-sr-only">Notes</Field.Label>
          <Field.Control
            render={<textarea rows={4} />}
            className="GoodInternetText2 GoodInternetInput GoodInternetTextarea"
            placeholder="What's worth remembering about this one?"
            value={reference.notes}
            onValueChange={(notes) => save({ notes })}
          />
        </Field.Root>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-tags">
        <h2 id="gi-tags" className="GoodInternetText2 GoodInternetCol-label">
          Tags
        </h2>
        <div className="GoodInternetCol-body">
          <TagEditor tags={reference.tags} onChange={(tags) => save({ tags })} />
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-pins">
        <h2 id="gi-pins" className="GoodInternetText2 GoodInternetCol-label">
          Annotations
        </h2>
        <div className="GoodInternetCol-body">
          <PinList pins={reference.pins} onChange={(pins) => save({ pins })} />
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-collections">
        <h2 id="gi-collections" className="GoodInternetText2 GoodInternetCol-label">
          Collections
        </h2>
        <div className="GoodInternetCol-body">
          <ul className="GoodInternetList">
            <li className="GoodInternetListItem GoodInternetListSingle">
              <a className="GoodInternetLink GoodInternetText2" href={collectionHref}>
                {collection.name}
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* File facts second */}
      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-file">
        <h2 id="gi-file" className="GoodInternetText2 GoodInternetCol-label">
          File
        </h2>
        <div className="GoodInternetCol-body">
          <dl className="GoodInternetList GoodInternetDetails">
            <DetailRow term="Name">
              <span className="GoodInternetBreakAll">{reference.fileName}</span>
            </DetailRow>
            <DetailRow term="Type">{reference.fileType}</DetailRow>
            <DetailRow term="Pixel size">
              {reference.width} × {reference.height}
            </DetailRow>
            <DetailRow term="Size">{formatBytes(reference.bytes)}</DetailRow>
            <DetailRow term="Added">{formatDate(reference.addedAt)}</DetailRow>
            <DetailRow term="Source">
              {reference.captureUrl ? (
                <a
                  className="GoodInternetLink GoodInternetBreakAll"
                  href={reference.captureUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {reference.captureUrl.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              ) : (
                'Uploaded'
              )}
            </DetailRow>
          </dl>
        </div>
      </section>
    </PinFocusProvider>
  );
}

function PagerLink({
  href,
  direction,
  children,
}: {
  href: string | undefined;
  direction: 'prev' | 'next';
  children: React.ReactNode;
}) {
  const content =
    direction === 'prev' ? (
      <>
        <span className="GoodInternetFlip">
          <ArrowIcon />
        </span>
        {children}
      </>
    ) : (
      <>
        {children}
        <ArrowIcon />
      </>
    );
  if (!href) {
    return (
      <span className="GoodInternetText2 GoodInternetPagerDisabled" aria-disabled="true">
        {content}
      </span>
    );
  }
  return (
    <a
      className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2"
      href={href}
      rel={direction}
      data-direction={direction}
    >
      {content}
    </a>
  );
}

function DetailRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="GoodInternetListItem">
      <dt className="GoodInternetText2">{term}</dt>
      <dd className="GoodInternetText2">{children}</dd>
    </div>
  );
}

// ─── Pins ───

const PinFocusContext = React.createContext<{
  active: string | null;
  setActive: (id: string | null) => void;
  focusRequest: string | null;
  requestFocus: (id: string | null) => void;
}>({ active: null, setActive: () => {}, focusRequest: null, requestFocus: () => {} });

// Pins are shared between the image and the list, so hovering a row can highlight its marker.
function usePinFocus() {
  return React.useContext(PinFocusContext);
}

function PinCanvas({
  reference,
  pins,
  onAdd,
}: {
  reference: Reference;
  pins: Pin[];
  onAdd: (pin: Pin) => void;
}) {
  const { active, requestFocus } = usePinFocus();
  return (
    <div className="GoodInternetCanvas">
      <button
        type="button"
        className="GoodInternetImage GoodInternetImageLarge"
        style={fullImageStyle(reference)}
        aria-label="Drop a pin on the image"
        onClick={(event) => {
          // Keyboard activation has no pointer position: drop the pin in the center.
          const rect = event.currentTarget.getBoundingClientRect();
          const fromPointer = event.detail > 0;
          const clamp = (n: number) => Math.min(0.98, Math.max(0.02, n));
          const pin: Pin = {
            id: `pin-${Date.now().toString(36)}`,
            x: fromPointer ? clamp((event.clientX - rect.left) / rect.width) : 0.5,
            y: fromPointer ? clamp((event.clientY - rect.top) / rect.height) : 0.5,
            caption: '',
          };
          onAdd(pin);
          requestFocus(pin.id);
        }}
      >
        <ImageFill src={reference.imageUrl} eager />
        {pins.map((pin, i) => (
          <span
            key={pin.id}
            className="GoodInternetPin"
            data-active={pin.id === active || undefined}
            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
            aria-hidden
          >
            {i + 1}
          </span>
        ))}
      </button>
    </div>
  );
}

function PinList({ pins, onChange }: { pins: Pin[]; onChange: (pins: Pin[]) => void }) {
  const { setActive, focusRequest, requestFocus } = usePinFocus();

  React.useEffect(() => {
    if (!focusRequest) return;
    // Field owns the input's id, so find it by a data attribute instead.
    const input = document.querySelector<HTMLInputElement>(
      `[data-pin-caption="${focusRequest}"]`,
    );
    if (input) {
      input.focus({ preventScroll: true });
      input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      requestFocus(null);
    }
  }, [focusRequest, pins, requestFocus]);

  if (pins.length === 0) {
    return <p className="GoodInternetText2 GoodInternetMuted">No annotations yet. Tap the image to drop a pin.</p>;
  }

  return (
    <ol className="GoodInternetList">
      {pins.map((pin, i) => (
        <li
          key={pin.id}
          className="GoodInternetListItem GoodInternetPinRow"
          onPointerEnter={() => setActive(pin.id)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(pin.id)}
          onBlur={() => setActive(null)}
        >
          <span className="GoodInternetPin GoodInternetPinStatic" aria-hidden>
            {i + 1}
          </span>
          <Field.Root className="GoodInternetPinField">
            <Field.Label className="bui-sr-only">Pin {i + 1} caption</Field.Label>
            <Input
              data-pin-caption={pin.id}
              className="GoodInternetText2 GoodInternetInput"
              placeholder="Caption"
              value={pin.caption}
              onValueChange={(caption) =>
                onChange(pins.map((p) => (p.id === pin.id ? { ...p, caption } : p)))
              }
            />
          </Field.Root>
          <Button
            className="GoodInternetLink GoodInternetText1 GoodInternetButtonReset GoodInternetButtonText1 GoodInternetMuted"
            aria-label={`Remove pin ${i + 1}`}
            onClick={() => {
              setActive(null);
              onChange(pins.filter((p) => p.id !== pin.id));
            }}
          >
            Remove
          </Button>
        </li>
      ))}
    </ol>
  );
}

function PinFocusProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState<string | null>(null);
  const [focusRequest, requestFocus] = React.useState<string | null>(null);
  const value = React.useMemo(
    () => ({ active, setActive, focusRequest, requestFocus }),
    [active, focusRequest],
  );
  return <PinFocusContext.Provider value={value}>{children}</PinFocusContext.Provider>;
}

// ─── Tags ───

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = React.useState('');

  const add = () => {
    const tag = draft.trim().replace(/\s+/g, ' ');
    if (!tag) return;
    if (!tags.some((t) => t.toLowerCase() === tag.toLowerCase())) onChange([...tags, tag]);
    setDraft('');
  };

  return (
    <div className="GoodInternetStack GoodInternetStack-4 GoodInternetStretch">
      {tags.length > 0 && (
        <ul className="GoodInternetTags" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag} className="GoodInternetTag">
              <span className="GoodInternetText2">{tag}</span>
              <Button
                className="GoodInternetTagRemove GoodInternetButtonReset"
                aria-label={`Remove tag ${tag}`}
                onClick={() => onChange(tags.filter((t) => t !== tag))}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="m1.5 1.5 7 7m0-7-7 7" stroke="currentColor" strokeLinecap="square" />
                </svg>
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Field.Root className="GoodInternetSearch">
        <Field.Label className="bui-sr-only">Add a tag</Field.Label>
        <Input
          className="GoodInternetText2 GoodInternetInput"
          placeholder="Add a tag"
          value={draft}
          onValueChange={setDraft}
          enterKeyHint="done"
          autoComplete="off"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              add();
            }
          }}
          onBlur={add}
        />
      </Field.Root>
    </div>
  );
}
