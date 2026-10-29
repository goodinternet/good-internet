import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';
import { ArrowIcon, ArrowLink, Separator } from './parts.tsx';
import { requestInvite } from './repository.ts';

// /request: ask for an invite. Good Internet is invite-only; the owner lets people in by hand.
export function GoodInternetRequest() {
  const [pending, setPending] = React.useState(false);
  const [sent, setSent] = React.useState<{ email: string; alreadyRequested: boolean } | null>(null);

  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">Request an invite</h1>
      </section>

      <section className="GoodInternetContents">
        <p className="GoodInternetText2 GoodInternetCol-body">
          Good Internet is invite-only while it’s in early development. Every account is let in by hand, so
          tell us a little about what you’d keep.
        </p>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-request">
        <h2 id="gi-request" className="GoodInternetText2 GoodInternetCol-label">
          {sent ? 'Sent' : 'Your details'}
        </h2>

        {sent ? (
          <div className="GoodInternetCol-body GoodInternetStack GoodInternetStack-4" role="status">
            <p className="GoodInternetText2">
              {sent.alreadyRequested
                ? 'You’re already on the list.'
                : 'You’re on the list.'}
            </p>
            <p className="GoodInternetText2 GoodInternetMuted">
              {sent.alreadyRequested
                ? `A request from ${sent.email} is already waiting. You’ll hear back there.`
                : `You’ll hear back at ${sent.email} once your account is ready.`}
            </p>
            <div className="GoodInternetStack GoodInternetStack-2">
              <ArrowLink href="/">Back to Good Internet</ArrowLink>
              <a className="GoodInternetLink GoodInternetText1" href="/login">
                Already have an account? Sign in
              </a>
            </div>
          </div>
        ) : (
          <Form
            className="GoodInternetForm GoodInternetCol-body"
            onFormSubmit={async (values) => {
              setPending(true);
              const email = String(values.email).trim().toLowerCase();
              let alreadyRequested: boolean;
              try {
                ({ alreadyRequested } = await requestInvite({
                  name: String(values.name),
                  email,
                  note: String(values.note ?? ''),
                }));
              } finally {
                setPending(false);
              }
              setSent({ email, alreadyRequested });
            }}
          >
            <div className="GoodInternetList">
              <Field.Root name="name" className="GoodInternetListItem GoodInternetField">
                <Field.Label className="GoodInternetText2 GoodInternetFieldLabel">Name</Field.Label>
                <div className="GoodInternetFieldBody">
                  <Field.Control
                    required
                    maxLength={80}
                    autoComplete="name"
                    className="GoodInternetText2 GoodInternetInput"
                  />
                  <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="valueMissing">
                    Enter your name.
                  </Field.Error>
                </div>
              </Field.Root>
              <Field.Root name="email" className="GoodInternetListItem GoodInternetField">
                <Field.Label className="GoodInternetText2 GoodInternetFieldLabel">Email</Field.Label>
                <div className="GoodInternetFieldBody">
                  <Field.Control
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    className="GoodInternetText2 GoodInternetInput"
                  />
                  <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="valueMissing">
                    Enter your email.
                  </Field.Error>
                  <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="typeMismatch">
                    That doesn’t look like an email.
                  </Field.Error>
                </div>
              </Field.Root>
              <Field.Root name="note" className="GoodInternetListItem GoodInternetField">
                <Field.Label className="GoodInternetText2 GoodInternetFieldLabel">
                  What would you keep? <span className="GoodInternetMuted">Optional</span>
                </Field.Label>
                <div className="GoodInternetFieldBody">
                  <Field.Control
                    render={<textarea rows={3} />}
                    maxLength={500}
                    className="GoodInternetText2 GoodInternetInput GoodInternetTextarea GoodInternetTextareaShort"
                    placeholder="Type specimens, packaging, a moodboard for a brand…"
                  />
                </div>
              </Field.Root>
            </div>

            <div className="GoodInternetFormActions">
              <Button
                type="submit"
                disabled={pending}
                focusableWhenDisabled
                className="GoodInternetLink GoodInternetLinkArrow GoodInternetText2 GoodInternetButtonReset"
              >
                {pending ? 'Sending…' : 'Send request'}
                <ArrowIcon />
              </Button>
              <a className="GoodInternetLink GoodInternetText1" href="/login">
                Already have an account? Sign in
              </a>
            </div>
          </Form>
        )}
      </section>
    </>
  );
}
