// The working copy of the site nav, alone on solid #FAFAF9. Everything in this folder is its own copy,
// so changes here never reach the live site or the other frames. The menu copy is the real content.ts.
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import 'gen-interface-jp/display-400.css';
import 'gen-interface-jp/display-500.css';
import 'gen-interface-jp/display-600.css';
import '../../../good-internet/tokens.css';
import { applyTheme, getTheme } from '../../../good-internet/theme.ts';
import { SiteNav } from './SiteNav.tsx';
import './nav.css';

applyTheme(getTheme());
// The canvas's theme menu saves through theme.ts in the parent page; follow it here.
addEventListener('storage', () => applyTheme(getTheme()));

export default function NavWorkingPreview() {
  return (
    <div className="Site" id="top">
      <SiteNav />
    </div>
  );
}
