import { oklchToP3, p3ToOklch } from "../color";
import type { Recipe } from "./recipe";
import { renderField, type NoiseLayer } from "./render";

export type WorkerMessage =
  | { type: "init"; canvas: OffscreenCanvas; colorSpace: PredefinedColorSpace; recipe: Recipe; reducedMotion: boolean }
  | { type: "size"; width: number; height: number }
  | { type: "recipe"; recipe: Recipe }
  | { type: "reducedMotion"; reducedMotion: boolean };

type Oklch = ReturnType<typeof p3ToOklch>;

const FRAME_MS = 1000 / 60;
const BLEND_MS = 240;
const SETTLED = 0.001;
/** One slow swell of the colours, up the ramp and back. */
const SWELL_SECONDS = 36;

let canvas: OffscreenCanvas;
let context: OffscreenCanvasRenderingContext2D;
let image: ImageData;
let current: Recipe;
let target: Recipe;
let liveColors: Oklch[] = [];
let layers: NoiseLayer[] = [];
let progress = 0.18;
let swell = 0;
let time = 0;
let reducedMotion = false;
let dirty = true;
let timer = 0;
let lastTick = 0;

function approach(from: number, to: number, amount: number) {
  return Math.abs(to - from) < SETTLED ? to : from + (to - from) * amount;
}

/** Moves the live recipe toward its target. Returns true while still moving. */
function blend(amount: number) {
  let moving = false;
  const step = (from: number, to: number) => {
    const next = approach(from, to, amount);
    if (next !== to) moving = true;
    return next;
  };

  // Colours travel through OKLCH so a morph never passes through grey.
  liveColors = liveColors.map((color, i) => {
    const to = p3ToOklch(target.stops[i][1]);
    const hueGap = ((to.h - color.h + 540) % 360) - 180;
    return {
      l: step(color.l, to.l),
      c: step(color.c, to.c),
      h: (step(color.h, color.h + hueGap) + 360) % 360,
    };
  });

  current = {
    ...target,
    frequency: step(current.frequency, target.frequency),
    warp: step(current.warp, target.warp),
    travel: step(current.travel, target.travel),
    angle: step(current.angle, target.angle),
    stops: current.stops.map(([position], i) => {
      const { l, c, h } = liveColors[i];
      return [step(position, target.stops[i][0]), moving ? oklchToP3(l, c, h) : target.stops[i][1]];
    }),
  };

  for (const layer of layers) {
    layer.weight = step(layer.weight, layer.seed === target.seed ? 1 : 0);
  }
  layers = layers.filter((layer) => layer.weight > 0 || layer.seed === target.seed);
  return moving;
}

function tick() {
  timer = 0;
  const now = performance.now();
  const elapsed = Math.min(now - lastTick, 250);
  lastTick = now;

  const drifting = target.drift > 0 && !reducedMotion;
  if (drifting) {
    time += (elapsed / 1000) * target.drift;
    swell += elapsed / 1000;
    progress = 0.5 - 0.32 * Math.cos((swell / SWELL_SECONDS) * Math.PI * 2);
  }

  const blending = blend(reducedMotion ? 1 : 1 - Math.exp(-elapsed / BLEND_MS));

  if (dirty || drifting || blending) {
    dirty = false;
    renderField(image.data, image.width, image.height, { recipe: current, layers, progress, time });
    context.putImageData(image, 0, 0);
  }
  if (drifting || blending) timer = self.setTimeout(tick, FRAME_MS);
}

function wake() {
  dirty = true;
  if (timer || !context) return;
  lastTick = performance.now();
  timer = self.setTimeout(tick, 0);
}

self.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
  switch (data.type) {
    case "init":
      canvas = data.canvas;
      context = canvas.getContext("2d", { colorSpace: data.colorSpace })!;
      current = target = data.recipe;
      liveColors = data.recipe.stops.map(([, color]) => p3ToOklch(color));
      layers = [{ seed: data.recipe.seed, weight: 1 }];
      reducedMotion = data.reducedMotion;
      break;
    case "size":
      canvas.width = data.width;
      canvas.height = data.height;
      image = context.createImageData(data.width, data.height);
      break;
    case "recipe":
      target = data.recipe;
      if (!layers.some((layer) => layer.seed === target.seed)) {
        layers.push({ seed: target.seed, weight: 0 });
      }
      break;
    case "reducedMotion":
      reducedMotion = data.reducedMotion;
      break;
  }
  if (image) wake();
};
