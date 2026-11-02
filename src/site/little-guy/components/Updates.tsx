import { stagger } from "./Hero";
import JoinList from "./JoinList";

const note = "Good Internet is taking shape. Join the list for occasional development updates, early previews, and news about access.";
const REPO_URL = "https://github.com/goodinternet/good-internet";

// Updates section: a header, one paragraph and the email sign-up (roadmap EST-6).
export default function Updates() {
  return (
    <section id="updates" className="side-projects">
      <div className="side-projects-content stagger-in" style={stagger(6)}>
        <div className="section-label">Updates</div>
        <p className="side-projects-note">
          {note} Progress is also public on{" "}
          <a className="hero-bio-link" href={REPO_URL}>
            GitHub
          </a>
          .
        </p>
        <JoinList />
      </div>
    </section>
  );
}
