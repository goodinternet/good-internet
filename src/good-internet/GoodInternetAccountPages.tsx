import { Separator } from './parts.tsx';

const SETTINGS = [
  ['Account', 'Username, password and email.'],
  ['Two-factor', 'Set up or reset your authenticator app.'],
  ['Appearance', 'Light, dark or match system. Already works, from the menu under your name.'],
  ['Boards', 'Everything you’ve shared, with its link, in one place.'],
  ['Export', 'Download your library.'],
  ['Delete account', 'Remove your account and everything in it.'],
] as const;

// Settings (signed in): coming soon. This says what it will hold.

export function GoodInternetSettings() {
  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">Settings</h1>
      </section>
      <section className="GoodInternetContents">
        <p className="GoodInternetText2 GoodInternetMuted GoodInternetCol-body">Coming soon.</p>
      </section>
      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-settings-details">
        <h2 id="gi-settings-details" className="GoodInternetText2 GoodInternetCol-label">
          What will live here
        </h2>
        <div className="GoodInternetCol-body">
          <dl className="GoodInternetList GoodInternetDetails GoodInternetListWide">
            {SETTINGS.map(([term, detail]) => (
              <div key={term} className="GoodInternetListItem">
                <dt className="GoodInternetText2">{term}</dt>
                <dd className="GoodInternetText2">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
