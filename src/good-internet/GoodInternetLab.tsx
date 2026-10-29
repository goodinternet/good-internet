import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import { Select } from '@base-ui/react/select';
import {
  deleteLabItem,
  listLabItems,
  promoteLabItem,
  saveLabItem,
  type LabCategory,
  type LabItem,
} from './labRepository.ts';
import { ArrowIcon, Separator } from './parts.tsx';
import { formatDate } from './utils.ts';

const SECTIONS: { value: LabCategory; label: string; description: string }[] = [
  { value: 'reference', label: 'References', description: 'Things worth studying.' },
  { value: 'experiment', label: 'Experiments', description: 'Small things to prototype or test.' },
  { value: 'concept', label: 'Concepts', description: 'Ideas to think through before they become commitments.' },
  { value: 'ios', label: 'iOS / Native', description: 'Native capture, library, and interaction ideas.' },
  { value: 'map', label: 'Reference Map', description: 'How Good Internet’s product, data, and infrastructure fit together.' },
  { value: 'build', label: 'Current Build', description: 'The preserved NOW, NEXT, and LATER working plan.' },
];

export function GoodInternetLab() {
  const [items, setItems] = React.useState(listLabItems);
  const [category, setCategory] = React.useState<LabCategory>('reference');
  const visible = items.filter((item) => item.category === category);
  const section = SECTIONS.find((candidate) => candidate.value === category)!;

  const refresh = () => setItems([...listLabItems()]);

  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">Lab</h1>
      </section>

      <section className="GoodInternetContents">
        <p className="GoodInternetText2 GoodInternetCol-body">
          Unfinished ideas, references, and experiments live here while they are being investigated.
          Nothing in Lab is a roadmap commitment.
        </p>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-lab-browse">
        <div className="GoodInternetStack GoodInternetStack-0 GoodInternetCol-label">
          <h2 id="gi-lab-browse" className="GoodInternetText2">Browse</h2>
          <span className="GoodInternetText1 GoodInternetMuted">{items.length} saved</span>
        </div>
        <div className="GoodInternetCol-body GoodInternetStack GoodInternetStack-4 GoodInternetStretch">
          <nav className="GoodInternetLabNav" aria-label="Lab sections">
            {SECTIONS.map((candidate) => (
              <Button
                key={candidate.value}
                className="GoodInternetSegmentedItem"
                data-pressed={candidate.value === category || undefined}
                aria-pressed={candidate.value === category}
                onClick={() => setCategory(candidate.value)}
              >
                {candidate.label}
              </Button>
            ))}
          </nav>
          <LabItemDialog
            category={category}
            onSaved={(item) => {
              refresh();
              setCategory(item.category);
            }}
          />
        </div>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-lab-section">
        <div className="GoodInternetStack GoodInternetStack-0 GoodInternetCol-label">
          <h2 id="gi-lab-section" className="GoodInternetText2">{section.label.toUpperCase()}</h2>
          <span className="GoodInternetText1 GoodInternetMuted">{section.description}</span>
        </div>
        <div className="GoodInternetCol-body">
          {visible.length > 0 ? (
            <ul className="GoodInternetList">
              {visible.map((item) => (
                <LabItemRow
                  key={item.id}
                  item={item}
                  onChanged={refresh}
                />
              ))}
            </ul>
          ) : (
            <p className="GoodInternetText1 GoodInternetMuted">Nothing saved here yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

function LabItemRow({ item, onChanged }: { item: LabItem; onChanged: () => void }) {
  return (
    <li className="GoodInternetListItem GoodInternetLabRow">
      <div className="GoodInternetStack GoodInternetStack-0 GoodInternetLabMain">
        {item.url ? (
          <a className="GoodInternetLink GoodInternetText2 GoodInternetLabTitle" href={item.url} target="_blank" rel="noreferrer">
            {item.title}
          </a>
        ) : (
          <span className="GoodInternetText2 GoodInternetLabTitle">{item.title}</span>
        )}
        {item.note && <span className="GoodInternetText1 GoodInternetMuted">{item.note}</span>}
        {item.tags && item.tags.length > 0 && (
          <span className="GoodInternetText1 GoodInternetMuted">{item.tags.join(' · ')}</span>
        )}
      </div>
      <div className="GoodInternetStack GoodInternetStack-0 GoodInternetLabMeta">
        <span className="GoodInternetText1 GoodInternetMuted">
          {[item.source, item.status, formatDate(item.createdAt)].filter(Boolean).join(' · ')}
        </span>
        <span className="GoodInternetLabActions">
          <LabItemDialog item={item} category={item.category} onSaved={onChanged} />
          {item.status !== 'promoted' && (
            <Button
              className="GoodInternetLink GoodInternetText1 GoodInternetButtonReset GoodInternetButtonText1 GoodInternetMuted"
              onClick={() => {
                promoteLabItem(item.id);
                onChanged();
              }}
            >
              Promote to roadmap
            </Button>
          )}
          <Button
            className="GoodInternetLink GoodInternetText1 GoodInternetButtonReset GoodInternetButtonText1 GoodInternetMuted"
            onClick={() => {
              deleteLabItem(item.id);
              onChanged();
            }}
          >
            Delete
          </Button>
        </span>
      </div>
    </li>
  );
}

function LabItemDialog({
  item,
  category,
  onSaved,
}: {
  item?: LabItem;
  category: LabCategory;
  onSaved: (item: LabItem) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<LabCategory>(item?.category ?? category);

  React.useEffect(() => {
    if (!open) setSelectedCategory(item?.category ?? category);
  }, [category, item?.category, open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`GoodInternetLink GoodInternetButtonReset GoodInternetButtonText1${item ? ' GoodInternetText1 GoodInternetMuted' : ' GoodInternetText2 GoodInternetLinkArrow'}`}>
        {item ? 'Edit' : 'Add item'}
        {!item && <ArrowIcon />}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="GoodInternetDialogBackdrop" />
        <Dialog.Viewport className="GoodInternetDialogViewport">
          <Dialog.Popup className="GoodInternetDialogPopup GoodInternetLabDialog">
            <Dialog.Title className="GoodInternetText2">{item ? 'Edit Lab item' : 'Add to Lab'}</Dialog.Title>
            <Dialog.Description className="GoodInternetText1 GoodInternetMuted">
              Save something to investigate. It will stay separate from the roadmap.
            </Dialog.Description>
            <form
              className="GoodInternetForm"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const tags = String(data.get('tags') ?? '')
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean);
                const saved = saveLabItem({
                  id: item?.id,
                  title: String(data.get('title') ?? '').trim(),
                  url: String(data.get('url') ?? '').trim() || undefined,
                  note: String(data.get('note') ?? '').trim() || undefined,
                  category: selectedCategory,
                  tags: tags.length > 0 ? tags : undefined,
                  status: item?.status ?? 'saved',
                });
                onSaved(saved);
                setOpen(false);
              }}
            >
              <div className="GoodInternetList">
                <LabField label="Title">
                  <Input name="title" required maxLength={120} autoComplete="off" defaultValue={item?.title} className="GoodInternetText2 GoodInternetInput" />
                </LabField>
                <LabField label="URL">
                  <Input name="url" type="url" autoComplete="url" defaultValue={item?.url} placeholder="https://" className="GoodInternetText2 GoodInternetInput" />
                </LabField>
                <LabField label="Note">
                  <textarea name="note" maxLength={500} defaultValue={item?.note} className="GoodInternetText2 GoodInternetInput GoodInternetTextarea GoodInternetTextareaShort" />
                </LabField>
                <div className="GoodInternetListItem GoodInternetField GoodInternetFieldStacked">
                  <span className="GoodInternetText1 GoodInternetMuted">Category</span>
                  <Select.Root
                    items={SECTIONS.map(({ value, label }) => ({ value, label }))}
                    value={selectedCategory}
                    onValueChange={(value) => value && setSelectedCategory(value as LabCategory)}
                  >
                    <Select.Trigger className="GoodInternetText2 GoodInternetSelectTrigger">
                      <Select.Value />
                      <Select.Icon aria-hidden>↕</Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Positioner className="GoodInternetSelectPositioner" sideOffset={4} align="start">
                        <Select.Popup className="GoodInternetSelectPopup">
                          <Select.List>
                            {SECTIONS.map(({ value, label }) => (
                              <Select.Item key={value} value={value} className="GoodInternetText1 GoodInternetSelectItem">
                                <Select.ItemIndicator aria-hidden>✓</Select.ItemIndicator>
                                <Select.ItemText>{label}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.List>
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <LabField label="Tags">
                  <Input name="tags" autoComplete="off" defaultValue={item?.tags?.join(', ')} placeholder="Comma separated" className="GoodInternetText2 GoodInternetInput" />
                </LabField>
              </div>
              <div className="GoodInternetDialogActions">
                <Dialog.Close className="GoodInternetLink GoodInternetText2 GoodInternetButtonReset">Cancel</Dialog.Close>
                <Button type="submit" className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2 GoodInternetButtonReset">
                  {item ? 'Save changes' : 'Add item'}
                  <ArrowIcon />
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function LabField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Field.Root className="GoodInternetListItem GoodInternetField GoodInternetFieldStacked">
      <Field.Label className="GoodInternetText1 GoodInternetMuted">{label}</Field.Label>
      <div className="GoodInternetFieldBody">{children}</div>
    </Field.Root>
  );
}
