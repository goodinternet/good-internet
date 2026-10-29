// /canvas (dev only): the landing reference canvas. This file is the camera, gestures, labels, and
// saved layout; what's on the canvas is registry.ts. Each preview is an iframe of canvas-frame.html.
import * as React from 'react';
import { getTheme, setTheme, type Theme } from '../good-internet/theme.ts';

const DARK_QUERY = '(prefers-color-scheme: dark)';
const systemDark = () => matchMedia(DARK_QUERY).matches;
const onSystemTheme = (listener: () => void) => {
  const query = matchMedia(DARK_QUERY);
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
};
import { clampCoord, clampZ, loadLayout, saveLayout, type Camera, type Positions } from './layout.ts';
import { items, type CanvasItem } from './registry.ts';
import './canvas.css';

const HEAD = 30; // label row above each preview, in screen pixels at any zoom
const PAD = 64; // room around the content for fit-all and reset
const ZOOM_STEP = 1.25;
const SAVE_DELAY = 400;
const INTERACTIVE = 'a[href], button, input, textarea, select, summary, iframe, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="checkbox"], [role="switch"], [role="tab"], [role="menuitem"], [role="slider"], [role="textbox"]';

type Pt = { x: number; y: number };
type Gesture =
  | { kind: 'pan'; pointerId: number; last: Pt; moved: boolean; fromFrame: boolean }
  | { kind: 'move'; pointerId: number; id: string; start: Pt; origin: Pt; el: HTMLElement }
  | { kind: 'touch'; points: Map<number, Pt>; mid: Pt; dist: number };

const frameSrc = (id: string) => `/canvas-frame.html?id=${encodeURIComponent(id)}`;

/** Wheel deltas in pixels, with Shift + mouse wheel scrolling sideways. */
function wheelDelta(e: WheelEvent): Pt {
  const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
  const x = e.deltaX * k, y = e.deltaY * k;
  return e.shiftKey && !x ? { x: y, y: 0 } : { x, y };
}

/** Whether anything under `target` in a preview can still scroll in the wheel's main direction. */
function canScroll(target: EventTarget | null, d: Pt, win: Window) {
  const doc = win.document;
  const vertical = Math.abs(d.y) >= Math.abs(d.x);
  const delta = vertical ? d.y : d.x;
  if (!delta) return false;
  // The target belongs to the frame's document, so it isn't an instance of this page's Element.
  const start = target && (target as Node).nodeType === 1 ? (target as Element) : null;
  for (let el = start; el; el = el.parentElement) {
    const root = el === doc.scrollingElement;
    const overflow = win.getComputedStyle(el)[vertical ? 'overflowY' : 'overflowX'];
    if (!(root ? overflow !== 'hidden' : /auto|scroll|overlay/.test(overflow))) continue;
    const pos = vertical ? el.scrollTop : el.scrollLeft;
    const max = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
    if (max > 1 && (delta > 0 ? pos < max - 1 : pos > 0)) return true;
  }
  return false;
}

/** Space pans unless a control or text field has focus, where Space is the user's to type or press. */
function spaceIsForControl(doc: Document, shell: HTMLElement | null): boolean {
  const el = doc.activeElement;
  if (!el || el === doc.body || el === doc.documentElement || el === shell) return false;
  if (el instanceof HTMLIFrameElement) return el.contentDocument ? spaceIsForControl(el.contentDocument, shell) : true;
  return el.matches(INTERACTIVE) || (el as HTMLElement).isContentEditable;
}

function bounds(positions: Positions) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const it of items) {
    const p = positions[it.id];
    x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x + it.width); y1 = Math.max(y1, p.y + it.height);
  }
  return { x0, y0, x1, y1 };
}

