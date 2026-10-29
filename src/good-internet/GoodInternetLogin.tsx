import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';
import { ArrowIcon, Separator } from './parts.tsx';
import { signInWithPassword } from './session.ts';
import { navigate } from './navigate.ts';

// /login: username + password (invite-only; accounts are created by hand).
// Two-factor comes later; for now success goes straight to the library.
export function GoodInternetLogin() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, setPending] = React.useState(false);
  const clearError = (field: string) => () =>
    setErrors((current) => {
      if (!(field in current)) return current;
      const { [field]: _removed, ...rest } = current;
      return rest;
    });

  return (
    <>
      <section className="GoodInternetContents">
        <h1 className="GoodInternetDisplay GoodInternetCol-hero">Sign in</h1>
      </section>

      <section className="GoodInternetContents">
        <p className="GoodInternetText2 GoodInternetCol-body">
          Good Internet is in early development. Sign in with the username you were given.
        </p>
      </section>

      <Separator />
      <section className="GoodInternetContents" aria-labelledby="gi-account">
        <h2 id="gi-account" className="GoodInternetText2 GoodInternetCol-label">
          Account
        </h2>
        <Form
          className="GoodInternetForm GoodInternetCol-body"
          errors={errors}
          onFormSubmit={async (values) => {
            setPending(true);
            let error;
            try {
              ({ error } = await signInWithPassword(
                String(values.username),
                String(values.password),
              ));
            } finally {
              setPending(false);
            }
            if (error) {
              setErrors({ [error.field]: error.message });
              return;
            }
            navigate('/library');
          }}
        >
          <div className="GoodInternetList">
            <Field.Root name="username" className="GoodInternetListItem GoodInternetField">
              <Field.Label className="GoodInternetText2 GoodInternetFieldLabel">Username</Field.Label>
              <div className="GoodInternetFieldBody">
                <Field.Control
                  onValueChange={clearError('username')}
                  required
                  pattern="[A-Za-z0-9._\-]{2,32}"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="GoodInternetText2 GoodInternetInput"
                />
                <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="valueMissing">
                  Enter your username.
                </Field.Error>
                <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="patternMismatch">
                  Usernames are 2–32 letters, numbers, dots, dashes or underscores.
                </Field.Error>
                {errors.username && (
                  <Field.Error className="GoodInternetText1 GoodInternetFieldError" match>
                    {errors.username}
                  </Field.Error>
                )}
              </div>
            </Field.Root>
            <Field.Root name="password" className="GoodInternetListItem GoodInternetField">
              <Field.Label className="GoodInternetText2 GoodInternetFieldLabel">Password</Field.Label>
              <div className="GoodInternetFieldBody">
                <Field.Control
                  type="password"
                  onValueChange={clearError('password')}
                  required
                  autoComplete="current-password"
                  className="GoodInternetText2 GoodInternetInput"
                />
                <Field.Error className="GoodInternetText1 GoodInternetFieldError" match="valueMissing">
                  Enter your password.
                </Field.Error>
                {errors.password && (
                  <Field.Error className="GoodInternetText1 GoodInternetFieldError" match>
                    {errors.password}
                  </Field.Error>
                )}
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
              {pending ? 'Signing in…' : 'Continue'}
              <ArrowIcon />
            </Button>
          </div>
        </Form>
      </section>
    </>
  );
}
