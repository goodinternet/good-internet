// Settings → Integrations: connected apps as settings rows with switches. Connections are placeholder state until real OAuth/keys exist.
import { useState, type ReactNode } from "react";
import type { IconKey } from "./icons";

type Icons = Record<IconKey, ReactNode>;
type Kind = "oauth" | "key";
export type App = { id: string; name: string; i: IconKey; color: string; desc: string; caps: string[]; kind: Kind; account?: string; synced?: string };
type State = "off" | "busy" | "on";

export const APPS: App[] = [
  { id: "github", name: "GitHub", i: "github", color: "#181717", desc: "Show commits, pull requests, and issues in your feed.", caps: ["Repos", "Pull requests", "Issues"], kind: "oauth", account: "@wade", synced: "2m ago" },
  { id: "vercel", name: "Vercel", i: "vercel", color: "#000000", desc: "See deployments and previews next to your changes.", caps: ["Deployments", "Previews"], kind: "oauth", account: "wade's projects", synced: "just now" },
  { id: "openai", name: "OpenAI", i: "openai", color: "#10A37F", desc: "Use GPT models for the assistant and summaries.", caps: ["Chat", "Embeddings"], kind: "key" },
  { id: "anthropic", name: "Anthropic", i: "anthropic", color: "#D97757", desc: "Use Claude models for the assistant and reviews.", caps: ["Chat", "Tool use"], kind: "key" },
  { id: "google", name: "Google Calendar", i: "google", color: "#4285F4", desc: "Bring your events into Calendar and the feed.", caps: ["Events", "Free/busy"], kind: "oauth" },
  { id: "linear", name: "Linear", i: "linear", color: "#5E6AD2", desc: "Sync issues and cycles with your projects.", caps: ["Issues", "Cycles"], kind: "oauth" },
  { id: "figma", name: "Figma", i: "figma", color: "#F24E1E", desc: "Preview design files inside projects.", caps: ["Files", "Comments"], kind: "oauth" },
  { id: "slack", name: "Slack", i: "slack", color: "#4A154B", desc: "Get feed updates and reply from Slack.", caps: ["Messages", "Alerts"], kind: "oauth" },
  { id: "notion", name: "Notion", i: "notion", color: "#000000", desc: "Link docs and pages to your projects.", caps: ["Pages", "Databases"], kind: "oauth" },
];

/** Shared connect/disconnect state with a short fake "connecting" step. */
export function useConnections() {
  const [s, setS] = useState<Record<string, State>>(() => Object.fromEntries(APPS.map(a => [a.id, a.account ? "on" : "off"])));
  const toggle = (id: string) => {
    if (s[id] === "busy") return;
    if (s[id] === "on") return setS(x => ({ ...x, [id]: "off" }));
    setS(x => ({ ...x, [id]: "busy" }));
    setTimeout(() => setS(x => ({ ...x, [id]: "on" })), 900);
  };
  return { s, toggle };
}

export const verb = (a: App) => a.kind === "key" ? "Add API key" : "Connect";

export function Logo({ I, a, size = 32 }: { I: Icons; a: App; size?: number }) {
  return <span className="ig-logo" style={{ width: size, height: size, ["--b" as string]: a.color }}>{I[a.i]}</span>;
}
export function Status({ st, a }: { st: State; a: App }) {
  return <span className="ig-status" data-st={st}><i />{st === "on" ? "Connected" : st === "busy" ? "Connecting…" : a.kind === "key" ? "Needs a key" : "Not connected"}</span>;
}

/** Settings rows with a switch, connected apps grouped first. API-key apps get an “Add key” button instead. */
export function IntegrationsList({ I }: { I: Icons }) {
  const { s, toggle } = useConnections();
  const on = APPS.filter(a => s[a.id] !== "off"), off = APPS.filter(a => s[a.id] === "off");
  const Row = ({ a }: { a: App }) => <div className="ig-li">
    <Logo I={I} a={a} size={36} />
    <span className="ig-li-t"><b>{a.name}</b><span>{s[a.id] === "on" && a.account ? `Connected as ${a.account}${a.synced ? ` · synced ${a.synced}` : ""}` : a.desc}</span></span>
    {a.kind === "key" && s[a.id] === "off"
      ? <button type="button" className="ig-btn" onClick={() => toggle(a.id)}>{I.key}Add key</button>
      : <button type="button" role="switch" aria-checked={s[a.id] !== "off"} aria-label={`${a.name} connection`} className="ig-switch" data-busy={s[a.id] === "busy"} onClick={() => toggle(a.id)}><i /></button>}
  </div>;
  return <div className="ig-page">
    {on.length > 0 && <><h4 className="ig-h">Connected</h4><div className="ig-list">{on.map(a => <Row key={a.id} a={a} />)}</div></>}
    <h4 className="ig-h">Available</h4><div className="ig-list">{off.map(a => <Row key={a.id} a={a} />)}</div>
  </div>;
}

