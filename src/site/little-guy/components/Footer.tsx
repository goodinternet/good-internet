import { stagger } from "./Hero";

// Not part of the original site. A conventional small-print footer: identity + status on the
// left, legal / contact links on the right. Links are "#" placeholders until real pages exist.
const identity = "© 2026 Good Internet";
const status = { label: "In development", version: "v0.1" };
const links = [
  { label: "Privacy Policy", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="site-footer stagger-in" style={stagger(7)}>
      <div className="site-footer-meta">
        <span>{identity}</span>
        <span className="site-footer-status">
          <span className="site-footer-dot" aria-hidden="true" />
          {status.label} {status.version}
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
