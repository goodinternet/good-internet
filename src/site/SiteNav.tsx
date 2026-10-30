import * as React from 'react';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { Popover } from '@base-ui/react/popover';
import { PHASES, PROJECT } from './content.ts';

// The floating pill nav. Studied from a reference's interaction (one shared popup that reshapes
// between panels, 300ms on cubic-bezier(0.33, 1, 0.68, 1)), built on Base UI's NavigationMenu.

export function SiteNav() {
  return (
    <header className="SiteNav">
      <NavigationMenu.Root className="SiteNavRoot" delay={50} closeDelay={120}>
        <NavigationMenu.List className="SiteNavList">
          <NavigationMenu.Item>
            <NavigationMenu.Link className="SiteNavWordmark" href="/#top">
              Good Internet
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="SiteNavDesktop">
            <NavigationMenu.Trigger className="SiteNavItem">
              Project
              <NavigationMenu.Icon className="SiteNavCaret">
                <Caret />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="SiteNavContent">
              <ul className="SiteNavPanel SiteNavPanel-project">
                {PROJECT.map(([term, detail], i) => (
                  <li key={term}>
                    <NavigationMenu.Link className="SiteNavCard" href="/#project">
                      <span className="SiteMuted">0{i + 1}</span>
                      <span>{term}</span>
                      <span className="SiteMuted">{detail}</span>
                    </NavigationMenu.Link>
                  </li>
                ))}
                <li className="SiteNavPanelFoot">
                  <NavigationMenu.Link className="SiteNavRow" href="/#approach">
                    How we’re building it
                    <span className="SiteMuted">→</span>
                  </NavigationMenu.Link>
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="SiteNavDesktop">
            <NavigationMenu.Trigger className="SiteNavItem">
              Roadmap
              <NavigationMenu.Icon className="SiteNavCaret">
                <Caret />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="SiteNavContent">
              <ul className="SiteNavPanel SiteNavPanel-roadmap">
                {PHASES.map((phase) => (
                  <li key={phase.number}>
                    <NavigationMenu.Link className="SiteNavRow" href={`/#phase-${phase.number}`}>
                      <span className="SiteMuted">{phase.number}</span>
                      <span>{phase.name}</span>
                      {phase.now && <span className="SiteTag">Now</span>}
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="SiteNavDesktop">
            <NavigationMenu.Link className="SiteNavItem" href="/login">
              Sign in
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link className="SiteNavButton" href="/#updates">
              Get updates
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="SiteNavMobile">
            <MobileMenu />
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Portal>
          <NavigationMenu.Positioner className="SiteNavPositioner" sideOffset={8} collisionPadding={16}>
            <NavigationMenu.Popup className="SiteNavPopup">
              <NavigationMenu.Viewport className="SiteNavViewport" />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>
    </header>
  );
}

// Phones: the pill keeps the wordmark and Get updates; everything else sits behind this button.
function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="SiteNavItem SiteNavMenuButton" aria-label="Menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden>
          <path className="SiteNavBurgerTop" d="M2.5 5.5h11" />
          <path className="SiteNavBurgerBottom" d="M2.5 10.5h11" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner className="SiteNavPositioner" sideOffset={8} collisionPadding={16} align="end">
          <Popover.Popup className="SiteNavPopup SiteNavSheet">
            <a className="SiteNavRow" href="/#project" onClick={close}>
              Project
            </a>
            <a className="SiteNavRow" href="/#roadmap" onClick={close}>
              Roadmap
            </a>
            <a className="SiteNavRow" href="/#promises" onClick={close}>
              Promises
            </a>
            <a className="SiteNavRow" href="/login" onClick={close}>
              Sign in
            </a>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden>
      <path d="M2 3.75 5 6.75l3-3" />
    </svg>
  );
}
