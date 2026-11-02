export type Rgb = [r: number, g: number, b: number];
export type Stop = [position: number, color: Rgb];

/** Everything needed to draw one gradient. Plain data, safe to save or share. */
export interface Recipe {
  /** Colour ramp, positions 0 to 1, always four stops so recipes can blend. */
  stops: Stop[];
  /** Noise scale. Lower is broader and softer. */
  frequency: number;
  /** How far the noise bends the colour bands. */
  warp: number;
  /** How much of the ramp stays off-screen until the flow reveals it. */
  travel: number;
  /** Idle noise movement, in noise units per second. */
  drift: number;
  /** Direction of the ramp, in degrees. 90 runs top to bottom. */
  angle: number;
  /** Picks the noise pattern. */
  seed: number;
  grainAlpha: number;
  grainDepth: number;
}
