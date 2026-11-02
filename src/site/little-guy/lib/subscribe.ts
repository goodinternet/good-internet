export type JoinResult = "ok" | "invalid_email" | "consent_required" | "rate_limited" | "unavailable" | "network";

// Posts to /api/subscribe (api/subscribe.ts). Anything the server can't do reads as "unavailable", never as success.
export async function joinList(input: { email: string; consent: boolean; website: string }): Promise<JoinResult> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) return "ok";
    const { error } = (await res.json().catch(() => ({}))) as { error?: string };
    if (error === "invalid_email" || error === "consent_required" || error === "rate_limited") return error;
    return "unavailable";
  } catch {
    return "network";
  }
}
