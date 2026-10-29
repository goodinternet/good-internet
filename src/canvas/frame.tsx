// One canvas preview alone in its own document (canvas-frame.html?id=…), so it gets a real viewport
// (vw, vh, media queries) and only its own CSS. CanvasRoute renders one iframe of this per item.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { items } from './registry.ts';

const id = new URLSearchParams(location.search).get('id');
const item = items.find((i) => i.id === id);

// Previews never leave the canvas: links and form submits don't navigate. Their own click and
// submit handlers still run.
addEventListener('click', (e) => {
  if ((e.target as Element | null)?.closest?.('a[href]')) e.preventDefault();
}, true);
addEventListener('submit', (e) => e.preventDefault(), true);
// No horizontal overscroll, so a sideways swipe at a preview's edge can't trigger history navigation.
document.documentElement.style.overscrollBehaviorX = 'none';

const root = createRoot(document.getElementById('root')!);
if (!item) {
  root.render(<p style={{ font: '13px system-ui', padding: 16 }}>No canvas item called “{id}”.</p>);
} else {
  document.title = item.name;
  item.load().then(
    ({ default: Preview }) => root.render(<StrictMode><Preview /></StrictMode>),
    (error: Error) => root.render(<pre style={{ font: '12px ui-monospace', padding: 16, whiteSpace: 'pre-wrap' }}>{error.message}</pre>),
  );
}
