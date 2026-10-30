// The current public site, booted the way main.tsx and App.tsx boot it: fonts, tokens, saved theme,
// and the route attribute the public styles key off.
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '../../good-internet/tokens.css';
import '../../good-internet/inputs.css';
import '../../good-internet/plex.css';
import { applyTheme, getTheme } from '../../good-internet/theme.ts';
import { Site } from '../../site/Site.tsx';

applyTheme(getTheme());
document.documentElement.dataset.goodInternetRoute = '';
// The canvas's theme menu saves through theme.ts in the parent page; follow it here.
addEventListener('storage', () => applyTheme(getTheme()));

// These frames are as tall as the whole page, so the hero's 92svh would measure the frame instead of
// a screen. Pin it to what it is on the screen each frame stands for (1440×900, 390×844).
const hero = document.createElement('style');
hero.textContent = `.SiteHero { min-height: ${Math.round((innerWidth < 500 ? 844 : 900) * 0.92)}px; }`;
document.head.append(hero);

export default function GoodInternetSitePreview() {
  return <Site route="" />;
}
