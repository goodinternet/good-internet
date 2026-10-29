// /admin: the in-house dashboard, borrowed from madeofparts (which borrowed it from dash-shell).
// Not linked from anywhere and loaded as its own chunk, so the product bundle doesn't carry it.
import { useEffect } from "react";
import { Dashboard } from "./dashboard";
import { shellIcons } from "./icons";
import { THEME_KEY } from "./config";
import "./dashboard.css";

// Apply the saved admin theme before the first render so there's no flash.
try { if (localStorage.getItem(THEME_KEY) === "dark") document.documentElement.classList.add("ds-dark"); } catch {}

export default function AdminApp() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Admin · GOOD INTERNET";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.append(robots);
    return () => {
      document.title = previous;
      robots.remove();
    };
  }, []);

  return <Dashboard icons={shellIcons} />;
}