function NameLabel({ name }: { name: string }) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const fallback = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    if (state === 'copied') {
      const t = setTimeout(() => setState('idle'), 1400);
      return () => clearTimeout(t);
    }
    // No clipboard: select the name so it can be copied by hand.
    if (state === 'failed' && fallback.current) getSelection()?.selectAllChildren(fallback.current);
  }, [state]);
  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('No clipboard');
      await navigator.clipboard.writeText(name);
      setState('copied');
    } catch {
      setState('failed');
    }
  };
  return (
    <>
      <button type="button" className="cv-name" aria-describedby="cv-copy-help" onClick={copy} onBlur={() => state === 'failed' && setState('idle')}>
        {name}
      </button>
      <span className="cv-hint" aria-hidden="true">Copy name</span>
      <span className="cv-status" role="status">{state === 'copied' ? 'Copied' : ''}</span>
      {state === 'failed' && <span ref={fallback} className="cv-fallback">{name}</span>}
    </>
  );
}

interface ItemApi {
  startMove: (e: React.PointerEvent<HTMLButtonElement>, id: string) => void;
  nudge: (id: string, dx: number, dy: number) => void;
  wire: (frame: HTMLIFrameElement) => void;
}

const Item = React.memo(function Item({ item, x, y, api }: { item: CanvasItem; x: number; y: number; api: ItemApi }) {
  return (
    <div className="cv-item" data-id={item.id} style={{ transform: `translate(${x}px, ${y}px)`, width: item.width, height: item.height }}>
      <div className="cv-head" style={{ maxWidth: `calc(${item.width}px * var(--z))` }}>
        <button
          type="button"
          className="cv-handle"
          aria-label={`Move ${item.name}`}
          aria-describedby="cv-move-help"
          onPointerDown={(e) => api.startMove(e, item.id)}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 64 : 8;
            const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
            if (!d) return;
            e.preventDefault();
            api.nudge(item.id, d[0], d[1]);
          }}
        >
          <svg viewBox="0 0 10 16" aria-hidden="true">
            {[3, 8, 13].flatMap((cy) => [<circle key={`a${cy}`} cx="3" cy={cy} r="1.3" />, <circle key={`b${cy}`} cx="7" cy={cy} r="1.3" />])}
          </svg>
        </button>
        <NameLabel name={item.name} />
      </div>
      <iframe className="cv-frame" src={frameSrc(item.id)} title={item.name} width={item.width} height={item.height} onLoad={(e) => api.wire(e.currentTarget)} />
    </div>
  );
});

