import * as React from "react";
import { onNavigate } from "../good-internet/navigate.ts";
import { CLOUDFLARE, FEATURES, PHASES, PRINCIPLES, STATUS } from "./content.ts";
import { Globe } from "./Globe.tsx";
import { AsciiMark, PHASE_MARKS, useActive } from "./AsciiMark.tsx";
import type { Phase } from "./content.ts";
import { SiteNav } from "./SiteNav.tsx";
import "gen-interface-jp/display-400.css";
import "gen-interface-jp/display-500.css";
import "gen-interface-jp/display-600.css";
import "./site.css";

// The public site: one page (/), with /roadmap and /request kept as jumps to their sections.
// good-internet only; the synced kept-ui landing, roadmap and request screens are left as they were.

const SECTION_FOR_ROUTE: Record<string, string> = {
  roadmap: "roadmap",
  request: "updates",
};

const REPO_URL = "https://github.com/goodinternet/good-internet";

export function Site({ route }: { route: string }) {
  useSectionScroll(SECTION_FOR_ROUTE[route]);

  React.useEffect(() => {
    document.title = "Good Internet — a private home for your references";
  }, []);

  return (
    <div className="Site" id="top">
      <SiteNav />

      <main className="SiteMain">
        <section className="SiteHero">
          <div className="SiteStage" aria-hidden="true">
            <div className="SiteStageGrain" />
          </div>
          <div className="SiteHeroText">
            <span className="SiteChip">Early development</span>
            <h1 className="SiteDisplay">
              Your references, kept whole and kept private.
            </h1>
            <p className="SiteMuted SiteLede">
              Good Internet is a reference-management product built on a
              trustworthy cloud-storage foundation: a private place to collect,
              preserve, organize, annotate, search, and share what you
              reference.
            </p>
          </div>
          <Globe className="SiteGlobe" />
        </section>

        <Section id="product" label="What it is">
          <div className="SiteStack">
            <p>
              A private, cloud-based environment for your references, in the
              browser.
            </p>
            <p className="SiteMuted SiteProse">
              Good Internet has three surfaces: this public website, a private
              reference workspace, and shared views of the collections you
              choose to share. The workspace and shared views are being built;
              this site is the only part that exists as a finished surface
              today.
            </p>
          </div>
        </Section>

        <Section id="features" label="What we’re building">
          <div className="SiteStack">
            <ol className="SiteSteps">
              {FEATURES.map(([term, detail], i) => (
                <li key={term} className="SiteStep">
                  <span className="SiteMuted">0{i + 1}</span>
                  <span>{term}</span>
                  <span className="SiteMuted">{detail}</span>
                </li>
              ))}
            </ol>
            <p className="SiteMuted SiteProse">
              These are the capabilities we’re working toward, not features you
              can use today.
            </p>
          </div>
        </Section>

        <Section id="principles" label="Principles">
          <div className="SiteStack">
            <ol className="SiteSteps">
              {PRINCIPLES.map(([term, detail], i) => (
                <li key={term} className="SiteStep">
                  <span className="SiteMuted">0{i + 1}</span>
                  <span>{term}</span>
                  <span className="SiteMuted">{detail}</span>
                </li>
              ))}
            </ol>
            <p className="SiteMuted SiteProse">
              These are requirements we’re building to. The storage and recovery
              infrastructure behind them is not operational yet.
            </p>
          </div>
        </Section>

        <Section id="roadmap" label="Roadmap">
          <div className="SiteStack">
            <p className="SiteMuted SiteProse">
              Five stages, in order. The plan can change as we learn, and when
              it does, this page changes with it.
            </p>
            <ol className="SiteCards">
              {PHASES.map((phase, i) => (
                <PhaseCard
                  key={phase.number}
                  phase={phase}
                  mark={PHASE_MARKS[i]}
                />
              ))}
            </ol>
          </div>
        </Section>

        <Section id="cloudflare" label="Cloudflare">
          <div className="SiteStack">
            <p>The game plan when Cloudflare says yes.</p>
            <p className="SiteMuted SiteProse">
              We’ve applied to Cloudflare for Startups. The application is
              pending. We haven’t been accepted, and nothing here is an
              endorsement by Cloudflare or a promise of credits. If it comes
              through, this is where we’d point them:
            </p>
            <ol className="SiteSteps">
              {CLOUDFLARE.map(([term, detail], i) => (
                <li key={term} className="SiteStep">
                  <span className="SiteMuted">0{i + 1}</span>
                  <span>{term}</span>
                  <span className="SiteMuted">{detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section id="status" label="Where things stand">
          <div className="SiteStack">
            {STATUS.map((line) => (
              <p key={line} className="SiteMuted SiteProse">
                {line}
              </p>
            ))}
          </div>
        </Section>

        <Section id="updates" label="Updates">
          <div className="SiteStack">
            <p>Email updates aren’t set up yet.</p>
            <p className="SiteMuted SiteProse">
              We don’t have a signup list running, so we aren’t collecting email
              addresses. Until we do, the code and progress are public on{" "}
              <a className="SiteLink SiteUnderline" href={REPO_URL}>
                GitHub
              </a>
              .
            </p>
          </div>
        </Section>
      </main>

      <footer className="SiteFooter">
        <span className="SiteMuted">© Good Internet</span>
        <span>
          <span className="SiteMuted">Prototype </span>
          <a className="SiteLink" href="/login">
            Sign in →
          </a>
        </span>
      </footer>
    </div>
  );
}

// One roadmap stage as a card: mark and number, name, what it is, and where it stands.
function PhaseCard({ phase, mark }: { phase: Phase; mark: string[] }) {
  const { active, handlers } = useActive();
  return (
    <li className="SiteCardItem" id={`phase-${phase.number}`}>
      <div className="SiteCard" {...handlers}>
        <div className="SiteCardHead">
          <AsciiMark lines={mark} active={active} />
          <span className="SiteMuted">{phase.number}</span>
        </div>
        <h3 className="SiteCardTitle">{phase.name}</h3>
        <p className="SiteCardText">{phase.detail}</p>
        <p className="SiteCardStatus">
          {phase.now ? (
            <span className="SiteTag">In progress</span>
          ) : (
            <span className="SiteMuted">Planned</span>
          )}
        </p>
      </div>
    </li>
  );
}

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="SiteSection" id={id} aria-labelledby={`${id}-label`}>
      <h2 className="SiteMuted SiteLabel" id={`${id}-label`}>
        {label}
      </h2>
      <div className="SiteBody">{children}</div>
    </section>
  );
}

// /roadmap and /request open on their section; /#id links scroll there, smoothly unless reduced motion.
function useSectionScroll(routeSection: string | undefined) {
  React.useEffect(() => {
    const scroll = (smooth: boolean) => {
      const id = window.location.hash.slice(1) || routeSection;
      if (!id) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      // After App's scroll-to-top on a route change.
      requestAnimationFrame(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto" });
      });
    };
    scroll(false);
    // A link to the hash you're already on doesn't navigate, so scroll on the click too.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="/#"]');
      if (link && window.location.pathname === "/") scroll(true);
    };
    document.addEventListener("click", onClick);
    const stop = onNavigate(() => scroll(true));
    return () => {
      stop();
      document.removeEventListener("click", onClick);
    };
  }, [routeSection]);
}
