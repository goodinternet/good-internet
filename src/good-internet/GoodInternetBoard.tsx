import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import {
  ArrowIcon,
  ImageFill,
} from './parts.tsx';
import { getBoard, type Board, type Reference } from './repository.ts';
import { formatDate, fullImageStyle, plural, sourceLabel, useDocumentTitle } from './utils.ts';

// /m/:token: an unlisted, read-only moodboard. Board shell: no nav, no sign-in.
export function GoodInternetBoard({ token }: { token: string }) {
  const [board, setBoard] = React.useState<Board | null | undefined>(undefined);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    let ignore = false;
    getBoard(token).then((b) => {
      if (!ignore) setBoard(b ?? null);
    });
    return () => {
      ignore = true;
    };
  }, [token]);

  useDocumentTitle(
    board === undefined ? undefined : board ? `${board.collection.name} · GOOD INTERNET` : 'Board unavailable · GOOD INTERNET',
  );

  if (board === undefined) return <div className="GoodInternetBody" />;

  if (board === null) {
    return (
      <div className="GoodInternetBody">
        <div className="GoodInternetGrid">
          <section className="GoodInternetContents">
            <h1 className="GoodInternetDisplay GoodInternetCol-hero">This board isn't available</h1>
            <p className="GoodInternetText2 GoodInternetMuted GoodInternetCol-body">
              The link may be wrong, or its owner has unpublished it or made a new link.
            </p>
          </section>
          <BoardFooter />
        </div>
      </div>
    );
  }

  const { collection, references, share } = board;

  return (
    <div className="GoodInternetBody">
      <div className="GoodInternetGrid">
        <header className="GoodInternetContents">
          <div className="GoodInternetCol-hero GoodInternetHeading">
            <h1 className="GoodInternetDisplay">{collection.name}</h1>
            <p className="GoodInternetText1 GoodInternetMuted">
              Saved by {share.owner} · {plural(references.length, 'reference')} · Published{' '}
              {formatDate(share.publishedAt)}
            </p>
          </div>
          {collection.description.trim() && (
            <p className="GoodInternetText2 GoodInternetCol-body GoodInternetPreLine">{collection.description}</p>
          )}
        </header>

        <main className="GoodInternetContents">
          {references.length === 0 ? (
            <p className="GoodInternetText2 GoodInternetMuted GoodInternetCol-full">This board is empty.</p>
          ) : (
            <ul className="GoodInternetBoardGrid GoodInternetCol-full" aria-label={collection.name}>
              {references.map((r, i) => (
                <li key={r.id}>
                  <button type="button" className="GoodInternetBoardItem" onClick={() => setOpenIndex(i)}>
                    <span className="GoodInternetImage" aria-hidden>
                      <ImageFill src={r.thumbUrl} />
                    </span>
                    <span className="GoodInternetText1 GoodInternetFigureName">{r.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>

        <BoardFooter />
      </div>

      <Lightbox
        references={references}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </div>
  );
}

function BoardFooter() {
  return (
    <footer className="GoodInternetContents">
      <p className="GoodInternetText1 GoodInternetMuted GoodInternetCol-full GoodInternetBoardFooter">
        Made with{' '}
        <a className="GoodInternetLink" href="/">
          GOOD INTERNET
        </a>
        , a library you can actually operate.
      </p>
    </footer>
  );
}

// Full-screen viewer: the image with its pins, then title, source, notes and pin captions.
function Lightbox({
  references,
  index,
  onIndexChange,
}: {
  references: Reference[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  // Keep showing the last reference while the close animation runs.
  const [shown, setShown] = React.useState(index ?? 0);
  if (index !== null && index !== shown) setShown(index);
  const reference = references[shown];
  const hasPrev = shown > 0;
  const hasNext = shown < references.length - 1;

  const go = (delta: number) => {
    const next = shown + delta;
    if (next >= 0 && next < references.length) onIndexChange(next);
  };

  return (
    <Dialog.Root
      open={index !== null}
      onOpenChange={(open) => {
        if (!open) onIndexChange(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup
          className="GoodInternetLightbox"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') go(-1);
            if (event.key === 'ArrowRight') go(1);
          }}
        >
          {reference && (
            <div className="GoodInternetLightboxInner">
              <div className="GoodInternetLightboxBar">
                <span className="GoodInternetText1 GoodInternetMuted">
                  {shown + 1} of {references.length}
                </span>
                <Dialog.Close className="GoodInternetLink GoodInternetText1 GoodInternetButtonReset GoodInternetButtonText1">
                  Close
                </Dialog.Close>
              </div>

              <div className="GoodInternetLightboxImage">
                <span
                  className="GoodInternetImage GoodInternetLightboxSquare"
                  style={fullImageStyle(reference)}
                  aria-hidden
                >
                  <ImageFill src={reference.imageUrl} eager />
                  {reference.pins.map((pin, i) => (
                    <span
                      key={pin.id}
                      className="GoodInternetPin"
                      style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
                    >
                      {i + 1}
                    </span>
                  ))}
                </span>
              </div>

              <div className="GoodInternetLightboxText">
                <Dialog.Title className="GoodInternetText2">{reference.title}</Dialog.Title>
                <Dialog.Description className="GoodInternetText1 GoodInternetMuted">
                  {sourceLabel(reference.captureUrl)}
                </Dialog.Description>
                {reference.notes && <p className="GoodInternetText1 GoodInternetPreLine">{reference.notes}</p>}
                {reference.pins.length > 0 && (
                  <ol className="GoodInternetList GoodInternetLightboxPins">
                    {reference.pins.map((pin, i) => (
                      <li key={pin.id} className="GoodInternetListItem GoodInternetPinRow GoodInternetPinRowStatic">
                        <span className="GoodInternetPin GoodInternetPinStatic" aria-hidden>
                          {i + 1}
                        </span>
                        <span className="GoodInternetText1">{pin.caption || 'No caption'}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="GoodInternetLightboxNav">
                <Button
                  className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2 GoodInternetButtonReset"
                  data-direction="prev"
                  disabled={!hasPrev}
                  focusableWhenDisabled
                  onClick={() => go(-1)}
                >
                  <span className="GoodInternetFlip">
                    <ArrowIcon />
                  </span>
                  Previous
                </Button>
                <Button
                  className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2 GoodInternetButtonReset"
                  disabled={!hasNext}
                  focusableWhenDisabled
                  onClick={() => go(1)}
                >
                  Next
                  <ArrowIcon />
                </Button>
              </div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
