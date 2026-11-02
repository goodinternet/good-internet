import "@fontsource-variable/inter";
import "./styles/tailwind.css";
import "./styles/theme.css";
import "./styles/fluid-scope.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/hero.css";
import "./styles/writings.css";
import "./styles/landing-type.css";
import "./styles/disclosures.css";
import "./styles/footer.css";
import "./styles/roadmap.css";
import "./styles/updates.css";
import Hero from "./components/Hero";
import Writings from "./components/Writings";
import Roadmap from "./components/Roadmap";
import Updates from "./components/Updates";
import Disclosures from "./components/Disclosures";
import Footer from "./components/Footer";

// One 500px column, centred: bio, platform, roadmap, updates, disclosures, footer.
export function Landing() {
  return (
    <div className="landing-page">
      <div className="landing-page-column">
        <Hero />
        <Writings />
        <Roadmap />
        <Updates />
        <Disclosures />
        <Footer />
      </div>
    </div>
  );
}
