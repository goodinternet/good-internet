import type { Recipe } from './engine/recipe'

/** The gradient the page opens on, before the first shuffle. */
export const firstLoad: Recipe = {
  stops: [
    [0, [209, 182, 254]],
    [0.165, [255, 145, 105]],
    [0.87, [214, 248, 126]],
    [1, [225, 251, 150]],
  ],
  frequency: 1.6,
  warp: 1.5,
  travel: 1,
  drift: 0.1,
  angle: 78,
  seed: 4127,
  grainAlpha: 0.16,
  grainDepth: 80,
}
