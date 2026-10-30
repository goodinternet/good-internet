import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';
import { onNavigate } from '../good-internet/navigate.ts';
import { requestInvite } from '../good-internet/repository.ts';
import { PHASES, PROJECT, PROMISES } from './content.ts';
import { SiteNav } from './SiteNav.tsx';
import './site.css';

// The public site: one page (/), with /roadmap and /request kept as jumps to their sections.
// good-internet only; the synced kept-ui landing, roadmap and request screens are left as they were.

const SECTION_FOR_ROUTE: Record<string, string> = { roadmap: 'roadmap', request: 'updates' };

export function Site({ route }: { route: string }) {
  useSectionScroll(SECTION_FOR_ROUTE[route]);

  React.useEffect(() => {
    document.title = 'Good Internet — a cloud-based personal knowledge workspace';
  }, []);

  return (
    <div className="Site" id="top">
      <SiteNav />

      <main className="SiteMain">
        <section className="SiteHero">
          <span className="SiteMuted">Early development</span>
          <h1 className="SiteDisplay">
            The workspace for the collectors, the researchers, the organizers, and the makers.
          </h1>
          <p className="SiteMuted SiteLede">
            A cloud-based personal knowledge workspace, built around collecting, preserving, organizing, and
            connecting information.
          </p>
        </section>

        <Section id="project" label="The project">
          <ol className="SiteSteps">
            {PROJECT.map(([term, detail], i) => (
              <li key={term} className="SiteStep">
                <span className="SiteMuted">0{i + 1}</span>
                <span>{term}</span>
                <span className="SiteMuted">{detail}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="approach" label="How we’re building it">
          <div className="SiteStack">
            <p>Reliability first.</p>
            <p className="SiteMuted SiteProse">
              Storage is the foundation; connection and retrieval are what make it useful. Not everything has
              to be AI. Folders, notes, manual connections and dependable search come first, and intelligence
              makes them better, never unpredictable.
            </p>
          </div>
        </Section>

        <Section id="roadmap" label="Roadmap">
          <ol className="SiteRows">
            {PHASES.map((phase) => (
              <li key={phase.number} id={`phase-${phase.number}`} className="SitePhase">
                <span className="SiteMuted">{phase.number}</span>
                <span className="SitePhaseName">
                  {phase.name}
                  {phase.now && <span className="SiteTag">Now</span>}
                </span>
                <span className="SiteMuted SiteProse">{phase.detail}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="promises" label="Our promises">
          <ul className="SiteRows">
            {PROMISES.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
        </Section>

        <Section id="updates" label="Get updates">
          <UpdatesForm />
        </Section>
      </main>

      <footer className="SiteFooter">
        <span className="SiteMuted">© Good Internet</span>
        <span>
          <span className="SiteMuted">Members </span>
          <a className="SiteLink" href="/login">
            Sign in →
          </a>
        </span>
      </footer>
    </div>
  );
}

function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section className="SiteSection" id={id} aria-labelledby={`${id}-label`}>
      <h2 className="SiteMuted SiteLabel" id={`${id}-label`}>
        {label}
      </h2>
      <div className="SiteBody">{children}</div>
    </section>
  );
}

// Signups go into the invite queue (repository.ts), email only.
function UpdatesForm() {
  const [pending, setPending] = React.useState(false);
  const [sent, setSent] = React.useState<{ email: string; already: boolean } | null>(null);

  if (sent) {
    return (
      <p role="status">
        {sent.already ? 'You’re already on the list. ' : 'You’re on the list. '}
        <span className="SiteMuted">We’ll write to {sent.email} when there’s something to try.</span>
      </p>
    );
  }

  return (
    <Form
      className="SiteStack"
      onFormSubmit={async (values) => {
        setPending(true);
        const email = String(values.email).trim().toLowerCase();
        try {
          const { alreadyRequested } = await requestInvite({ name: '', email, note: 'Updates' });
          setSent({ email, already: alreadyRequested });
        } finally {
          setPending(false);
        }
      }}
    >
      <p className="SiteMuted SiteProse">Good Internet is in early development. Get a note when there’s something to try.</p>
      <Field.Root name="email" className="SiteField">
        <Field.Label className="SiteVisuallyHidden">Email</Field.Label>
        <div className="SiteFieldRow">
          <Field.Control
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            className="SiteInput"
          />
          <button type="submit" className="SiteNavButton" disabled={pending}>
            {pending ? 'Sending…' : 'Get updates'}
          </button>
        </div>
        <Field.Error className="SiteError" match="valueMissing">
          Enter your email.
        </Field.Error>
        <Field.Error className="SiteError" match="typeMismatch">
          That doesn’t look like an email.
        </Field.Error>
      </Field.Root>
    </Form>
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
