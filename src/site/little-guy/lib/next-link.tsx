import type { AnchorHTMLAttributes } from "react";

// The Fluid Functionalism Card imports `next/link`. This project is Vite, not Next,
// so `next/link` is aliased to this plain anchor (see vite.config.ts and tsconfig).
export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
