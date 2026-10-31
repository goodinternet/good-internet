import * as React from 'react';
import { onNavigate } from '../good-internet/navigate.ts';
import { CLOUDFLARE, FEATURES, PHASES, PRINCIPLES, STATUS } from './content.ts';
import 'gen-interface-jp/display-400.css';
import 'gen-interface-jp/display-500.css';
import 'gen-interface-jp/display-600.css';
import './plain.css';

// The public site: one page (/), with /roadmap and /request kept as jumps to their sections.
// A typography-only foundation: one typeface, plain HTML, no components or decoration.

const SECTION_FOR_ROUTE: Record<string, string> = { roadmap: 'roadmap', request: 'updates' };
const REPO_URL = 'https://github.com/goodinternet/good-internet';

export function Site({ route }: { route: string }) {
  useSectionScroll(SECTION_FOR_ROUTE[route]);

  React.useEffect(() => {
    document.title = 'Good Internet — a private home for your references';
  }, []);

  return (
    <div className="Plain" id="top">
      <header className="PlainHeader">
        <a href="/#top">Good Internet</a>
        <nav aria-label="Sections">
          <a href="/#principles">Principles</a>
          <a href="/#roadmap">Roadmap</a>
          <a href="/#status">Status</a>
          <a href="/login">Sign in</a>
        </nav>
      </header>

      <main>
        <section className="PlainHero">
          <p>Early development</p>
          <h1>Your references, kept whole and kept private.</h1>
          <p className="PlainLede">
            Good Internet is a reference-management product built on a trustworthy cloud-storage foundation: a
            private place to collect, preserve, organize, annotate, search, and share what you reference.
          </p>
          <p>
            <a href="/#roadmap">See the roadmap</a> · <a href="/#principles">Our principles</a>
          </p>
        </section>

        <section className="PlainNotice">
          <p>Early development: nothing is released yet.</p>
          <p>This page describes where Good Internet is headed. Planned capabilities are labelled as planned.</p>
        </section>

        <Section id="product" label="What it is">
          <p className="PlainLead">A private, cloud-based environment for your references, in the browser.</p>
          <p>
            Good Internet has three surfaces: this public website, a private reference workspace, and shared views
            of the collections you choose to share. The workspace and shared views are being built; this site is
            the only part that exists as a finished surface today.
          </p>
        </Section>

        <Section id="principles" label="Principles">
          <ol className="PlainList">
            {PRINCIPLES.map(([term, detail], i) => (
              <li key={term}>
                <span className="PlainNum">0{i + 1}</span>
                <h3>{term}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
          <p>
            These are requirements we’re building to. The storage and recovery infrastructure behind them is not
            operational yet.
          </p>
        </Section>

        <Section id="features" label="What we’re building">
          <ol className="PlainList">
            {FEATURES.map(([term, detail], i) => (
              <li key={term}>
                <span className="PlainNum">0{i + 1}</span>
                <h3>{term}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
          <p>Capabilities we’re working toward, not features you can use today.</p>
        </Section>

        <Section id="roadmap" label="Roadmap">
          <ol className="PlainList">
            {PHASES.map((phase) => (
              <li key={phase.number} id={`phase-${phase.number}`}>
                <span className="PlainNum">{phase.number}</span>
                <h3>{phase.name}</h3>
                <p>{phase.detail}</p>
                <p className="PlainStatus">{phase.now ? 'In progress' : 'Planned'}</p>
              </li>
            ))}
          </ol>
          <p>
            Five stages, in order. The plan can change as we learn, and when it does, this page changes with it.
          </p>
        </Section>

        <Section id="cloudflare" label="Cloudflare">
          <p className="PlainLead">The game plan when Cloudflare says yes.</p>
          <p>Application pending</p>
          <p>
            We’ve applied to Cloudflare for Startups. We haven’t been accepted, and nothing here is an endorsement
            by Cloudflare or a promise of credits.
          </p>
          <ol className="PlainList">
            {CLOUDFLARE.map(([term, detail], i) => (
              <li key={term}>
                <span className="PlainNum">Play 0{i + 1}</span>
                <h3>{term}</h3>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="status" label="Where things stand">
          {STATUS.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Section>

        <Section id="updates" label="Updates">
          <p className="PlainLead">Email updates aren’t set up yet.</p>
          <p>
            We don’t have a signup list running, so we aren’t collecting email addresses. Until we do, the code and
            progress are public on <a href={REPO_URL}>GitHub</a>.
          </p>
        </Section>
      </main>

      <footer className="PlainFooter">
        <span>© Good Internet</span>
        <span>
          Prototype · <a href="/login">Sign in →</a>
        </span>
      </footer>
    </div>
  );
}

function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section className="PlainSection" id={id} aria-labelledby={`${id}-label`}>
      <h2 id={`${id}-label`}>{label}</h2>
      <div>{children}</div>
    </section>
  );
}

// /roadmap and /request open on their section; /#id links scroll there.
function useSectionScroll(routeSection: string | undefined) {
  React.useEffect(() => {
    const scroll = () => {
      const id = window.location.hash.slice(1) || routeSection;
      if (!id) return;
      // After App's scroll-to-top on a route change.
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };
    scroll();
    // A link to the hash you're already on doesn't navigate, so scroll on the click too.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="/#"]');
      if (link && window.location.pathname === '/') scroll();
    };
    document.addEventListener('click', onClick);
    const stop = onNavigate(scroll);
    return () => {
      stop();
      document.removeEventListener('click', onClick);
    };
  }, [routeSection]);
}
