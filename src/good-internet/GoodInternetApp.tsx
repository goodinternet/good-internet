import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { AccountMenu as GoodInternetAccountMenu } from './GoodInternetAccountMenu.tsx';
import { GoodInternetSettings } from './GoodInternetAccountPages.tsx';
import { GoodInternetBoard } from './GoodInternetBoard.tsx';
import { GoodInternetCollection } from './GoodInternetCollection.tsx';
import { GoodInternetLanding } from './GoodInternetLanding.tsx';
import { GoodInternetLab } from './GoodInternetLab.tsx';
import { GoodInternetLibrary } from './GoodInternetLibrary.tsx';
import { GoodInternetLogin } from './GoodInternetLogin.tsx';
import { GoodInternetReference } from './GoodInternetReference.tsx';
import { GoodInternetRequest } from './GoodInternetRequest.tsx';
import { GoodInternetRoadmap } from './GoodInternetRoadmap.tsx';
import { ArrowIcon, ArrowLink, Separator } from './parts.tsx';
import { completeMfaForLab, getSession } from './session.ts';
import './good-internet.css';
import { navigate } from './navigate.ts';

// Good Internet, synced from the kept-ui lab (scripts/sync-kept-ui.mjs). Routes are real paths.
// Shells are modeled on the base-ui.com homepage ((website)/layout.tsx + page.tsx):
// an 8-column grid where sections are `display: contents` and labels sit in the left gutter.

type Shell = 'marketing' | 'auth' | 'app' | 'board';

const MARKETING_NAV = [
  { href: '/', label: 'Landing', route: '' },
  { href: '/roadmap', label: 'Roadmap', route: 'roadmap' },
];
const AUTH_NAV = MARKETING_NAV.slice(0, 1);
const APP_NAV = [
  { href: '/library', label: 'Library', route: 'library' },
  { href: '/lab', label: 'Lab', route: 'lab' },
];

const TITLES: Record<string, string> = {
  '': 'GOOD INTERNET — A working library for visual research.',
  login: 'Sign in · GOOD INTERNET',
  'login/mfa': 'Two-factor · GOOD INTERNET',
  request: 'Request an invite · GOOD INTERNET',
  roadmap: 'Roadmap · GOOD INTERNET',
  library: 'Library · GOOD INTERNET',
  lab: 'Lab · GOOD INTERNET',
  settings: 'Settings · GOOD INTERNET',
};

const COMING_NEXT: Record<string, string> = {};

function shellFor(route: string): Shell {
  if (route.startsWith('m/')) return 'board';
  if (route.startsWith('login') || route === 'request') return 'auth';
  if (route === 'library' || route.startsWith('library/') || route === 'lab') return 'app';
  // Account pages, from the menu under your name
  if (route === 'settings') return 'app';
  return 'marketing';
}

// Signed-in routes: send the visitor to whichever auth step they still owe.
function useAuthGate(route: string) {
  const session = getSession();
  const redirect =
    shellFor(route) !== 'app' || session?.aal === 'aal2'
      ? null
      : session
        ? '/login/mfa'
        : '/login';

  React.useEffect(() => {
    if (redirect) navigate(redirect, 'replace');
  }, [redirect]);

  return redirect !== null;
}

function contentForRoute(route: string): React.ReactNode {
  if (route === '') return <GoodInternetLanding />;
  if (route === 'login') return <GoodInternetLogin />;
  if (route === 'login/mfa') return <GoodInternetMfaPlaceholder />;
  if (route === 'request') return <GoodInternetRequest />;
  if (route === 'roadmap') return <GoodInternetRoadmap />;
  if (route === 'library') return <GoodInternetLibrary />;
  if (route === 'lab') return <GoodInternetLab />;
  if (route === 'settings') return <GoodInternetSettings />;
  if (route.startsWith('library/')) {
    const [, collectionId, referenceId] = route.split('/');
    return referenceId ? (
      <GoodInternetReference key={referenceId} collectionId={collectionId} referenceId={referenceId} />
    ) : (
      <GoodInternetCollection key={collectionId} collectionId={collectionId} />
    );
  }
  return <GoodInternetComingNext label={COMING_NEXT[route]} />;
}

export function GoodInternetApp({ route }: { route: string }) {
  const redirecting = useAuthGate(route);

  React.useEffect(() => {
    const previous = document.title;
    // Collection and reference pages title themselves once their data loads.
    if (!route.startsWith('library/') && !route.startsWith('m/')) document.title = TITLES[route] ?? 'GOOD INTERNET';
    return () => {
      document.title = previous;
    };
  }, [route]);

  if (redirecting) return null;

  const shell = shellFor(route);
  // Board shell: a shared, read-only page with no site chrome and no sign-in.
  if (shell === 'board') return <GoodInternetBoard key={route} token={route.slice(2)} />;
  const nav = shell === 'app' ? APP_NAV : shell === 'auth' ? AUTH_NAV : MARKETING_NAV;
  const session = getSession();
  const content = contentForRoute(route);

  return (
    <div className="GoodInternetBody">
      <div className="GoodInternetGrid">
        <header className="GoodInternetContents">
          <a className="GoodInternetWordmark GoodInternetCol-logo" href="/" aria-label="Good Internet home">
            GOOD INTERNET
          </a>
          <nav className="GoodInternetStack GoodInternetCol-nav" aria-label="Site">
            {nav.map((item) => (
              <a
                key={item.href}
                className="GoodInternetLink GoodInternetText1"
                href={item.href}
                aria-current={item.route === route ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
            {shell === 'app' && session && <GoodInternetAccountMenu username={session.username} />}
          </nav>
          <span className="GoodInternetText1 GoodInternetMuted GoodInternetCol-status">
            Early development
          </span>
        </header>

        <main className="GoodInternetContents">{content}</main>

        <Separator />
        <footer className="GoodInternetContents">
          <span className="GoodInternetText1 GoodInternetCol-label">© Good Internet</span>
        </footer>
      </div>
    </div>
  );
}

// Two-factor isn't built yet; this stand-in lets the lab reach the library.
function GoodInternetMfaPlaceholder() {
  return (
    <section className="GoodInternetContents">
      <h1 className="GoodInternetDisplay GoodInternetCol-hero">Two-factor</h1>
      <p className="GoodInternetText2 GoodInternetMuted GoodInternetCol-full">
        Not built in the lab yet. Continue without a code for now.
      </p>
      <div className="GoodInternetCol-full">
        <Button
          className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2 GoodInternetButtonReset"
          onClick={() => {
            completeMfaForLab();
            navigate('/library');
          }}
        >
          Continue to library
          <ArrowIcon />
        </Button>
      </div>
    </section>
  );
}

function GoodInternetComingNext({
  label,
  back = '/',
  backLabel = 'Back to landing',
}: {
  label?: string;
  back?: string;
  backLabel?: string;
}) {
  return (
    <section className="GoodInternetContents">
      <h1 className="GoodInternetDisplay GoodInternetCol-hero">{label ?? 'Not found'}</h1>
      <p className="GoodInternetText2 GoodInternetMuted GoodInternetCol-full">Not built in the lab yet.</p>
      <div className="GoodInternetCol-full">
        <ArrowLink href={back}>{backLabel}</ArrowLink>
      </div>
    </section>
  );
}
