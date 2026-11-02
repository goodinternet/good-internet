import { useState, type FormEvent } from "react";
import { joinList } from "../lib/waitlist";

type Status = "idle" | "sending" | "done" | "error";

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Pill email field + "Join the list" button, with a one-line promise underneath.
export default function JoinList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending" || status === "done") return;
    if (!looksLikeEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await joinList(email.trim());
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  // The standing promise ("Occasional emails. No spam. Unsubscribe anytime.") now lives in the paragraph
  // above the form; this line only appears for feedback after a submit.
  const caption =
    status === "done" ? "You're on the list. Thank you." : status === "error" ? "Please enter a valid email address." : "";

  return (
    <form className="join-list" onSubmit={submit} noValidate>
      <div className="join-list-row">
        <label className="join-list-label" htmlFor="join-list-email">
          Want in?
        </label>
        <input
          id="join-list-email"
          className="join-list-input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address"
          aria-invalid={status === "error" || undefined}
          value={email}
          disabled={status === "done"}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
        />
        <button className="join-list-button" type="submit" aria-label="Join the list" disabled={status === "sending" || status === "done"}>
          {status === "sending" ? "Joining…" : status === "done" ? "Joined" : "Join"}
          {status !== "done" && (
            <span className="join-list-arrow" aria-hidden="true">
              {/* two copies: on hover the first leaves up-right while the second arrives from down-left */}
              <svg className="join-list-arrow-a" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 11l6-6M6 5h5v5" />
              </svg>
              <svg className="join-list-arrow-b" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 11l6-6M6 5h5v5" />
              </svg>
            </span>
          )}
        </button>
      </div>
      <p className={`join-list-caption${status === "error" ? " is-error" : ""}`} role="status" hidden={!caption}>
        {caption}
      </p>
    </form>
  );
}
