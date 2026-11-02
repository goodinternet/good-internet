import type { Recipe, Rgb, Stop } from "./recipe";

export interface NoiseLayer {
  seed: number;
  weight: number;
}

export interface Frame {
  recipe: Recipe;
  /** Usually one layer. Several while one noise pattern fades into another. */
  layers: NoiseLayer[];
  progress: number;
  time: number;
}

const JITTER = 0.006;
const OCTAVE_A = 0.625;
const OCTAVE_B = 0.3125;
const NOISE_MEAN = (OCTAVE_A + OCTAVE_B) / 2;

function hash(x: number, y: number) {
  let h = Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
  h ^= h >>> 13;
  h = Math.imul(h, 0x297a2d39);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number) {
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  const u = smooth(x - cx);
  const v = smooth(y - cy);
  const top = hash(cx, cy) * (1 - u) + hash(cx + 1, cy) * u;
  const bottom = hash(cx, cy + 1) * (1 - u) + hash(cx + 1, cy + 1) * u;
  return top * (1 - v) + bottom * v;
}

/**
 * Two layers rising at different speeds, so shapes change as they climb instead
 * of sliding past as one sheet. The sine bends make them round, like wax.
 */
function layeredNoise(x: number, y: number, time: number) {
  const bentX = x + 0.24 * Math.sin(y * 1.7 + time * 2.1);
  const bentY = y + 0.24 * Math.sin(x * 1.5 - time * 1.6);
  const broad = valueNoise(bentX + time * 0.35, bentY - time);
  const fine = valueNoise(bentX * 2.03 + 11.7 - time * 0.5, bentY * 2.03 + 5.3 - time * 1.7);
  return OCTAVE_A * broad + OCTAVE_B * fine;
}

function sampleRamp(stops: Stop[], t: number, out: Rgb) {
  let hi = 1;
  while (hi < stops.length - 1 && t > stops[hi][0]) hi++;
  const [from, a] = stops[hi - 1];
  const [to, b] = stops[hi];
  const mix = to > from ? Math.min(1, Math.max(0, (t - from) / (to - from))) : 0;
  out[0] = a[0] + (b[0] - a[0]) * mix;
  out[1] = a[1] + (b[1] - a[1]) * mix;
  out[2] = a[2] + (b[2] - a[2]) * mix;
}

/** Fills an RGBA buffer. Pure, so it runs in the worker or in Node. */
export function renderField(pixels: Uint8ClampedArray, width: number, height: number, frame: Frame) {
  const { recipe, layers, progress, time } = frame;
  const { stops, frequency, warp, travel, angle } = recipe;

  const aspect = width / height;
  const span = 1 / (1 + travel);
  const scroll = travel * span * progress;
  const radians = (angle * Math.PI) / 180;
  const dirX = Math.cos(radians) * aspect;
  const dirY = Math.sin(radians);
  const start = Math.min(0, dirX) + Math.min(0, dirY);
  const length = Math.abs(dirX) + Math.abs(dirY) || 1;
  const totalWeight = layers.reduce((sum, layer) => sum + layer.weight, 0) || 1;
  const color: Rgb = [0, 0, 0];

  for (let py = 0; py < height; py++) {
    const y = py / height;
    for (let px = 0; px < width; px++) {
      const x = px / width;

      let noise = 0;
      for (const { seed, weight } of layers) {
        noise += weight * layeredNoise(x * frequency * aspect + seed * 1.37, y * frequency + seed * 2.11, time);
      }
      noise = noise / totalWeight - NOISE_MEAN;

      const along = ((x * dirX + y * dirY - start) / length) * span;
      const jitter = (hash(px, py + 4099) - 0.5) * JITTER;
      const t = Math.min(1, Math.max(0, along + scroll + noise * warp * span + jitter));
      sampleRamp(stops, smooth(t), color);

      const i = (py * width + px) * 4;
      pixels[i] = color[0];
      pixels[i + 1] = color[1];
      pixels[i + 2] = color[2];
      pixels[i + 3] = 255;
    }
  }
}

/** A flat grey noise tile, as raw values, for the grain overlay. */
export function grainValues(size: number, depth: number) {
  const values = new Uint8ClampedArray(size * size);
  for (let i = 0; i < values.length; i++) {
    values[i] = 128 + (hash(i % size, Math.floor(i / size) + 8191) - 0.5) * 2 * depth;
  }
  return values;
}
