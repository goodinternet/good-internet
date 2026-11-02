import { roadmap } from "../data/content";
import { stagger } from "./Hero";
import { IconProvider, type IconComponent } from "../lib/icon-context";
import { Badge, type BadgeColor } from "./ui/badge";
import { AccordionContent, AccordionGroup, AccordionItem, AccordionTrigger } from "./ui/accordion";

// The + from wade-site's project list (commit 279afb0): 10px, 1.5 stroke, square caps. It turns to
// an × (45deg) when its row is open; the turn is CSS (see roadmap.css), not the accordion's chevron spin.
const PlusIcon: IconComponent = ({ strokeWidth = 1.5, className }) => (
  <svg
    className={`roadmap-plus ${className ?? ""}`}
    width="10"
    height="10"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth + 0.5} // a touch heavier than the accordion default (1.5 rest, 2 hover/open)
    strokeLinecap="square"
    aria-hidden="true"
  >
    <path d="M1.5 8h13M8 14.5v-13" />
  </svg>
);
const icons = { "chevron-right": PlusIcon }; // stable object, per IconProvider's note

const disclaimer =
  "Stages are a planning structure, not a release schedule. Nothing here is available yet, and statuses are kept in step with the project\u2019s roadmap.";

// Fluid Functionalism single-expand accordion: opening a stage closes the one that was open, and
// clicking the open one closes it (collapsible). The fluid hover highlight glides between triggers.
// All stages start collapsed.
// (The previous hover-card version of this list is in git history at 880d167.)
export default function Roadmap() {
  return (
    <section id="roadmap" className="roadmap">
      <div className="roadmap-content stagger-in" style={stagger(5)}>
        <div className="section-label">Roadmap</div>
        <div className="roadmap-accordion fluid-scope">
          <IconProvider icons={icons}>
          <AccordionGroup type="single" collapsible className="w-full">
            {roadmap.map((s, i) => (
              <AccordionItem value={s.n} index={i} key={s.n} className="roadmap-v-stagger">
                <AccordionTrigger>
                  <span className="roadmap-num tabular-nums">{s.n}</span>
                  {s.name}
                  <Badge color={s.color as BadgeColor} size="compact" className="ml-2">
                    {s.status}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <p>{s.text}</p>
                  <ul className="roadmap-items">
                    {s.items.map((item, k) => (
                      <li key={item} data-n={`${s.n}.${k + 1}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionGroup>
          </IconProvider>
        </div>
        <p className="roadmap-note">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="8" cy="8" r="6.25" />
            <path d="M8 7.25v3.5M8 5.1v.01" />
          </svg>
          <span>{disclaimer}</span>
        </p>
      </div>
    </section>
  );
}
