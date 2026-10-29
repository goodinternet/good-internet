// Mock auth for the lab. Stands in for Supabase Auth (username + password, then TOTP to reach AAL2).
// Good Internet is invite-only: accounts are created by hand, so there is no sign-up call.
// Lives in sessionStorage so a refresh mid-2FA keeps you on /login/mfa, as the v0 plan asks.

export type AuthLevel = 'aal1' | 'aal2';

export interface GoodInternetSession {
  username: string;
  aal: AuthLevel;
}

const KEY = 'goodinternet.lab.session';

// The one invited account in the lab (local only, not a real credential).
const LAB_ACCOUNTS: Record<string, string> = { wade: '1234' };

// In-memory copy so sign-in still works when storage is blocked (e.g. some private modes).
let memorySession: GoodInternetSession | null = null;

export function getSession(): GoodInternetSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GoodInternetSession) : memorySession;
  } catch {
    return memorySession;
  }
}

function setSession(session: GoodInternetSession | null) {
  memorySession = session;
  try {
    if (session) sessionStorage.setItem(KEY, JSON.stringify(session));
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked; the in-memory copy lasts until the page reloads.
  }
}

export async function signInWithPassword(
  username: string,
  password: string,
): Promise<{ error?: { field: 'username' | 'password'; message: string } }> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (LAB_ACCOUNTS[username.toLowerCase()] !== password) {
    return { error: { field: 'password', message: 'Username or password is incorrect.' } };
  }
  // Two-factor isn't built yet, so the lab account goes straight to AAL2.
  setSession({ username: username.toLowerCase(), aal: 'aal2' });
  return {};
}

// Stand-in for the TOTP challenge until /login/mfa is built: promotes the session to AAL2.
export function completeMfaForLab() {
  const session = getSession();
  if (session) setSession({ ...session, aal: 'aal2' });
}

export function signOut() {
  setSession(null);
}
