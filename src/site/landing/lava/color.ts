import type { Rgb } from "./engine/recipe";

type Matrix = number[][];
type Vector = [number, number, number];

const multiply = (m: Matrix, [a, b, c]: Vector): Vector => [
  m[0][0] * a + m[0][1] * b + m[0][2] * c,
  m[1][0] * a + m[1][1] * b + m[1][2] * c,
  m[2][0] * a + m[2][1] * b + m[2][2] * c,
];

// Standard matrices from CSS Color 4.
const LAB_TO_LMS = [
  [1, 0.3963377773761749, 0.2158037573099136],
  [1, -0.1055613458156586, -0.0638541728258133],
  [1, -0.0894841775298119, -1.2914855480194092],
];
const LMS_TO_XYZ = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816],
];
const XYZ_TO_P3 = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872],
];
const P3_TO_XYZ = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0, 0.04511338185890264, 1.043944368900976],
];
const XYZ_TO_LMS = [
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309],
];
const LMS_TO_LAB = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.42859224204858, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774],
];

const encode = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const decode = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

function linearP3(l: number, c: number, h: number): Vector {
  const radians = (h * Math.PI) / 180;
  const lab: Vector = [l, c * Math.cos(radians), c * Math.sin(radians)];
  const [ll, mm, ss] = multiply(LAB_TO_LMS, lab);
  return multiply(XYZ_TO_P3, multiply(LMS_TO_XYZ, [ll ** 3, mm ** 3, ss ** 3]));
}

const inGamut = (rgb: Vector) => rgb.every((v) => v >= -0.0001 && v <= 1.0001);

/** OKLCH to Display P3 values from 0 to 255, easing off chroma to stay in gamut. */
export function oklchToP3(l: number, c: number, h: number): Rgb {
  let chroma = c;
  let rgb = linearP3(l, chroma, h);
  while (!inGamut(rgb) && chroma > 0) {
    chroma -= 0.002;
    rgb = linearP3(l, chroma, h);
  }
  return rgb.map((v) => Math.round(encode(Math.min(1, Math.max(0, v))) * 255)) as Rgb;
}

export function p3ToOklch([r, g, b]: Rgb) {
  const linear: Vector = [decode(r / 255), decode(g / 255), decode(b / 255)];
  const [ll, mm, ss] = multiply(XYZ_TO_LMS, multiply(P3_TO_XYZ, linear));
  const [l, x, y] = multiply(LMS_TO_LAB, [Math.cbrt(ll), Math.cbrt(mm), Math.cbrt(ss)]);
  return { l, c: Math.hypot(x, y), h: ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360 };
}
