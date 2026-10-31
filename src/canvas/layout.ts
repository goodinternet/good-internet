// The canvas remembers the open page, each page's camera, and where items were moved, in this
// browser. Never content: membership, names, and sizes always come from registry.ts. The theme is
// theme.ts's own setting.

export interface Camera {
  x: number;
  y: number;
  z: number;
}
export type Positions = Record<string, { x: number; y: number }>;
export interface Layout {
  page: string | null;
  cameras: Record<string, Camera>;
  positions: Positions;
}

const KEY = 'goodinternet.canvas.landing';
const VERSION = 2; // 1 had one `camera`, which belongs to the first page
export const MIN_Z = 0.05;
export const MAX_Z = 4;
const LIMIT = 1_000_000;

const coord = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= LIMIT;
export const clampZ = (z: number) => Math.min(MAX_Z, Math.max(MIN_Z, z));
export const clampCoord = (n: number) => Math.min(LIMIT, Math.max(-LIMIT, n));

export function loadLayout(ids: Set<string>, pageIds: string[]): Layout {
  const positions: Positions = {};
  const cameras: Layout['cameras'] = {};
  let page: string | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw || raw.length > 200_000) return { page, cameras, positions };
    const doc = JSON.parse(raw) as {
      v?: unknown;
      page?: unknown;
      camera?: Partial<Camera>;
      cameras?: Record<string, Partial<Camera>>;
      positions?: Record<string, { x?: unknown; y?: unknown }>;
    };
    // Unknown versions start fresh rather than guessing at their shape.
    if (doc?.v !== 1 && doc?.v !== VERSION) return { page, cameras, positions };
    const stored = doc.v === 1 ? { [pageIds[0]]: doc.camera } : doc.cameras;
    for (const id of pageIds) {
      const c = stored?.[id];
      if (c && coord(c.x) && coord(c.y) && coord(c.z) && c.z >= MIN_Z && c.z <= MAX_Z) cameras[id] = { x: c.x, y: c.y, z: c.z };
    }
    if (typeof doc.page === 'string' && pageIds.includes(doc.page)) page = doc.page;
    if (doc.positions && typeof doc.positions === 'object') {
      for (const [id, p] of Object.entries(doc.positions).slice(0, 1000)) {
        // Stale ids (items since removed from the registry) are dropped.
        if (ids.has(id) && p && coord(p.x) && coord(p.y)) positions[id] = { x: p.x, y: p.y };
      }
    }
    return { page, cameras, positions };
  } catch {
    return { page, cameras, positions };
  }
}

export function saveLayout({ page, cameras, positions }: Layout) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, page, cameras, positions }));
  } catch {
    // Storage full or blocked: the layout just isn't remembered.
  }
}
