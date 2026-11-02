import { stagger } from "./Hero";
import { CollectIcon, OrganizeIcon, PreserveIcon, RetrieveIcon } from "./PlatformIcons";
import { Card, CardDescription, CardGroup, CardHeader, CardMedia, CardTitle } from "./ui/card";

// Two layers per card (borrowed from opnmark.com's structure): what it does, then why it matters.
// Fluid Functionalism Card playground, preset caY64: icon media, descriptions on, no buttons,
// stacked cards, 2 columns, borderless, fluid hover on. Changed from the preset: separated tiles
// with a permanent fill (see writings.css) instead of hairline dividers.
const platformCards = [
  {
    icon: CollectIcon,
    title: "Collect",
    description: "Bring images, links, and other references into one private, browser-based library.",
    why: "One place for the things you don't want to lose.",
  },
  {
    icon: PreserveIcon,
    title: "Preserve",
    description: "Keep original files intact while optimized previews make browsing effortless.",
    why: "Your source material stays whole.",
  },
  {
    icon: OrganizeIcon,
    title: "Organize",
    description: "Give references structure through collections, tags, notes, and metadata.",
    why: "Keep the context alongside the reference.",
  },
  {
    icon: RetrieveIcon,
    title: "Retrieve",
    description: "Search and revisit references without digging through scattered folders.",
    why: "Find what matters when you need it.",
  },
];

// Platform section: the Fluid Functionalism Card group (see platformCards above).
export default function Writings() {
  return (
    <section className="writings stagger-in" style={stagger(4)}>
      <div className="section-label">Platform</div>
      <div className="platform-cards">
        <CardGroup columns={2} separated>
          {platformCards.map((c) => (
            <Card key={c.title} label={c.title} onClick={() => {}}>
              <CardHeader>
                <CardMedia icon={c.icon} />
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.description}</CardDescription>
                <p className="platform-why">{c.why}</p>
              </CardHeader>
            </Card>
          ))}
        </CardGroup>
      </div>
    </section>
  );
}
