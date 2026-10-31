import * as React from 'react';
import { Badge, Banner, GlobeMap, Grid, LayerCard, Link, LinkButton, Surface, Tabs, Text } from '@cloudflare/kumo';
import {
  ArrowRightIcon,
  BookmarksSimpleIcon,
  ChatTextIcon,
  FoldersIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  ShareNetworkIcon,
  ArchiveIcon,
} from '@phosphor-icons/react';
import { onNavigate } from '../good-internet/navigate.ts';
import { getTheme, setTheme, type Theme } from '../good-internet/theme.ts';
import { CLOUDFLARE, FEATURES, PHASES, PRINCIPLES, STATUS } from './content.ts';
import kumoCss from '@cloudflare/kumo/styles/standalone?inline';
import './kumo-site.css';

// The public site: one page (/), with /roadmap and /request kept as jumps to their sections.
// Built from Cloudflare's Kumo components. good-internet only; the synced kept-ui screens are untouched.

const SECTION_FOR_ROUTE: Record<string, string> = { roadmap: 'roadmap', request: 'updates' };
const REPO_URL = 'https://github.com/goodinternet/good-internet';

const FEATURE_ICONS = [
  BookmarksSimpleIcon,
  ArchiveIcon,
  FoldersIcon,
  ChatTextIcon,
  MagnifyingGlassIcon,
  ShareNetworkIcon,
];

const THEMES: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Kumo reads light/dark from data-mode, so resolve our System / Light / Dark choice to one of the two.
function useMode() {
  const [theme, setThemeState] = React.useState<Theme>(getTheme);
  const [systemDark, setSystemDark] = React.useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  React.useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  const choose = (next: Theme) => {
    setTheme(next);
    setThemeState(next);
  };
  const mode = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  return { theme, mode, choose } as const;
}

// Kumo's stylesheet carries Tailwind's resets, which would restyle the rest of the app (sign in, library).
// So it's attached only while the marketing page is on screen, and removed when you leave it.
function useKumoStyles() {
  React.useLayoutEffect(() => {
    const style = document.createElement('style');
    style.dataset.kumo = '';
    style.textContent = kumoCss;
    document.head.append(style);
    return () => style.remove();
  }, []);
}

