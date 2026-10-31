// Original art in the same role as Rerun's hero and Hub graphics: a white stack of reference sheets,
// fanning out into grainy spectrum pages. Drawn in SVG, so it stays sharp and is easy to change.
const SPECTRUM = ['#ef3f5e', '#f4663c', '#f8a92f', '#f6d943', '#5fcf6d', '#17bfd0', '#2f86ee', '#5b62ea'];

function Grain({ id }: { id: string }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" />
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -.75 1.3" />
      <feComposite in="SourceGraphic" operator="in" />
    </filter>
  );
}

interface Slab { x: number; y: number; w: number; h: number; d: number; top: string; left: string; right: string }

/** One rounded isometric slab: a top diamond and two side faces. */
function SlabShape({ x, y, w, h, d, top, left, right }: Slab) {
  const north = `${x},${y - h}`, east = `${x + w},${y}`, south = `${x},${y + h}`, west = `${x - w},${y}`;
  const southLow = `${x},${y + h + d}`, eastLow = `${x + w},${y + d}`, westLow = `${x - w},${y + d}`;
  return (
    <g strokeLinejoin="round" strokeWidth="18">
      <polygon points={`${west} ${south} ${southLow} ${westLow}`} fill={left} stroke={left} />
      <polygon points={`${south} ${east} ${eastLow} ${southLow}`} fill={right} stroke={right} />
      <polygon points={`${north} ${east} ${south} ${west}`} fill={top} stroke={top} />
    </g>
  );
}

const PAGES = 11;

/** A curved page rising from the stack, wider and taller the further it fans out. */
function pagePath(t: number) {
  const bx = 800 + 500 * t, by = 660 - 190 * t ** 1.25;
  const h = 230 + 390 * t, w = 118 + 60 * t, lean = 150 + 210 * t;
  const tx = bx + lean, ty = by - h;
  return `M${bx} ${by} C${bx + 66} ${by - 16} ${bx + 34} ${by - h * .62} ${tx} ${ty} L${tx + w} ${ty - 36} C${bx + 34 + w} ${by - h * .66} ${bx + 92 + w} ${by - 66} ${bx + w} ${by - 34} Z`;
}

export function HeroArt() {
  const pages = Array.from({ length: PAGES }, (_, i) => PAGES - 1 - i);
  return (
    <svg className="gi-art" viewBox="0 0 1440 830" width="1440" height="830" aria-hidden="true">
      <defs>
        <Grain id="gi-grain" />
        <linearGradient id="gi-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset=".5" stopColor="#fff" />
          <stop offset=".93" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="gi-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="830">
          <rect width="1440" height="830" fill="url(#gi-fade)" />
        </mask>
        {pages.map((i) => {
          const a = SPECTRUM[i % SPECTRUM.length], b = SPECTRUM[(i + 3) % SPECTRUM.length], c = SPECTRUM[(i + 6) % SPECTRUM.length];
          return (
            <linearGradient key={i} id={`gi-page-${i}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={a} /><stop offset=".5" stopColor={b} /><stop offset="1" stopColor={c} />
            </linearGradient>
          );
        })}
        <radialGradient id="gi-shadow"><stop offset="0" stopColor="#000" stopOpacity=".26" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <linearGradient id="gi-white" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#eceef0" /></linearGradient>
      </defs>
      <g mask="url(#gi-mask)" filter="url(#gi-grain)">
        {pages.map((i) => <path key={i} className="gi-page" style={{ animationDelay: `${-i * .7}s` }} d={pagePath(i / (PAGES - 1))} fill={`url(#gi-page-${i})`} />)}
      </g>
      <ellipse cx="720" cy="722" rx="196" ry="56" fill="url(#gi-shadow)" />
      <SlabShape x={720} y={684} w={126} h={58} d={16} top="#26272a" left="#17181a" right="#0e0f10" />
      <SlabShape x={720} y={634} w={112} h={52} d={9} top="url(#gi-white)" left="#d3d6da" right="#b9bdc4" />
      <SlabShape x={720} y={588} w={112} h={52} d={9} top="url(#gi-white)" left="#dcdee1" right="#c6c9ce" />
      <SlabShape x={720} y={542} w={112} h={52} d={9} top="url(#gi-white)" left="#e5e6e8" right="#d2d4d8" />
    </svg>
  );
}

export function PlatformArt() {
  return (
    <svg className="gi-platform-art" viewBox="0 0 840 210" width="840" height="210" aria-hidden="true">
      <defs>
        <linearGradient id="gi-edge-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6cc8f5" /><stop offset=".8" stopColor="#7be8d8" /><stop offset="1" stopColor="#f6d943" /></linearGradient>
        <linearGradient id="gi-coral" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#ef4f6b" /><stop offset=".6" stopColor="#f0806a" /><stop offset="1" stopColor="#ee5f78" /></linearGradient>
        <linearGradient id="gi-edge-r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f6d943" /><stop offset=".3" stopColor="#f39a5a" /><stop offset="1" stopColor="#ef5f70" /></linearGradient>
        <linearGradient id="gi-sheet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbfbf8" /><stop offset="1" stopColor="#f3f3ee" /></linearGradient>
      </defs>
      <SlabShape x={420} y={146} w={82} h={36} d={7} top="url(#gi-coral)" left="url(#gi-edge-l)" right="url(#gi-edge-r)" />
      <SlabShape x={420} y={98} w={82} h={36} d={7} top="url(#gi-sheet)" left="#d7d9d4" right="#bfc1bc" />
      <SlabShape x={420} y={50} w={82} h={36} d={7} top="url(#gi-sheet)" left="#dfe0dc" right="#c9cbc6" />
    </svg>
  );
}
