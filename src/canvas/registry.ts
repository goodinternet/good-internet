// Everything on the landing canvas. Add, rename, or remove pages and items here, or add a folder
// under references/; the camera and gesture code in CanvasRoute.tsx never needs to change.
import type { ComponentType } from 'react';

export interface CanvasPage {
  /** Stable, lowercase-and-dashes. Saved cameras are keyed by it, so don't reuse one. */
  id: string;
  /** The label in the toolbar. */
  name: string;
}

/** The canvas's pages, in toolbar order. Each one is its own empty world with its own camera. */
export const pages: CanvasPage[] = [
  { id: 'page-1', name: 'Page 1' },
  { id: 'page-2', name: 'Page 2' },
];

export interface CanvasItem {
  /** Stable, lowercase-and-dashes. Saved positions are keyed by it, so don't reuse one. */
  id: string;
  /** The label above the preview, copied when clicked. Unique and readable: "Linear landing · desktop". */
  name: string;
  /** The preview's viewport in CSS pixels. Its frame gets exactly this size, so media queries match. */
  width: number;
  height: number;
  /** Where it starts on its page, before anyone moves it. */
  x: number;
  y: number;
  /** The id of the page it's on. Leave it out for the first page. */
  page?: string;
  /** The component, loaded only inside its own frame (canvas-frame.html), with its own CSS. */
  load: () => Promise<{ default: ComponentType }>;
}

export type ReferenceMeta = Omit<CanvasItem, 'load' | 'x' | 'y'> & { x?: number; y?: number };

const GAP = 160;
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const landing = () => import('./previews/GoodInternetLanding.tsx');
const site = () => import('./previews/GoodInternetSite.tsx');
const navWorking = () => import('./previews/nav/index.tsx');

const builtIn: CanvasItem[] = [
  { id: 'gi-landing-desktop', name: 'Good Internet landing · desktop', width: 1440, height: 900, x: 0, y: 0, load: landing },
  { id: 'gi-landing-mobile', name: 'Good Internet landing · mobile', width: 390, height: 844, x: 1440 + GAP, y: 0, load: landing },
  { id: 'gi-site-desktop', name: 'Good Internet site · desktop', width: 1440, height: 7285, x: 1440 + GAP + 390 + GAP, y: 0, load: site },
  { id: 'gi-site-mobile', name: 'Good Internet site · mobile', width: 390, height: 10889, x: 1440 + GAP + 390 + GAP + 1440 + GAP, y: 0, load: site },
  { id: 'nav-working-desktop', name: 'Nav · Working · Desktop', width: 1440, height: 900, x: 6548, y: 0, load: navWorking },
  { id: 'nav-working-mobile', name: 'Nav · Working · Mobile', width: 390, height: 844, x: 6548 + 1440 + GAP, y: 0, load: navWorking },
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
    const onPage = !item.page || pages.some((page) => page.id === item.page);
    const ok = ID.test(item.id) && !seen.has(item.id) && item.width > 0 && item.height > 0 && onPage;
    if (!ok) console.warn(`Canvas: skipped "${item.id}" (bad or duplicate id, no size, or no such page)`);
    seen.add(item.id);
    return ok;
  });
}

export const items = valid([...builtIn, ...references()]).map((item) => ({ ...item, page: item.page ?? pages[0].id }));
