import type { CSSProperties } from "react";
import { lead, summary } from "../data/content";

// Children of the landing page fade up 8px with a 50ms stagger (see .stagger-in).
export const stagger = (i: number) => ({ "--stagger-delay": `${i * 50}ms` }) as CSSProperties;

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bio">
        <p className="hero-bio-line stagger-in" style={stagger(1)}>
          <span className="hero-name">{lead.title}</span>
          {lead.body}
        </p>
        {summary.map((text, i) => (
          <p className="hero-bio-line stagger-in is-light" style={stagger(i + 2)} key={i}>
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
