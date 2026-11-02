import type { IconComponent } from "../lib/icon-context";

// Custom 24x24 glyphs for the Platform cards. Strokes use currentColor so the card's
// muted-foreground color applies; stroke width stays at the authored 2.
const base = { viewBox: "0 0 24 24", fill: "none" } as const;
const stroke = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const CollectIcon: IconComponent = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...base} width={size} height={size} className={className} aria-hidden="true">
    <path {...stroke} d="M17 19H18C19.6569 19 21 17.6569 21 16V10C21 8.34315 19.6569 7 18 7H13.0704C12.4017 7 11.7772 6.6658 11.4063 6.1094L10.8906 5.3359C10.3342 4.5013 9.39751 4 8.39445 4H6C4.34315 4 3 5.34315 3 7V16C3 17.6569 4.34315 19 6 19H7" />
    <path {...stroke} d="M12 19V13.5" />
    <path {...stroke} d="M9.5 15.5L12 13L14.5 15.5" />
  </svg>
);

export const PreserveIcon: IconComponent = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...base} width={size} height={size} className={className} aria-hidden="true">
    <path {...stroke} d="M9.5 11.75L11 13.25L14.5 9.75M20 11.9123V7.17737C20 6.32338 19.4578 5.56361 18.6502 5.286L12.9752 3.33524C12.3432 3.11799 11.6568 3.11799 11.0248 3.33524L5.34984 5.286C4.54224 5.56361 4 6.32338 4 7.17737V11.9123C4 16.8848 8 19 12 21.1579C16 19 20 16.8848 20 11.9123Z" />
  </svg>
);

export const OrganizeIcon: IconComponent = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...base} width={size} height={size} className={className} aria-hidden="true">
    <path stroke="currentColor" strokeWidth={2} strokeLinejoin="round" d="M17.1716 4H6.82843C5.26633 4 4 5.26633 4 6.82843C4 7.57857 4.29799 8.29799 4.82843 8.82843L9.12132 13.1213C9.68393 13.6839 10 14.447 10 15.2426V20.057C10 20.7552 10.6974 21.2385 11.3511 20.9933L13.3511 20.2433C13.7414 20.097 14 19.7238 14 19.307V15.2426C14 14.447 14.3161 13.6839 14.8787 13.1213L19.1716 8.82843C19.702 8.29799 20 7.57857 20 6.82843C20 5.26633 18.7337 4 17.1716 4Z" />
  </svg>
);

export const RetrieveIcon: IconComponent = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...base} width={size} height={size} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={2} />
    <path {...stroke} d="M15 15L17 17" />
    <path {...stroke} d="M14.8735 20.5309C13.0122 21.1564 10.9868 21.1564 9.12546 20.5309M20.5304 9.12595C21.1559 10.9873 21.1559 13.0126 20.5304 14.874M9.12549 3.46912C10.9869 2.84362 13.0122 2.84363 14.8736 3.46913M3.46864 14.874C2.84314 13.0127 2.84313 10.9874 3.46864 9.12598" />
  </svg>
);
