// Everything on the landing canvas. Add, rename, or remove items here, or add a folder under
// references/; the camera and gesture code in CanvasRoute.tsx never needs to change.
import type { ComponentType } from 'react';

export interface CanvasItem {
  /** Stable, lowercase-and-dashes. Saved positions are keyed by it, so don't reuse one. */
  id: string;
  /** The label above the preview, copied when clicked. Unique and readable: "Linear landing · desktop". */
  name: string;
  /** The preview's viewport in CSS pixels. Its frame gets exactly this size, so media queries match. */
  width: number;
  height: number;
  /** Where it starts on the canvas, before anyone moves it. */
  x: number;
  y: number;
  /** The component, loaded only inside its own frame (canvas-frame.html), with its own CSS. */
  load: () => Promise<{ default: ComponentType }>;
}

export type ReferenceMeta = Omit<CanvasItem, 'load' | 'x' | 'y'> & { x?: number; y?: number };

const GAP = 160;
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const landing = () => import('./previews/GoodInternetLanding.tsx');

const builtIn: CanvasItem[] = [
  { id: 'gi-landing-desktop', name: 'Good Internet landing · desktop', width: 1440, height: 900, x: 0, y: 0, load: landing },
  { id: 'gi-landing-mobile', name: 'Good Internet landing · mobile', width: 390, height: 844, x: 1440 + GAP, y: 0, load: landing },
];

// Reference recreations live in references/<folder>/, which is git-ignored so other sites' designs
// stay off this public repo. Each folder has meta.ts (`export const meta: ReferenceMeta`) and
// index.tsx (default-exports the page and imports its own CSS).
const metas = import.meta.glob<ReferenceMeta>('./references/*/meta.ts', { eager: true, import: 'meta' });
const loaders = import.meta.glob<{ default: ComponentType }>('./references/*/index.tsx');

function references(): CanvasItem[] {
  // Without a position of their own, references line up in a row below the built-in items.
  let x = 0;
  const y = Math.max(...builtIn.map((i) => i.y + i.height)) + GAP * 2;
  return Object.keys(metas)
    .sort()
    .flatMap((path) => {
      const load = loaders[path.replace(/meta\.ts$/, 'index.tsx')];
      if (!load) return [];
      const meta = metas[path];
      const item = { ...meta, x: meta.x ?? x, y: meta.y ?? y, load };
      if (meta.x === undefined) x += meta.width + GAP;
      return [item];
    });
}

function valid(list: CanvasItem[]) {
  const seen = new Set<string>();
  return list.filter((item) => {
    const ok = ID.test(item.id) && !seen.has(item.id) && item.width > 0 && item.height > 0;
    if (!ok) console.warn(`Canvas: skipped "${item.id}" (bad or duplicate id, or no size)`);
    seen.add(item.id);
    return ok;
  });
}

export const items = valid([...builtIn, ...references()]);
