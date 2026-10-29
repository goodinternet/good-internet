import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';
import { Input } from '@base-ui/react/input';
import { ArrowIcon, ImageFill, SearchIcon, Separator } from './parts.tsx';
import {
  createCollection,
  listAllReferences,
  listCollections,
  type Collection,
  type Reference,
} from './repository.ts';
import { ReferenceBrowser } from './ReferenceBrowser.tsx';
import { plural } from './utils.ts';

// /library: collections index, the app home. Tiles follow the base-ui.com "Made for the makers" grid;
// each tile's 2×2 mosaic stands in for the collection's first images.
export function GoodInternetLibrary() {
  const [collections, setCollections] = React.useState<Collection[] | null>(null);
  const [query, setQuery] = React.useState('');
  const [createdId, setCreatedId] = React.useState<string | null>(null);
  const [allReferences, setAllReferences] = React.useState<Reference[]>([]);

  React.useEffect(() => {
    let ignore = false;
    Promise.all([listCollections(), listAllReferences()]).then(([list, refs]) => {
      if (ignore) return;
      setCollections(list);
      setAllReferences(refs);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!collections || !q) return collections ?? [];
    return collections.filter((c) => c.name.toLowerCase().includes(q));
  }, [collections, query]);

  const total = collections?.reduce((sum, c) => sum + c.referenceCount, 0) ?? 0;
  // In All references, each item's second line is the collection it belongs to.
  const collectionNames = React.useMemo(
    () => new Map((collections ?? []).map((c) => [c.id, c.name])),
    [collections],
  );

  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">Library</h1>
      </section>

      <section className="GoodInternetContents">
        <p className="GoodInternetText2 GoodInternetCol-body">
          {collections
            ? `${plural(collections.length, 'collection')}, ${plural(total, 'reference')}.`
            : ' '}
        </p>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-collections">
        <div className="GoodInternetStack GoodInternetStack-4 GoodInternetCol-label">
          <h2 id="gi-collections" className="GoodInternetText2">
            Collections
          </h2>
          <NewCollectionDialog
            onCreated={(collection) => {
              setQuery('');
              setCollections((list) => [collection, ...(list ?? [])]);
              setCreatedId(collection.id);
            }}
          />
        </div>

        <div className="GoodInternetCol-wide GoodInternetStack GoodInternetStack-6">
          <Field.Root className="GoodInternetSearch">
            <Field.Label className="bui-sr-only">Search collections</Field.Label>
            <SearchIcon />
            <Input
              className="GoodInternetText2 GoodInternetInput"
              type="search"
              placeholder="Search collections"
              value={query}
              onValueChange={setQuery}
              autoComplete="off"
              enterKeyHint="search"
            />
          </Field.Root>

          {collections && visible.length === 0 && (
            <p className="GoodInternetText2 GoodInternetMuted" role="status">
              No collections match “{query.trim()}”.
            </p>
          )}

          <ul className="GoodInternetFigureGrid" aria-label="Collections">
            {visible.map((c) => (
              <li key={c.id} className="GoodInternetFigureItem" data-new={c.id === createdId || undefined}>
                <a className="GoodInternetFigureLink" href={`/library/${c.id}`}>
                  <Mosaic count={c.referenceCount} covers={c.covers ?? []} />
                  <span className="GoodInternetStack GoodInternetStack-0">
                    <span className="GoodInternetText1 GoodInternetFigureName">{c.name}</span>
                    <span className="GoodInternetText1 GoodInternetMuted">{plural(c.referenceCount, 'reference')}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />
      <ReferenceBrowser
        id="gi-all-references"
        heading="All references"
        references={allReferences}
        meta={(r) => collectionNames.get(r.collectionId) ?? ''}
        emptyText="Nothing saved yet."
      />
    </>
  );
}

function NewCollectionDialog({ onCreated }: { onCreated: (collection: Collection) => void }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="GoodInternetLink GoodInternetLinkArrow GoodInternetText1 GoodInternetButtonReset GoodInternetButtonText1">
        New collection
        <PlusIcon />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="GoodInternetDialogBackdrop" />
        <Dialog.Viewport className="GoodInternetDialogViewport">
          <Dialog.Popup className="GoodInternetDialogPopup">
            <Dialog.Title className="GoodInternetText2">New collection</Dialog.Title>
            <Dialog.Description className="GoodInternetText1 GoodInternetMuted">
              A collection groups references. You can publish it as a board later.
            </Dialog.Description>
            <Form
              className="GoodInternetForm"
              onFormSubmit={async (values) => {
                setPending(true);
                let collection: Collection;
                try {
                  collection = await createCollection(String(values.name));
                } finally {
                  setPending(false);
                }
                onCreated(collection);
                setOpen(false);
              }}
            >
              <div className="GoodInternetList">
                <Field.Root name="name" className="GoodInternetListItem GoodInternetField GoodInternetFieldStacked">
                  <Field.Label className="GoodInternetText1 GoodInternetMuted">Name</Field.Label>
                  <div className="GoodInternetFieldBody">
                    <Field.Control
                      required
                      maxLength={80}
                      autoComplete="off"
                      className="GoodInternetText2 GoodInternetInput"
                    />
                    <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="valueMissing">
                      Give it a name.
                    </Field.Error>
                  </div>
                </Field.Root>
              </div>
              <div className="GoodInternetDialogActions">
                <Dialog.Close className="GoodInternetLink GoodInternetText2 GoodInternetButtonReset">Cancel</Dialog.Close>
                <Button
                  type="submit"
                  disabled={pending}
                  focusableWhenDisabled
                  className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2 GoodInternetButtonReset"
                >
                  {pending ? 'Creating…' : 'Create'}
                  <ArrowIcon />
                </Button>
              </div>
            </Form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// The first four images; light gray squares stand in when there are none.
function Mosaic({ count, covers }: { count: number; covers: string[] }) {
  return (
    <span className="GoodInternetMosaic" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="GoodInternetMosaicCell" data-empty={i >= count || undefined}>
          <ImageFill src={covers[i]} />
        </span>
      ))}
    </span>
  );
}

// base-ui.com homepage PlusIcon
function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </svg>
  );
}
