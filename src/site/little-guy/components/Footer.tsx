import { stagger } from "./Hero";

// Small-print footer: identity + status on the left, links to pages that exist on the right.
const identity = "© 2026 Good Internet";
const status = { label: "In development" };
const links = [
  { label: "Principles", href: "/principles" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Status", href: "/status" },
];

export default function Footer() {
  return (
    <footer className="site-footer stagger-in" style={stagger(7)}>
      <div className="site-footer-meta">
        <span>{identity}</span>
        <span className="site-footer-status">
          <span className="site-footer-dot" aria-hidden="true" />
          {status.label}
        </span>
      </div>
      <nav className="site-footer-links" aria-label="Footer">
        {links.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
