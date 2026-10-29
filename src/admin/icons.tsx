// The admin icon set as ready-made nodes, passed to the dashboard components.
import type { ReactNode } from "react";
import { svgs } from "./icon-svgs";

const icon = (html: string) => <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;

export const shellIcons = Object.fromEntries(Object.entries(svgs).map(([k, v]) => [k, icon(v)])) as Record<keyof typeof svgs, ReactNode>;
export type IconKey = keyof typeof svgs;
