import * as React from 'react';

// A small block of ASCII that scrambles and resolves left to right while `active` is set
// (the nav cells set it on hover and focus). Holds still for reduced motion.

const NOISE = '#*+=:.-%@';
const SCRAMBLE_MS = 420;
const STEP_MS = 35;

export function AsciiMark({ lines, active }: { lines: string[]; active: boolean }) {
  const [shown, setShown] = React.useState(lines);
  const text = lines.join('\n');

  React.useEffect(() => {
    const lines = text.split('\n');
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(lines);
      return;
    }
    const width = Math.max(...lines.map((line) => line.length));
    const start = performance.now();
    const timer = window.setInterval(() => {
      const progress = (performance.now() - start) / SCRAMBLE_MS;
      if (progress >= 1) {
        window.clearInterval(timer);
        setShown(lines);
        return;
      }
      // Columns left of the sweep are settled; the rest flicker
      const settled = Math.floor(progress * width);
      setShown(
        lines.map((line) =>
          [...line]
            .map((char, i) =>
              i < settled || char === ' ' ? char : NOISE[Math.floor(Math.random() * NOISE.length)],
            )
            .join(''),
        ),
      );
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [active, text]);

  return (
    <pre className="SiteAscii" aria-hidden="true">
      {shown.join('\n')}
    </pre>
  );
}

// Hover and focus state for a nav cell, to drive its mark.
export function useActive() {
  const [active, setActive] = React.useState(false);
  const on = () => setActive(true);
  const off = () => setActive(false);
  return { active, handlers: { onPointerEnter: on, onPointerLeave: off, onFocus: on, onBlur: off } };
}

export const PROJECT_MARKS: string[][] = [
  ['+-----+', '|#####|', '+-----+'],
  ['o--o   ', ' \\  \\  ', '  o--o '],
  [' .-.   ', '( # )  ', " '-'\\\\ "],
];

export const APPROACH_MARK = ['[#][#][#]'];

// Phase n of 8: a track with the phase filled in.
export const PHASE_MARKS: string[][] = Array.from({ length: 8 }, (_, phase) => [
  Array.from({ length: 8 }, (_, i) => (i === phase ? '#' : i < phase ? ':' : '.')).join(''),
]);
