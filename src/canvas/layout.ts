// The canvas remembers its camera and where items were moved, in this browser. Never content:
// membership, names, and sizes always come from registry.ts. The theme is theme.ts's own setting.

export interface Camera {
  x: number;
  y: number;
  z: number;
}
export type Positions = Record<string, { x: number; y: number }>;

const KEY = 'goodinternet.canvas.landing';
const VERSION = 1;
export const MIN_Z = 0.05;
export const MAX_Z = 4;
const LIMIT = 1_000_000;

const coord = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= LIMIT;
export const clampZ = (z: number) => Math.min(MAX_Z, Math.max(MIN_Z, z));
export const clampCoord = (n: number) => Math.min(LIMIT, Math.max(-LIMIT, n));

export function loadLayout(ids: Set<string>): { camera: Camera | null; positions: Positions } {
  const positions: Positions = {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw || raw.length > 200_000) return { camera: null, positions };
    const doc = JSON.parse(raw) as { v?: unknown; camera?: Partial<Camera>; positions?: Record<string, { x?: unknown; y?: unknown }> };
    // Unknown versions start fresh rather than guessing at their shape.
    if (doc?.v !== VERSION) return { camera: null, positions };
    const c = doc.camera;
    const camera = c && coord(c.x) && coord(c.y) && coord(c.z) && c.z >= MIN_Z && c.z <= MAX_Z ? { x: c.x, y: c.y, z: c.z } : null;
    if (doc.positions && typeof doc.positions === 'object') {
      for (const [id, p] of Object.entries(doc.positions).slice(0, 1000)) {
        // Stale ids (items since removed from the registry) are dropped.
        if (ids.has(id) && p && coord(p.x) && coord(p.y)) positions[id] = { x: p.x, y: p.y };
      }
    }
    return { camera, positions };
  } catch {
    return { camera: null, positions };
  }
}

export function saveLayout(camera: Camera, positions: Positions) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, camera, positions }));
  } catch {
    // Storage full or blocked: the layout just isn't remembered.
  }
}
