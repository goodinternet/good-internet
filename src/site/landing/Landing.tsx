// The homepage: Good Internet's words, styled on rerun.io's measured type, spacing, and components.
// Copy is content.ts, art is Art.tsx. The status card sits fixed to the window, like Rerun's event card.
import * as React from 'react';
import { ArchiveIcon, BooksIcon, BriefcaseIcon, CaretRightIcon, ImagesSquareIcon, ListIcon, XIcon } from '@phosphor-icons/react';
import { onNavigate } from '../../good-internet/navigate.ts';
import { HeroArt, PlatformArt } from './Art.tsx';
import { audience, cloudflare, footer, hero, legal, nav, platform, status, useCases } from './content.ts';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './landing.css';

const CASE_ICONS = [ImagesSquareIcon, BriefcaseIcon, BooksIcon, ArchiveIcon];

function Header() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <header className="gi-header">
      <div className="gi-header-inner">
        <a className="gi-brand" href="/">{nav.brand}</a>
        <nav className="gi-nav" aria-label="Main"><ul>{nav.links.map((link) => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}</ul></nav>
        <a className="gi-utility" href={nav.utility.href}>{nav.utility.label}</a>
        <button type="button" className="gi-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <XIcon size={18} /> : <ListIcon size={18} />}
        </button>
      </div>
      {open && (
        <>
          <button type="button" className="gi-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />
          <nav className="gi-panel" aria-label="Menu" onClick={() => setOpen(false)}>
            <ul>
              {nav.links.map((link) => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
              <li><a href={nav.utility.href}>{nav.utility.label}</a></li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}

function StatusCard() {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
    <aside className="gi-status" aria-label="Development status">
      <div className="gi-status-head">
        <p className="gi-status-eyebrow">{status.eyebrow}</p>
        <p className="gi-status-title">{status.title}</p>
      </div>
      <dl>{status.rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
      <a className="gi-status-link" href={status.link.href}>{status.link.label.replace(' →', '')}<CaretRightIcon size={15} aria-hidden="true" /></a>
      <button type="button" className="gi-dismiss" aria-label="Dismiss" onClick={() => setOpen(false)}><XIcon size={14} /></button>
    </aside>
  );
}

export function Landing() {
  useHashScroll();
  React.useEffect(() => {
    document.title = 'Good Internet — a private home for your references';
  }, []);

  return (
    <div className="gi" id="top">
      <Header />
      <main>
        <section className="gi-hero">
          <HeroArt />
          <div className="gi-hero-text">
            <p className="gi-eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title.map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="gi-large">{hero.text}</p>
            <div className="gi-buttons">
              <a className="gi-btn gi-btn-solid" href={hero.primary.href}>{hero.primary.label}</a>
              <a className="gi-btn gi-btn-line" href={hero.secondary.href}>{hero.secondary.label}</a>
            </div>
          </div>
        </section>

        <section className="gi-platform" id="platform">
          <PlatformArt />
          <span className="gi-pill">{platform.eyebrow}</span>
          <h2>{platform.title}</h2>
          <p className="gi-large gi-platform-text">{platform.text}</p>
          <div className="gi-columns">
            {platform.columns.map((column) => (
              <div key={column.title}>
                <p className="gi-muted">{column.label}</p>
                <h3>{column.title}</h3>
                <p className="gi-muted gi-column-text">{column.text}</p>
              </div>
            ))}
          </div>
          <a className="gi-btn gi-btn-spectrum" href={platform.cta.href}>{platform.cta.label}</a>
        </section>

        <section className="gi-audience">
          <header>
            <h2>{audience.title}</h2>
            <p className="gi-large">{audience.text}</p>
          </header>
          <div className="gi-cases">
            {useCases.map((item, i) => {
              const Icon = CASE_ICONS[i];
              return (
                <div key={item.title}>
                  <Icon size={28} weight="fill" aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p className="gi-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="gi-footer">
        <div className="gi-footer-main">
          <div>
            <a className="gi-footer-brand" href="/">{footer.brand}</a>
            <p className="gi-footer-text">{footer.description}</p>
          </div>
          <div className="gi-footer-columns">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => <li key={link.label}>{link.href ? <a href={link.href}>{link.label}</a> : <span>{link.label}</span>}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <section className="gi-note" aria-labelledby="gi-note-title">
          <h3 id="gi-note-title">{cloudflare.title}</h3>
          <p>{cloudflare.text}</p>
          <ol>{cloudflare.priorities.map((p, i) => <li key={p}><span>0{i + 1}</span>{p}</li>)}</ol>
        </section>
        <div className="gi-legal">
          <p>{legal.left}</p>
          <p>{legal.right}</p>
        </div>
      </footer>
      <StatusCard />
    </div>
  );
}

/** /#platform links scroll on the page they're already on, which a route change wouldn't do. */
function useHashScroll() {
  React.useEffect(() => {
    const scroll = () => {
      const id = window.location.hash.slice(1);
      if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };
    scroll();
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.('a[href^="/#"]')) scroll();
    };
    document.addEventListener('click', onClick);
    const stop = onNavigate(scroll);
    return () => {
      stop();
      document.removeEventListener('click', onClick);
    };
  }, []);
}
