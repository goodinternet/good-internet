import * as React from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { APPROACH_MARK, AsciiMark, PHASE_MARKS, PROJECT_MARKS, useActive } from './AsciiMark.tsx';
import { PHASES, PROJECT } from './content.ts';

// The site nav. Studied from a reference's interaction and built by hand:
// - Desktop: a rounded bar; one shared dropdown as wide as the bar (a frosted shell around a white
//   card) that resizes between panels, built on Base UI's NavigationMenu.
// - Phones: a full-width bar that grows into a card; Project and Roadmap open submenus that slide
//   in from above, and the wordmark turns into "Back to menu".

export function SiteNav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}

// ---------- Desktop ----------

function DesktopNav() {
  const barRef = React.useRef<HTMLDivElement>(null);
  return (
    <header className="SiteNav SiteNavDesktop">
      <NavigationMenu.Root className="SiteNavRoot" delay={50} closeDelay={120}>
        <div className="SiteNavBar" ref={barRef}>
          <NavigationMenu.List className="SiteNavList">
            <NavigationMenu.Item>
              <NavigationMenu.Link className="SiteNavWordmark" href="/#top">
                Good Internet
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="SiteNavItem">
                Project
                <NavigationMenu.Icon className="SiteNavCaret">
                  <Caret />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="SiteNavContent">
                <div className="SiteNavCells SiteNavCells-project">
                  {PROJECT.map(([term, detail], i) => (
                    <Cell
                      key={term}
                      href="/#project"
                      mark={PROJECT_MARKS[i]}
                      eyebrow={`0${i + 1}`}
                      title={term}
                      detail={detail}
                    />
                  ))}
                  <Cell
                    wide
                    href="/#approach"
                    mark={APPROACH_MARK}
                    title="How we’re building it"
                    detail="Reliability first. Storage is the foundation."
                  />
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="SiteNavItem">
                Roadmap
                <NavigationMenu.Icon className="SiteNavCaret">
                  <Caret />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="SiteNavContent">
                <div className="SiteNavCells SiteNavCells-roadmap">
                  {PHASES.map((phase, i) => (
                    <Cell
                      key={phase.number}
                      href={`/#phase-${phase.number}`}
                      mark={PHASE_MARKS[i]}
                      eyebrow={phase.number}
                      title={phase.name}
                      detail={phase.short}
                      now={phase.now}
                    />
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <div className="SiteNavActions">
            <a className="SiteNavItem" href="/login">
              Sign in
            </a>
            <a className="SiteNavButton" href="/#updates">
              Get updates
            </a>
          </div>
        </div>

        <NavigationMenu.Portal>
          <NavigationMenu.Positioner
            className="SiteNavPositioner"
            anchor={barRef}
            side="bottom"
            align="start"
            sideOffset={8}
          >
            <NavigationMenu.Popup className="SiteNavPopup">
              <NavigationMenu.Viewport className="SiteNavViewport" />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </header>
  );
}

function Cell({
  href,
  mark,
  eyebrow,
  title,
  detail,
  now,
  wide,
}: {
  href: string;
  mark: string[];
  eyebrow?: string;
  title: string;
  detail: string;
  now?: boolean;
  wide?: boolean;
}) {
  const { active, handlers } = useActive();
  return (
    <NavigationMenu.Link className="SiteNavCell" data-wide={wide || undefined} href={href} {...handlers}>
      <span className="SiteNavCellTop">
        <AsciiMark lines={mark} active={active} />
        {now && <span className="SiteTag">Now</span>}
      </span>
      <span className="SiteNavCellText">
        <span>
          {eyebrow && <span className="SiteMuted">{eyebrow} </span>}
          {title}
        </span>
        <span className="SiteMuted">{detail}</span>
      </span>
    </NavigationMenu.Link>
  );
}

// ---------- Phones ----------

type Submenu = 'project' | 'roadmap' | null;

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [submenu, setSubmenu] = React.useState<Submenu>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const panels = {
    main: React.useRef<HTMLDivElement>(null),
    project: React.useRef<HTMLDivElement>(null),
    roadmap: React.useRef<HTMLDivElement>(null),
  };
  const [height, setHeight] = React.useState(0);
  const active = submenu ?? 'main';

  const close = React.useCallback(() => {
    setOpen(false);
    setSubmenu(null);
  }, []);

  // The card is as tall as the panel showing
  React.useLayoutEffect(() => {
    const panel = panels[active].current;
    if (!panel) return;
    const measure = () => setHeight(panel.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Escape or a tap outside closes it
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, close]);

  const panelState = (name: 'main' | 'project' | 'roadmap') =>
    name === active ? 'active' : name === 'main' ? 'below' : 'above';

  return (
    <header
      ref={headerRef}
      className="SiteMobileNav"
      data-open={open || undefined}
      data-submenu={submenu ?? undefined}
    >
      <div className="SiteMobileShellPad">
        <div className="SiteMobileShell">
          <div
            className="SiteMobileCard"
            style={{ height: open ? height : 0 }}
            inert={!open}
            id="site-mobile-menu"
          >
            <div
              className="SiteMobilePanel"
              ref={panels.main}
              data-state={panelState('main')}
              inert={active !== 'main'}
            >
              <ul className="SiteMobileRows">
                <li>
                  <button className="SiteMobileRow" onClick={() => setSubmenu('project')}>
                    Project
                    <Chevron />
                  </button>
                </li>
                <li>
                  <button className="SiteMobileRow" onClick={() => setSubmenu('roadmap')}>
                    Roadmap
                    <Chevron />
                  </button>
                </li>
                <li>
                  <a className="SiteMobileRow" href="/#promises" onClick={close}>
                    Promises
                  </a>
                </li>
              </ul>
              <div className="SiteMobileDivider" />
              <div className="SiteMobileActions">
                <a className="SiteNavItem" href="/login" onClick={close}>
                  Sign in
                </a>
                <a className="SiteNavButton" href="/#updates" onClick={close}>
                  Get updates
                </a>
              </div>
            </div>

            <div
              className="SiteMobilePanel SiteMobileSub"
              ref={panels.project}
              data-state={panelState('project')}
              inert={active !== 'project'}
            >
              <ul>
                {PROJECT.map(([term, detail], i) => (
                  <MobileItem
                    key={term}
                    href="/#project"
                    mark={PROJECT_MARKS[i]}
                    title={`0${i + 1} ${term}`}
                    detail={detail}
                    onPick={close}
                  />
                ))}
                <MobileItem
                  href="/#approach"
                  mark={APPROACH_MARK}
                  title="How we’re building it"
                  detail="Reliability first. Storage is the foundation."
                  onPick={close}
                />
              </ul>
            </div>

            <div
              className="SiteMobilePanel SiteMobileSub"
              ref={panels.roadmap}
              data-state={panelState('roadmap')}
              inert={active !== 'roadmap'}
            >
              <ul>
                {PHASES.map((phase, i) => (
                  <MobileItem
                    key={phase.number}
                    href={`/#phase-${phase.number}`}
                    mark={PHASE_MARKS[i]}
                    title={`${phase.number} ${phase.name}`}
                    detail={phase.short}
                    now={phase.now}
                    onPick={close}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="SiteMobileBar">
        <div className="SiteMobileBarLeft">
          <a
            className="SiteNavWordmark SiteMobileSwap"
            data-shown={!submenu || undefined}
            href="/#top"
            onClick={close}
            inert={!!submenu}
          >
            Good Internet
          </a>
          <button
            className="SiteMobileBack SiteMobileSwap"
            data-shown={!!submenu || undefined}
            onClick={() => setSubmenu(null)}
            inert={!submenu}
          >
            <Chevron back />
            Back to menu
          </button>
        </div>
        <button
          className="SiteMobileToggle"
          aria-label={open ? 'Close menu' : 'Menu'}
          aria-expanded={open}
          aria-controls="site-mobile-menu"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <svg
            className="SiteMobileIcon"
            data-shown={!open || undefined}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M3.5 7h13M3.5 13h13" />
          </svg>
          <svg
            className="SiteMobileIcon"
            data-shown={open || undefined}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
        <div className="SiteMobileBarRule" />
      </div>
    </header>
  );
}

function MobileItem({
  href,
  mark,
  title,
  detail,
  now,
  onPick,
}: {
  href: string;
  mark: string[];
  title: string;
  detail: string;
  now?: boolean;
  onPick: () => void;
}) {
  const { active, handlers } = useActive();
  return (
    <li>
      <a className="SiteMobileItem" href={href} onClick={onPick} {...handlers}>
        <AsciiMark lines={mark} active={active} />
        <span className="SiteNavCellText">
          <span>
            {title}
            {now && <span className="SiteTag">Now</span>}
          </span>
          <span className="SiteMuted">{detail}</span>
        </span>
      </a>
    </li>
  );
}

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden>
      <path d="M2 3.75 5 6.75l3-3" />
    </svg>
  );
}

function Chevron({ back }: { back?: boolean }) {
  return (
    <svg
      className="SiteMobileChevron"
      data-back={back || undefined}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}
