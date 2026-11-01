import type { Recipe } from "./recipe";
import { grainValues } from "./render";
import type { WorkerMessage } from "./worker";

const RENDER_SCALE = 0.25;
const GRAIN_SIZE = 200;

function grainTile(depth: number) {
  const tile = document.createElement("canvas");
  tile.width = tile.height = GRAIN_SIZE;
  const context = tile.getContext("2d")!;
  const image = context.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  grainValues(GRAIN_SIZE, depth).forEach((value, i) => {
    image.data.set([value, value, value, 255], i * 4);
  });
  context.putImageData(image, 0, 0);
  return tile.toDataURL();
}

/** Mounts a gradient inside `host`. The host sets the size. */
export function createGradient(host: HTMLElement, recipe: Recipe) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "display:block;width:100%;height:100%";

  const grain = document.createElement("div");
  grain.style.cssText =
    "position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;background-repeat:repeat;image-rendering:pixelated";

  host.style.isolation = "isolate";
  host.append(canvas, grain);

  let grainDepth = -1;
  function applyGrain(next: Recipe) {
    if (next.grainDepth !== grainDepth) {
      grainDepth = next.grainDepth;
      grain.style.backgroundImage = `url(${grainTile(grainDepth)})`;
    }
    grain.style.opacity = String(next.grainAlpha);
  }
  applyGrain(recipe);

  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  const send = (message: WorkerMessage, transfer: Transferable[] = []) => worker.postMessage(message, transfer);

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colorSpace = CSS.supports("color", "color(display-p3 1 0 0)") ? "display-p3" : "srgb";
  const offscreen = canvas.transferControlToOffscreen();
  send({ type: "init", canvas: offscreen, colorSpace, recipe, reducedMotion: motion.matches }, [offscreen]);

  const onMotion = () => send({ type: "reducedMotion", reducedMotion: motion.matches });
  motion.addEventListener("change", onMotion);

  const resize = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = host;
    if (!clientWidth || !clientHeight) return;
    grain.style.backgroundSize = `${GRAIN_SIZE / devicePixelRatio}px`;
    send({
      type: "size",
      width: Math.max(2, Math.round(clientWidth * RENDER_SCALE)),
      height: Math.max(2, Math.round(clientHeight * RENDER_SCALE)),
    });
  });
  resize.observe(host);

  return {
    setRecipe(next: Recipe) {
      applyGrain(next);
      send({ type: "recipe", recipe: next });
    },
    destroy() {
      resize.disconnect();
      motion.removeEventListener("change", onMotion);
      worker.terminate();
      canvas.remove();
      grain.remove();
    },
  };
}