export default function CanvasRoute() {
  const saved = React.useMemo(() => loadLayout(new Set(items.map((i) => i.id))), []);
  const [positions, setPositions] = React.useState<Positions>(() =>
    Object.fromEntries(items.map((i) => [i.id, saved.positions[i.id] ?? { x: i.x, y: i.y }])),
  );
  const [theme, setThemeChoice] = React.useState<Theme>(getTheme);
  // "System" follows the computer, so the toggle shows whichever mode is actually on.
  const prefersDark = React.useSyncExternalStore(onSystemTheme, systemDark);
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);

  const shell = React.useRef<HTMLDivElement>(null);
  const world = React.useRef<HTMLDivElement>(null);
  const shield = React.useRef<HTMLDivElement>(null);
  const zoomText = React.useRef<HTMLSpanElement>(null);
  // Live gesture values stay out of React state, so the camera never rerenders previews.
  const cam = React.useRef<Camera>(saved.camera ?? { x: PAD, y: PAD + HEAD, z: 1 });
  const pos = React.useRef(positions);
  const gesture = React.useRef<Gesture | null>(null);
  const space = React.useRef(false);
  const suppressClick = React.useRef(false);
  const frameReq = React.useRef(0);
  const saveTimer = React.useRef(0);
  const unwire = React.useRef(new Map<HTMLIFrameElement, () => void>());

  React.useEffect(() => {
    pos.current = positions;
  }, [positions]);

  const write = React.useCallback(() => {
    frameReq.current = 0;
    const { x, y, z } = cam.current;
    if (world.current) {
      world.current.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
      world.current.style.setProperty('--z', String(z));
    }
    if (zoomText.current) zoomText.current.textContent = `${Math.round(z * 100)}%`;
  }, []);

  const flush = React.useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = 0;
    saveLayout(cam.current, pos.current);
  }, []);
  const scheduleSave = React.useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(flush, SAVE_DELAY);
  }, [flush]);

  /** Every camera change goes through here: bounded, one transform write per frame, saved after a pause. */
  const setCam = React.useCallback((next: Camera) => {
    cam.current = { x: clampCoord(next.x), y: clampCoord(next.y), z: clampZ(next.z) };
    if (!frameReq.current) frameReq.current = requestAnimationFrame(write);
    scheduleSave();
  }, [write, scheduleSave]);

  const local = (clientX: number, clientY: number): Pt => {
    const r = shell.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };
  const panBy = (dx: number, dy: number) => setCam({ ...cam.current, x: cam.current.x + dx, y: cam.current.y + dy });
  const zoomAt = (factor: number, p: Pt) => {
    const { x, y, z } = cam.current;
    const nz = clampZ(z * factor);
    const k = nz / z;
    setCam({ x: p.x - (p.x - x) * k, y: p.y - (p.y - y) * k, z: nz });
  };
  const center = (): Pt => ({ x: shell.current!.clientWidth / 2, y: shell.current!.clientHeight / 2 });

  const fitAll = () => {
    const el = shell.current;
    if (!el || !items.length) return;
    const b = bounds(pos.current);
    const w = b.x1 - b.x0, h = b.y1 - b.y0;
    const z = clampZ(Math.min((el.clientWidth - PAD * 2) / w, (el.clientHeight - PAD * 2 - HEAD) / h, 1));
    setCam({
      z,
      x: (el.clientWidth - w * z) / 2 - b.x0 * z,
      y: (el.clientHeight - h * z + HEAD) / 2 - b.y0 * z,
    });
  };
  const resetCamera = () => {
    const b = items.length ? bounds(pos.current) : { x0: 0, y0: 0 };
    setCam({ z: 1, x: PAD - b.x0, y: PAD + HEAD - b.y0 });
  };

  const showShield = () => {
    if (shield.current) shield.current.dataset.on = String(space.current || gesture.current?.kind === 'pan' || gesture.current?.kind === 'touch');
  };
  const armSpace = (on: boolean) => {
    space.current = on;
    showShield();
  };

  const startPan = (pointerId: number, at: Pt, fromFrame: boolean) => {
    gesture.current = { kind: 'pan', pointerId, last: at, moved: false, fromFrame };
    showShield();
  };
  const panTo = (at: Pt) => {
    const g = gesture.current;
    if (g?.kind !== 'pan') return;
    const dx = at.x - g.last.x, dy = at.y - g.last.y;
    if (dx || dy) {
      g.moved = true;
      g.last = at;
      panBy(dx, dy);
    }
  };
  const endGesture = () => {
    const g = gesture.current;
    if (g?.kind === 'pan' && g.moved) {
      // The click that ends a pan must not press a control or copy a label.
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
    if (g?.kind === 'move') {
      const p = pos.current[g.id];
      setPositions((prev) => ({ ...prev, [g.id]: p }));
      scheduleSave();
    }
    gesture.current = null;
    showShield();
  };

  // Item moves and frame wiring, kept stable so Item's memo holds and previews never rerender.
  const [api] = React.useState<ItemApi>(() => ({
    startMove: (e, id) => {
      if (e.button !== 0 || space.current || gesture.current) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      const el = e.currentTarget.closest<HTMLElement>('.cv-item')!;
      gesture.current = { kind: 'move', pointerId: e.pointerId, id, start: { x: e.clientX, y: e.clientY }, origin: pos.current[id], el };
    },
    nudge: (id, dx, dy) => {
      const p = pos.current[id];
      const next = { x: clampCoord(p.x + dx), y: clampCoord(p.y + dy) };
      pos.current = { ...pos.current, [id]: next };
      setPositions(pos.current);
      scheduleSave();
    },
    wire: (frame) => {
      unwire.current.get(frame)?.();
      const win = frame.contentWindow;
      if (!win) return;
      // Frame coordinates to the canvas page's, through the camera's scale.
      const toPage = (cx: number, cy: number): Pt => {
        const r = frame.getBoundingClientRect();
        const s = r.width / frame.offsetWidth;
        return { x: r.left + cx * s, y: r.top + cy * s };
      };
      const wheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const p = toPage(e.clientX, e.clientY);
          zoomAt(Math.exp(-Math.max(-50, Math.min(50, wheelDelta(e).y)) * 0.01), local(p.x, p.y));
          return;
        }
        const d = wheelDelta(e);
        if (canScroll(e.target, d, win)) return; // the preview scrolls itself
        e.preventDefault();
        panBy(-d.x, -d.y);
      };
      const keydown = (e: KeyboardEvent) => {
        if (e.code !== 'Space' || spaceIsForControl(win.document, null)) return;
        e.preventDefault();
        if (!e.repeat) armSpace(true);
      };
      const keyup = (e: KeyboardEvent) => e.code === 'Space' && armSpace(false);
      // A middle-button drag that starts over a preview pans the canvas (and never autoscrolls).
      const mousedown = (e: MouseEvent) => {
        if (e.button !== 1) return;
        e.preventDefault();
        startPan(-1, { x: e.screenX, y: e.screenY }, true);
      };
      const mousemove = (e: MouseEvent) => {
        const g = gesture.current;
        if (g?.kind === 'pan' && g.fromFrame) panTo({ x: e.screenX, y: e.screenY });
      };
      const mouseup = () => {
        const g = gesture.current;
        if (g?.kind === 'pan' && g.fromFrame) endGesture();
      };
      const auxclick = (e: MouseEvent) => e.button === 1 && e.preventDefault();
      win.addEventListener('wheel', wheel, { passive: false });
      win.addEventListener('keydown', keydown);
      win.addEventListener('keyup', keyup);
      win.addEventListener('mousedown', mousedown);
      win.addEventListener('mousemove', mousemove);
      win.addEventListener('mouseup', mouseup);
      win.addEventListener('auxclick', auxclick);
      unwire.current.set(frame, () => {
        win.removeEventListener('wheel', wheel);
        win.removeEventListener('keydown', keydown);
        win.removeEventListener('keyup', keyup);
        win.removeEventListener('mousedown', mousedown);
        win.removeEventListener('mousemove', mousemove);
        win.removeEventListener('mouseup', mouseup);
        win.removeEventListener('auxclick', auxclick);
      });
    },
  }));

  // Pointer gestures on the canvas page: pan from empty space, Space or middle button anywhere,
  // move items by their handles, and two-finger touch pan and pinch.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = e.target as Element;
    const empty = t === shell.current || t === world.current || t === shield.current;
    if (e.pointerType === 'touch') {
      if (!empty) return;
      const g = gesture.current;
      const points = g?.kind === 'touch' ? g.points : new Map<number, Pt>();
      if (g && g.kind !== 'touch') return;
      points.set(e.pointerId, { x: e.clientX, y: e.clientY });
      e.currentTarget.setPointerCapture(e.pointerId);
      const [a, b = a] = [...points.values()];
      gesture.current = { kind: 'touch', points, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, dist: Math.hypot(a.x - b.x, a.y - b.y) };
      showShield();
      return;
    }
    // A gesture whose end the browser never reported (a release outside the window) is stale.
    const g = gesture.current;
    if (g && g.kind !== 'touch' && g.pointerId !== e.pointerId) endGesture();
    if (gesture.current) return;
    if (e.button === 1 || (e.button === 0 && (space.current || empty))) {
      e.preventDefault();
      // preventDefault stops the click from focusing the canvas, so focus it here for keyboard camera controls.
      if (empty) shell.current?.focus({ preventScroll: true });
      e.currentTarget.setPointerCapture(e.pointerId);
      startPan(e.pointerId, { x: e.clientX, y: e.clientY }, false);
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'pan' && g.pointerId === e.pointerId) panTo({ x: e.clientX, y: e.clientY });
    else if (g.kind === 'move' && g.pointerId === e.pointerId) {
      const z = cam.current.z;
      const p = { x: clampCoord(g.origin.x + (e.clientX - g.start.x) / z), y: clampCoord(g.origin.y + (e.clientY - g.start.y) / z) };
      pos.current = { ...pos.current, [g.id]: p };
      g.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    } else if (g.kind === 'touch' && g.points.has(e.pointerId)) {
      g.points.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b = a] = [...g.points.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      panBy(mid.x - g.mid.x, mid.y - g.mid.y);
      if (g.points.size > 1 && g.dist > 0 && dist > 0) zoomAt(dist / g.dist, local(mid.x, mid.y));
      g.mid = mid;
      g.dist = dist;
    }
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (g?.kind === 'touch') {
      g.points.delete(e.pointerId);
      if (!g.points.size) return endGesture();
      const [a] = [...g.points.values()];
      g.mid = a;
      g.dist = 0;
      return;
    }
    if (g && 'pointerId' in g && g.pointerId === e.pointerId) endGesture();
  };

  const onShellKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== shell.current) return;
    const step = e.shiftKey ? 320 : 80;
    const pan = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
    if (pan) panBy(pan[0], pan[1]);
    else if (e.key === '+' || e.key === '=') zoomAt(ZOOM_STEP, center());
    else if (e.key === '-' || e.key === '_') zoomAt(1 / ZOOM_STEP, center());
    else if (e.key === '0') resetCamera();
    else if (e.key === '!' || (e.shiftKey && e.code === 'Digit1')) fitAll();
    else return;
    e.preventDefault();
  };

  // Paint the saved camera before the first frame, or fit everything on a first visit.
  React.useLayoutEffect(() => {
    if (saved.camera) write();
    else fitAll();
    // Mount only: later camera changes go through setCam.
  }, []);

  React.useEffect(() => {
    const el = shell.current!;
    const html = document.documentElement, body = document.body;
    const prev = [html.style.overscrollBehaviorX, body.style.overscrollBehaviorX, body.style.overflow];
    // No sideways overscroll (Chrome's back/forward swipe) and no page scroll while the canvas is up.
    html.style.overscrollBehaviorX = 'none';
    body.style.overscrollBehaviorX = 'none';
    body.style.overflow = 'hidden';

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = wheelDelta(e);
      if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-Math.max(-50, Math.min(50, d.y)) * 0.01), local(e.clientX, e.clientY));
      else panBy(-d.x, -d.y);
    };
    // Safari's trackpad pinch arrives as gesture events, not ctrl + wheel.
    let lastScale = 1;
    const gestureStart = (e: Event) => { e.preventDefault(); lastScale = 1; };
    const gestureChange = (e: Event) => {
      e.preventDefault();
      const g = e as Event & { scale: number; clientX: number; clientY: number };
      zoomAt(g.scale / lastScale, local(g.clientX, g.clientY));
      lastScale = g.scale;
    };
    const keydown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || spaceIsForControl(document, el)) return;
      e.preventDefault();
      if (!e.repeat) armSpace(true);
    };
    const keyup = (e: KeyboardEvent) => e.code === 'Space' && armSpace(false);
    const reset = () => {
      armSpace(false);
      if (gesture.current?.kind === 'move') endGesture();
      else gesture.current = null;
      showShield();
    };
    const blur = () => { if (!(document.activeElement instanceof HTMLIFrameElement)) reset(); };
    const hidden = () => { if (document.hidden) { reset(); flush(); } };
    const click = (e: MouseEvent) => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); } };
    const middle = (e: MouseEvent) => e.button === 1 && e.preventDefault(); // no autoscroll
    // Keyboard focus that lands offscreen is brought into view by the camera, never by scrolling.
    const focusin = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (!world.current?.contains(t)) return;
      const r = t.getBoundingClientRect(), s = el.getBoundingClientRect();
      const dx = r.left < s.left + 16 ? s.left + 16 - r.left : r.right > s.right - 16 ? s.right - 16 - r.right : 0;
      const dy = r.top < s.top + 16 ? s.top + 16 - r.top : r.bottom > s.bottom - 16 ? s.bottom - 16 - r.bottom : 0;
      if (dx || dy) panBy(dx, dy);
    };
    const noScroll = () => { el.scrollLeft = 0; el.scrollTop = 0; };

    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('gesturestart', gestureStart);
    el.addEventListener('gesturechange', gestureChange);
    el.addEventListener('click', click, true);
    el.addEventListener('mousedown', middle);
    el.addEventListener('auxclick', middle);
    el.addEventListener('focusin', focusin);
    el.addEventListener('scroll', noScroll);
    addEventListener('keydown', keydown);
    addEventListener('keyup', keyup);
    addEventListener('blur', blur);
    addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', hidden);
    const frames = unwire.current;
    return () => {
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('gesturestart', gestureStart);
      el.removeEventListener('gesturechange', gestureChange);
      el.removeEventListener('click', click, true);
      el.removeEventListener('mousedown', middle);
      el.removeEventListener('auxclick', middle);
      el.removeEventListener('focusin', focusin);
      el.removeEventListener('scroll', noScroll);
      removeEventListener('keydown', keydown);
      removeEventListener('keyup', keyup);
      removeEventListener('blur', blur);
      removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', hidden);
      frames.forEach((off) => off());
      frames.clear();
      cancelAnimationFrame(frameReq.current);
      if (saveTimer.current) flush();
      [html.style.overscrollBehaviorX, body.style.overscrollBehaviorX, body.style.overflow] = prev;
    };
    // Listeners read refs, so they're wired once.
  }, []);

  React.useEffect(() => {
    const previous = document.title;
    document.title = 'Canvas · GOOD INTERNET';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div
      ref={shell}
      className="cv"
      tabIndex={0}
      aria-label="Landing reference canvas"
      aria-describedby="cv-help"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      onKeyDown={onShellKeyDown}
    >
      <div ref={world} className="cv-world">
        {items.map((item) => (
          <Item key={item.id} item={item} x={positions[item.id].x} y={positions[item.id].y} api={api} />
        ))}
      </div>
      {/* Covers the previews while panning, so their frames can't take the pointer mid-gesture. */}
      <div ref={shield} className="cv-shield" data-on="false" />

      <div className="cv-controls" role="toolbar" aria-label="Canvas view">
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(1 / ZOOM_STEP, center())}>−</button>
        <span ref={zoomText} className="cv-zoom" aria-label="Zoom level">100%</span>
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(ZOOM_STEP, center())}>+</button>
        <button type="button" onClick={fitAll}>Fit all</button>
        <button type="button" onClick={resetCamera}>Reset view</button>
        <button
          type="button"
          className="cv-theme"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
          onClick={() => {
            const next = dark ? 'light' : 'dark';
            setTheme(next);
            setThemeChoice(next);
          }}
        >
          <svg data-on={!dark} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.96 12.77A9 9 0 1 1 11.23 3.03a7 7 0 0 0 9.73 9.74Z" />
          </svg>
          <svg data-on={dark} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </button>
      </div>

      <p id="cv-help" className="cv-sr">
        Drag empty space, or hold Space or the middle button and drag anywhere, to pan. Scroll to pan; Control or
        Command and scroll, or pinch, to zoom. With the canvas focused: arrow keys pan, plus and minus zoom, 0 resets
        the view, Shift and 1 fits everything.
      </p>
      <p id="cv-copy-help" className="cv-sr">Copies this name.</p>
      <p id="cv-move-help" className="cv-sr">Drag to move. Or use the arrow keys; hold Shift for bigger steps.</p>
    </div>
  );
}
