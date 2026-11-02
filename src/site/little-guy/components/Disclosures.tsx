import { stagger } from "./Hero";

// Plain statement of what exists today. Not a privacy policy; that notice comes before signup opens.
const paragraphs = [
  "Good Internet is an independent software project in active development. The current workspace is a prototype and does not yet provide production cloud storage, backup, or recovery. Features shown or described are subject to change and should not be considered available until released.",
  "Email addresses submitted through the updates form will be used to send project news and early-access announcements. Details about data handling and unsubscribing will be provided in the privacy notice before signup opens.",
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
