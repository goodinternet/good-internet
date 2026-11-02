import { stagger } from "./Hero";

// Plain statement of what exists today. Not a privacy policy.
const paragraphs = [
  "Good Internet is an independent software project in active development. The current workspace is a prototype running on sample data and does not yet provide cloud storage, backup, or recovery. Features shown or described are subject to change and should not be considered available until released.",
  "Email addresses submitted through the Updates form are used only to send Good Internet project news and early-access announcements, and every message includes an unsubscribe link.",
];

export default function Disclosures() {
  return (
    <section id="disclosures" className="disclosures stagger-in" style={stagger(7)}>
      {paragraphs.map((text, i) => (
        <p className="disclosures-text" key={text.slice(0, 24)}>
          {i === 0 && <strong className="disclosures-lead">Disclosures</strong>}
          {i === 0 && " "}
          {text}
        </p>
      ))}
    </section>
  );
}
