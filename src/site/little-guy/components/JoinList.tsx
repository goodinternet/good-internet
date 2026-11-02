import { useState, type FormEvent } from "react";
import { joinList, type JoinResult } from "../lib/subscribe";

type Status = "idle" | "sending" | "done" | JoinResult;

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const messages: Record<string, string> = {
  invalid_email: "Please enter a valid email address.",
  consent_required: "Please tick the box to confirm.",
  rate_limited: "Too many attempts. Please try again in a few minutes.",
  unavailable: "Signup isn’t available right now. Please try again later.",
  network: "Couldn’t reach the server. Check your connection and try again.",
  done: "Thanks. You’re on the list.",
};

// Email field + consent + Join button. Posts to /api/subscribe, which adds the address to the Resend list.
export default function JoinList() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending" || status === "done") return;
    if (!looksLikeEmail(email)) return setStatus("invalid_email");
    if (!consent) return setStatus("consent_required");
    setStatus("sending");
    const result = await joinList({ email: email.trim(), consent, website });
    setStatus(result === "ok" ? "done" : result);
  }

  const isError = status !== "idle" && status !== "sending" && status !== "done";
  const caption = status === "done" || isError ? messages[status] : "";

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
          aria-invalid={status === "invalid_email" || undefined}
          value={email}
          disabled={status === "done"}
          onChange={(e) => {
            setEmail(e.target.value);
            if (isError) setStatus("idle");
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
      <label className="join-list-consent">
        <input
          type="checkbox"
          checked={consent}
          disabled={status === "done"}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (isError) setStatus("idle");
          }}
        />
        <span>Email me occasional project updates, early previews, and news about access from Good Internet. Unsubscribe anytime.</span>
      </label>
      <input
        className="join-list-hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <p className={`join-list-caption${isError ? " is-error" : ""}`} role="status" hidden={!caption}>
        {caption}
      </p>
    </form>
  );
}
