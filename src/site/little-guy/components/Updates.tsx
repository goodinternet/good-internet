import { stagger } from "./Hero";

const REPO_URL = "https://github.com/goodinternet/good-internet";

// Honest placeholder: there is no signup list yet (roadmap EST-6), so nothing collects email.
export default function Updates() {
  return (
    <section id="updates" className="side-projects">
      <div className="side-projects-content stagger-in" style={stagger(6)}>
        <div className="section-label">Updates</div>
        <p className="side-projects-note">
          Email updates aren’t set up yet. We don’t have a signup list running, so we aren’t collecting email addresses. Until
          we do, the code and progress are public on{" "}
          <a className="hero-bio-link" href={REPO_URL}>
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
