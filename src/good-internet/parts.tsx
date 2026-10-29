import * as React from 'react';

// Shared pieces of the base-ui.com homepage language.

export function Separator() {
  return (
    <div className="GoodInternetCol-separator">
      <div className="GoodInternetSeparator" role="separator" aria-hidden="true" />
    </div>
  );
}

// docs Link `withArrow`: the caret slides and a shaft appears on hover
export function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path className="GoodInternetArrowCaret" d="M6 12L10 8L6 4" />
      <path className="GoodInternetArrowLine" d="M2 8L13 8" />
    </svg>
  );
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2" href={href}>
      {children}
      <ArrowIcon />
    </a>
  );
}

// docs Link `withArrow`, pointing back
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="GoodInternetLink GoodInternetLinkArrow GoodInternetText1" href={href} data-direction="prev">
      <span className="GoodInternetFlip">
        <ArrowIcon />
      </span>
      {children}
    </a>
  );
}

export function SearchIcon() {
  return (
    <svg
      className="GoodInternetSearchIcon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m11 11 3.5 3.5" />
      <circle cx="7" cy="7" r="5.5" />
    </svg>
  );
}

// A reference's image filling its box; nothing when there's no file yet (the box stays gray).
export function ImageFill({ src, eager = false }: { src?: string; eager?: boolean }) {
  if (!src) return null;
  return (
    <img
      className="GoodInternetImageFill"
      src={src}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
