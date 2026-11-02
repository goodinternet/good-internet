// STAND-IN for the mailing-list backend. Nothing is sent or stored yet: this only waits a beat and
// resolves, so the form's success state can be designed. Replace the body with a real request
// (Resend, Loops, Formspree, a Vercel function, ...) before relying on the form.
export async function joinList(email: string): Promise<void> {
  void email;
  await new Promise((resolve) => window.setTimeout(resolve, 600));
}
