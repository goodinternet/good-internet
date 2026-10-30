import * as React from 'react';
import { LAND_H, LAND_HEX, LAND_W } from './globeLand.ts';

// A spinning globe drawn on a square grid: land cells become tiles (or characters), the sea stays
// empty, and a ring of cells traces the edge. Two looks, `ascii` (default) and `tiles`; try the other
// with ?globe=tiles. Grows out of one cell on load, then turns once every 14s.

type Look = 'tiles' | 'ascii';

const TURN_MS = 14_000;
const INTRO_MS = 1_400;
const TILT = (18 * Math.PI) / 180; // north pole leans toward the viewer
const ASCII_RAMP = ['.', ':', '+', '*', '#'];

const LAND = Uint8Array.from(LAND_HEX, (h) => parseInt(h, 16)).reduce<number[]>((bits, nibble) => {
  bits.push((nibble >> 3) & 1, (nibble >> 2) & 1, (nibble >> 1) & 1, nibble & 1);
  return bits;
}, []);

function isLand(lat: number, lon: number) {
  const col = Math.floor(((lon + Math.PI) / (2 * Math.PI)) * LAND_W) % LAND_W;
  const row = Math.min(LAND_H - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * LAND_H));
  return LAND[row * LAND_W + ((col + LAND_W) % LAND_W)] === 1;
}

// Stable 0–1 noise per map cell, so a tile keeps its shade as it travels across the face.
function hash(a: number, b: number) {
  let h = Math.imul(a * 374761393 + b * 668265263, 1274126177);
  h ^= h >>> 13;
  h = Math.imul(h, 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function Globe({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const look: Look =
      new URLSearchParams(window.location.search).get('globe') === 'tiles' ? 'tiles' : 'ascii';
    const cells = look === 'ascii' ? 43 : 31;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const style = getComputedStyle(canvas);
    const color = (name: string) => style.getPropertyValue(name).trim();

    let size = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      size = canvas.clientWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizer = new ResizeObserver(() => {
      resize();
      if (!running) draw(lastTime);
    });
    resizer.observe(canvas);

    const draw = (time: number) => {
      const grow = reduce.matches ? 1 : easeOut(Math.min(1, time / INTRO_MS));
      const spin = reduce.matches ? 0.6 : (time / TURN_MS) * Math.PI * 2;
      const cell = size / cells;
      const radius = Math.max(grow, 1 / cells); // never smaller than one cell
      const shades = [color('--globe-strong'), color('--globe-mid'), color('--globe-faint')];
      const mark = color('--globe-mark');

      ctx.clearRect(0, 0, size, size);
      if (look === 'ascii') {
        ctx.font = `500 ${cell * 1.05}px 'IBM Plex Mono', ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      }

      for (let j = 0; j < cells; j++) {
        for (let i = 0; i < cells; i++) {
          // Cell center in -1…1, then into the globe's own radius
          const x = (((i + 0.5) / cells) * 2 - 1) / radius;
          const y = (1 - ((j + 0.5) / cells) * 2) / radius;
          const d2 = x * x + y * y;
          if (d2 > 1) continue;
          const z = Math.sqrt(1 - d2);
          const edge = 1 - Math.sqrt(d2) < 2 / cells / radius; // within one cell of the outline

          // Undo the tilt, then read latitude and longitude off the sphere
          const ty = y * Math.cos(TILT) + z * Math.sin(TILT);
          const tz = -y * Math.sin(TILT) + z * Math.cos(TILT);
          const lat = Math.asin(Math.max(-1, Math.min(1, ty)));
          const lon = Math.atan2(x, tz) - Math.PI / 2 + spin;
          const wrapped = (((lon % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
          const land = isLand(lat, wrapped);
          const mapCol = Math.floor(((wrapped + Math.PI) / (2 * Math.PI)) * LAND_W * 2);
          const mapRow = Math.floor(((Math.PI / 2 - lat) / Math.PI) * LAND_H * 2);
          const noise = hash(mapCol, mapRow);

          // The rim: a mostly-solid ring of faint cells, with land on it drawn as land
          if (!land && !(edge && hash(i, j) > 0.25)) continue;

          const cx = i * cell;
          const cy = j * cell;
          if (look === 'ascii') {
            const char = land ? ASCII_RAMP[Math.min(4, Math.floor(z * 3.2 + noise * 1.8))] : '·';
            ctx.fillStyle = land ? shades[z > 0.55 ? 0 : 1] : shades[2];
            ctx.fillText(char, cx + cell / 2, cy + cell / 2);
            continue;
          }

          const level = land ? (noise < 0.45 ? 0 : noise < 0.78 ? 1 : 2) : 2;
          const gap = Math.max(1, cell * 0.12);
          ctx.fillStyle = shades[level];
          ctx.fillRect(cx + gap / 2, cy + gap / 2, cell - gap, cell - gap);
          if (land && level < 2 && hash(mapRow, mapCol) > 0.86) {
            ctx.fillStyle = mark;
            ctx.beginPath();
            ctx.arc(cx + cell / 2, cy + cell / 2, cell * 0.17, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    // Run only while on screen; stand still for reduced motion.
    let running = false;
    let frame = 0;
    let lastTime = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now - lastTime;
      lastTime = now - start;
      draw(lastTime);
      frame = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running || reduce.matches) return;
      running = true;
      start = 0;
      frame = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
    visibility.observe(canvas);
    const onReduce = () => {
      pause();
      draw(lastTime);
      play();
    };
    reduce.addEventListener('change', onReduce);
    draw(0);
    // Plex Mono may land after the first frame; redraw so a paused ASCII globe picks it up.
    document.fonts?.ready.then(() => !running && draw(lastTime));

    return () => {
      pause();
      resizer.disconnect();
      visibility.disconnect();
      reduce.removeEventListener('change', onReduce);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
