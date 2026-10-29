// The real Good Internet landing, booted the way main.tsx boots the app: fonts, tokens, saved theme.
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '../../good-internet/tokens.css';
import '../../good-internet/inputs.css';
import { GoodInternetApp } from '../../good-internet/GoodInternetApp.tsx';
import { applyTheme, getTheme } from '../../good-internet/theme.ts';

applyTheme(getTheme());
// The canvas's theme menu saves through theme.ts in the parent page; follow it here.
addEventListener('storage', () => applyTheme(getTheme()));

export default function GoodInternetLandingPreview() {
  return <GoodInternetApp route="" />;
}