export function Site({ route }: { route: string }) {
  useKumoStyles();
  useSectionScroll(SECTION_FOR_ROUTE[route]);
  const { theme, mode, choose } = useMode();

  React.useEffect(() => {
    document.title = 'Good Internet — a private home for your references';
  }, []);

  return (
    <div className="KSite" id="top" data-theme="kumo" data-mode={mode}>
      <header className="KHeader">
        <div className="KHeaderInner">
          <a className="KWordmark" href="/#top">
            Good Internet
          </a>
          <nav className="KNav" aria-label="Sections">
            <a href="/#principles">Principles</a>
            <a href="/#roadmap">Roadmap</a>
            <a href="/#status">Status</a>
          </nav>
          <div className="KHeaderActions">
            <Tabs
              variant="segmented"
              value={theme}
              onValueChange={(value: string) => choose(value as Theme)}
              tabs={THEMES}
              className="KThemeTabs"
            />
            <LinkButton variant="ghost" href="/login">
              Sign in
            </LinkButton>
          </div>
        </div>
      </header>

      <main className="KMain">
        <section className="KHero">
          <div className="KHeroText">
            <Badge variant="beta">Early development</Badge>
            <h1 className="KDisplay">Your references, kept whole and kept private.</h1>
            <Text variant="secondary" size="lg">
              Good Internet is a reference-management product built on a trustworthy cloud-storage foundation: a
              private place to collect, preserve, organize, annotate, search, and share what you reference.
            </Text>
            <div className="KRow">
              <LinkButton variant="primary" size="lg" icon={ArrowRightIcon} href="/#roadmap">
                See the roadmap
              </LinkButton>
              <LinkButton variant="secondary" size="lg" href="/#principles">
                Our principles
              </LinkButton>
            </div>
          </div>
          <Surface className="KGlobe" aria-hidden="true">
            <GlobeMap
              autoRotate
              autoRotateSpeed={5}
              defaultRotation={[-20, -15, 0]}
              landHatchSpacing={8}
              oceanColor="transparent"
              showGraticule
              showTooltip={false}
              isDarkMode={mode === 'dark'}
            />
          </Surface>
        </section>

        <Banner
          variant="default"
          icon={<LockKeyIcon size={18} />}
          title="Early development: nothing is released yet."
          description="This page describes where Good Internet is headed. Planned capabilities are labelled as planned."
        />

        <Section id="product" label="What it is">
          <Text variant="heading" size="lg" as="p">
            A private, cloud-based environment for your references, in the browser.
          </Text>
          <Text variant="secondary" as="p">
            Good Internet has three surfaces: this public website, a private reference workspace, and shared views
            of the collections you choose to share. The workspace and shared views are being built; this site is
            the only part that exists as a finished surface today.
          </Text>
        </Section>

        <Section id="principles" label="Principles" note="These are requirements we’re building to. The storage and recovery infrastructure behind them is not operational yet.">
          <Grid variant="3up" gap="base">
            {PRINCIPLES.map(([term, detail], i) => (
              <LayerCard key={term}>
                <LayerCard.Secondary>
                  <span className="KMono">0{i + 1}</span>
                </LayerCard.Secondary>
                <LayerCard.Primary>
                  <Text variant="heading" as="h3">
                    {term}
                  </Text>
                  <Text variant="secondary" as="p">
                    {detail}
                  </Text>
                </LayerCard.Primary>
              </LayerCard>
            ))}
          </Grid>
        </Section>

        <Section id="features" label="What we’re building" note="Capabilities we’re working toward, not features you can use today.">
          <Grid variant="3up" gap="base">
            {FEATURES.map(([term, detail], i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <Surface key={term} className="KCard">
                  <Icon size={22} weight="duotone" className="KIcon" />
                  <Text variant="heading" as="h3">
                    {term}
                  </Text>
                  <Text variant="secondary" as="p">
                    {detail}
                  </Text>
                </Surface>
              );
            })}
          </Grid>
        </Section>

        <Section id="roadmap" label="Roadmap" note="Five stages, in order. The plan can change as we learn, and when it does, this page changes with it.">
          <Surface className="KRoadmap">
            <ol>
              {PHASES.map((phase) => (
                <li key={phase.number} id={`phase-${phase.number}`} className="KStage">
                  <span className="KMono">{phase.number}</span>
                  <div className="KStageText">
                    <Text variant="heading" as="h3">
                      {phase.name}
                    </Text>
                    <Text variant="secondary" as="p">
                      {phase.detail}
                    </Text>
                  </div>
                  <Badge variant={phase.now ? 'info' : 'outline'}>{phase.now ? 'In progress' : 'Planned'}</Badge>
                </li>
              ))}
            </ol>
          </Surface>
        </Section>

        <Section id="cloudflare" label="Cloudflare">
          <Text variant="heading" size="lg" as="p">
            The game plan when Cloudflare says yes.
          </Text>
          <Banner
            variant="alert"
            title="Application pending"
            description="We’ve applied to Cloudflare for Startups. We haven’t been accepted, and nothing here is an endorsement by Cloudflare or a promise of credits."
          />
          <Grid variant="3up" gap="base">
            {CLOUDFLARE.map(([term, detail], i) => (
              <LayerCard key={term}>
                <LayerCard.Secondary>
                  <span className="KMono">Play 0{i + 1}</span>
                </LayerCard.Secondary>
                <LayerCard.Primary>
                  <Text variant="heading" as="h3">
                    {term}
                  </Text>
                  <Text variant="secondary" as="p">
                    {detail}
                  </Text>
                </LayerCard.Primary>
              </LayerCard>
            ))}
          </Grid>
        </Section>

        <Section id="status" label="Where things stand">
          {STATUS.map((line) => (
            <Text key={line} variant="secondary" as="p">
              {line}
            </Text>
          ))}
        </Section>

        <Section id="updates" label="Updates">
          <Text variant="heading" size="lg" as="p">
            Email updates aren’t set up yet.
          </Text>
          <Text variant="secondary" as="p">
            We don’t have a signup list running, so we aren’t collecting email addresses. Until we do, the code and
            progress are public on{' '}
            <Link href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </Link>
            .
          </Text>
        </Section>
      </main>

      <footer className="KFooter">
        <Text variant="secondary" size="sm">
          © Good Internet
        </Text>
        <Text variant="secondary" size="sm">
          Prototype ·{' '}
          <Link href="/login" variant="plain">
            Sign in →
          </Link>
        </Text>
      </footer>
    </div>
  );
}

function Section({
  id,
  label,
  note,
  children,
}: {
  id: string;
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="KSection" id={id} aria-labelledby={`${id}-label`}>
      <h2 className="KLabel" id={`${id}-label`}>
        <Text variant="mono-secondary">{label}</Text>
      </h2>
      <div className="KSectionBody">
        {children}
        {note && (
          <Text variant="secondary" size="sm" as="p">
            {note}
          </Text>
        )}
      </div>
    </section>
  );
}

// /roadmap and /request open on their section; /#id links scroll there, smoothly unless reduced motion.
function useSectionScroll(routeSection: string | undefined) {
  React.useEffect(() => {
    const scroll = (smooth: boolean) => {
      const id = window.location.hash.slice(1) || routeSection;
      if (!id) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // After App's scroll-to-top on a route change.
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto' });
      });
    };
    scroll(false);
    // A link to the hash you're already on doesn't navigate, so scroll on the click too.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="/#"]');
      if (link && window.location.pathname === '/') scroll(true);
    };
    document.addEventListener('click', onClick);
    const stop = onNavigate(() => scroll(true));
    return () => {
      stop();
      document.removeEventListener('click', onClick);
    };
  }, [routeSection]);
}
