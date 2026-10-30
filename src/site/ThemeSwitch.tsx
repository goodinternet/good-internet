import * as React from 'react';
import { getTheme, setTheme, type Theme } from '../good-internet/theme.ts';

// System / Light / Dark as one segmented control; the thumb slides to the chosen mode.
// Remembered in this browser by theme.ts. `labels` shows the words next to the icons.

const OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden>
        <circle cx="7" cy="7" r="5.5" />
        <path d="M7 1.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="7" cy="7" r="2.75" />
        <path d="M7 .75v1.5M7 11.75v1.5M.75 7h1.5M11.75 7h1.5M2.6 2.6l1 1M10.4 10.4l1 1M2.6 11.4l1-1M10.4 3.6l1-1" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M11.9 8.6A5.25 5.25 0 0 1 5.4 2.1a5.25 5.25 0 1 0 6.5 6.5z" />
      </svg>
    ),
  },
];

// Every switch on the page stays in step (desktop bar and phone menu).
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function ThemeSwitch({ labels = false }: { labels?: boolean }) {
  const theme = React.useSyncExternalStore(subscribe, getTheme);
  const index = OPTIONS.findIndex((option) => option.value === theme);

  return (
    <div
      className="SiteTheme"
      data-labels={labels || undefined}
      role="radiogroup"
      aria-label="Theme"
      style={{ '--theme-index': index } as React.CSSProperties}
    >
      <span className="SiteThemeThumb" aria-hidden />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          aria-label={labels ? undefined : option.label}
          title={labels ? undefined : option.label}
          className="SiteThemeOption"
          onClick={() => {
            setTheme(option.value);
            listeners.forEach((listener) => listener());
          }}
        >
          {option.icon}
          {labels && option.label}
        </button>
      ))}
    </div>
  );
}
